'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Track {
    id: string;
    title: string;
    artist: string;
    type: 'audio' | 'video' | 'mock';
    src?: string;
    duration: number; // For mocks, fixed. For real, loaded.
}

const MOCK_PLAYLIST: Track[] = [
    { id: '1', title: "Sunflower", artist: "Post Malone, Swae Lee", type: 'mock', duration: 158 },
    { id: '2', title: "What's Up Danger", artist: "Blackway, Black Caviar", type: 'mock', duration: 222 },
];

export default function SpiderPlayer() {
    const [playlist, setPlaylist] = useState<Track[]>(MOCK_PLAYLIST);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    // Component Refs
    const containerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Audio Context Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const animationFrameRef = useRef<number>(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const currentTrack = playlist[currentTrackIndex];

    // 3D Tilt Effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Max tilt 15 degrees
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    // Handle File Upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video') ? 'video' : 'audio';

        const newTrack: Track = {
            id: Date.now().toString(),
            title: file.name.replace(/\.[^/.]+$/, "").slice(0, 20),
            artist: "Local Upload",
            type,
            src: url,
            duration: 0
        };

        setPlaylist((prev) => [...prev, newTrack]);
        setCurrentTrackIndex(playlist.length);
        setIsPlaying(true);
    };

    // Initialize Web Audio API
    const initAudioContext = () => {
        if (!mediaRef.current || currentTrack.type === 'mock' || audioCtxRef.current) return;

        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContext();
            audioCtxRef.current = ctx;

            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.8;
            analyserRef.current = analyser;

            // In React STRICT MODE or some routing cases, this hook can fire twice.
            // But we check `audioCtxRef.current` first.
            const source = ctx.createMediaElementSource(mediaRef.current);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            sourceRef.current = source;
        } catch (error) {
            console.warn("Audio Context Init Failed:", error);
        }
    };

    // Visualizer Loop
    useEffect(() => {
        if (!isPlaying || currentTrack.type === 'mock') {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            const ctx = canvasRef.current?.getContext('2d');
            ctx?.clearRect(0, 0, 800, 600);
            return;
        }

        const renderVisualizer = () => {
            const canvas = canvasRef.current;
            const analyser = analyserRef.current;

            if (!canvas || !analyser) {
                animationFrameRef.current = requestAnimationFrame(renderVisualizer);
                return;
            }

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            // Radius should match the video container somewhat
            const radius = 60;

            ctx.lineWidth = 2;

            // Dynamic glow
            const average = dataArray.reduce((prev, curr) => prev + curr, 0) / bufferLength;
            ctx.shadowBlur = average / 5 + 5;
            ctx.shadowColor = '#ff0000'; // Neon Red

            // Draw Circular Spectrum
            // Buffer usually 128 items (fftSize 256).
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * 80;

                const r = 255;
                const g = 0;
                const b = barHeight * 2; // Purple hint on high volume

                ctx.strokeStyle = `rgb(${r},${g},${b})`;

                // Angle
                const angle = (i * 2 * Math.PI) / bufferLength;

                const x1 = centerX + Math.cos(angle) * (radius + 5);
                const y1 = centerY + Math.sin(angle) * (radius + 5);
                const x2 = centerX + Math.cos(angle) * (radius + 5 + barHeight);
                const y2 = centerY + Math.sin(angle) * (radius + 5 + barHeight);

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            // Draw Pulse Circle in center
            if (average > 50) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius + (average / 4), 0, 2 * Math.PI);
                ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`;
                ctx.stroke();
            }

            animationFrameRef.current = requestAnimationFrame(renderVisualizer);
        };

        renderVisualizer();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
    }, [isPlaying, currentTrack]);


    // Controls Logic
    const togglePlay = async () => {
        if (currentTrack.type === 'mock') {
            setIsPlaying(!isPlaying);
        } else {
            if (mediaRef.current) {
                if (!audioCtxRef.current) initAudioContext();

                if (audioCtxRef.current?.state === 'suspended') {
                    await audioCtxRef.current.resume();
                }

                if (isPlaying) mediaRef.current.pause();
                else mediaRef.current.play();
                setIsPlaying(!isPlaying);
            }
        }
    };

    const nextTrack = () => { setCurrentTrackIndex((p) => (p + 1) % playlist.length); setIsPlaying(true); };
    const prevTrack = () => { setCurrentTrackIndex((p) => (p - 1 + playlist.length) % playlist.length); setIsPlaying(true); };

    useEffect(() => {
        if (currentTrack.type !== 'mock' && mediaRef.current) {
            mediaRef.current.src = currentTrack.src!;
            mediaRef.current.load();
            if (isPlaying) mediaRef.current.play().catch(() => { });
        }
    }, [currentTrack]);

    // Mock Progress
    useEffect(() => {
        if (currentTrack.type === 'mock' && isPlaying) {
            intervalRef.current = setInterval(() => {
                setProgress(p => p >= currentTrack.duration ? 0 : p + 1);
            }, 1000);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); }
    }, [isPlaying, currentTrack]);

    const formatTime = (secs: number) => new Date(Math.max(0, secs) * 1000).toISOString().substr(14, 5);

    return (
        <div
            className="h-full w-full"
            style={{ perspective: '1000px' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={containerRef}
        >
            <motion.div
                className="glass-strong rounded-3xl p-6 h-full flex flex-col justify-between border border-[var(--glass-border)] relative overflow-hidden"
                animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                    boxShadow: Math.abs(tilt.x) > 0
                        ? '0 20px 50px rgba(168,85,247,0.2)'
                        : '0 8px 32px rgba(0,0,0,0.5)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Header */}
                <div className="flex justify-between items-center z-30 transform translate-z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2 drop-shadow-md">
                        <span className="animate-pulse text-[var(--neon-blue)]">📻</span>
                        <span className="tracking-wider">SONIC DISK</span>
                    </h3>

                    <div className="flex items-center gap-2">
                        <input type="file" ref={fileInputRef} className="hidden" accept="audio/*,video/*" onChange={handleFileUpload} />
                        <button onClick={() => fileInputRef.current?.click()} className="p-2 rounded-full bg-white/5 hover:bg-[var(--neon-blue)] hover:text-white transition-colors text-[var(--neon-blue)] border border-[var(--neon-blue)]/30 hover:shadow-[0_0_15px_var(--neon-blue)]">
                            <span className="sr-only">Upload</span>
                            ⬆️
                        </button>
                    </div>
                </div>

                {/* 3D Visualizer Stage */}
                <div className="flex-1 flex flex-col justify-center items-center relative preserve-3d isolate">

                    {/* Canvas Overlay */}
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={300}
                        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-90 mix-blend-screen"
                    />

                    {/* Central Entity */}
                    <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center translate-z-20 group">

                        {currentTrack.type === 'video' ? (
                            <video
                                ref={mediaRef}
                                className="w-full h-full object-cover rounded-2xl shadow-[0_0_50px_rgba(255,0,0,0.3)] border-2 border-[var(--neon-blue)] relative z-20"
                                onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                                onEnded={nextTrack}
                                src={currentTrack.src}
                                muted={false}
                            />
                        ) : (
                            <>
                                {currentTrack.type !== 'mock' && (
                                    <audio
                                        ref={mediaRef as any}
                                        className="hidden"
                                        crossOrigin="anonymous"
                                        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                                        onEnded={nextTrack}
                                    />
                                )}

                                <motion.div
                                    className="w-full h-full rounded-full bg-black border-4 border-[var(--neon-blue)] flex items-center justify-center relative shadow-[0_0_50px_rgba(255,0,0,0.5)] z-20"
                                    animate={{ rotate: isPlaying ? 360 : 0 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                >
                                    <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-gray-900 to-black overflow-hidden flex items-center justify-center">
                                        <div className="w-full h-full bg-[url('/grid.svg')] opacity-20" />
                                        <div className="text-6xl filter drop-shadow-[0_0_10px_white]">
                                            {currentTrack.type === 'mock' ? '🕷️' : '🔊'}
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>

                {/* Track Info */}
                <div className="text-center z-30 mb-4 transform translate-z-10 bg-black/40 backdrop-blur px-4 py-2 rounded-xl">
                    <h2 className="text-2xl font-bold text-white mb-1 truncate drop-shadow-md">{currentTrack.title}</h2>
                    <p className="text-[var(--neon-blue)] text-sm tracking-widest uppercase font-mono">{currentTrack.artist}</p>
                </div>

                {/* Controls */}
                <div className="z-30 bg-black/60 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-2xl transform translate-z-20">
                    <div className="flex items-center gap-3 text-xs font-mono text-[var(--text-tertiary)] mb-4">
                        <span>{formatTime(progress)}</span>
                        <div
                            className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer group"
                            onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const percent = (e.clientX - rect.left) / rect.width;
                                const dur = mediaRef.current?.duration || currentTrack.duration;
                                if (mediaRef.current && currentTrack.type !== 'mock') mediaRef.current.currentTime = percent * dur;
                                setProgress(percent * dur);
                            }}
                        >
                            <div
                                className="h-full bg-[var(--neon-blue)] relative"
                                style={{ width: `${(progress / (mediaRef.current?.duration || currentTrack.duration || 100)) * 100}%` }}
                            >
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <span>{formatTime(mediaRef.current?.duration || currentTrack.duration)}</span>
                    </div>

                    <div className="flex justify-center items-center gap-8">
                        <button onClick={prevTrack} className="text-white/50 hover:text-white transition-colors hover:scale-110 active:scale-95">⏮️</button>

                        <button
                            onClick={togglePlay}
                            className="w-16 h-16 rounded-full bg-[var(--neon-blue)] text-white flex items-center justify-center shadow-[0_0_30px_rgba(255,0,0,0.5)] hover:bg-white hover:text-black hover:scale-110 transition-all duration-300"
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>

                        <button onClick={nextTrack} className="text-white/50 hover:text-white transition-colors hover:scale-110 active:scale-95">⏭️</button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
