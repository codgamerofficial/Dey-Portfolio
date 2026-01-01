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
        if (!mediaRef.current || currentTrack.type === 'mock') return;

        try {
            // Check if context already exists
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!audioCtxRef.current) {
                audioCtxRef.current = new AudioContext();
            }

            // Resume if suspended (browsers auto-suspend)
            if (audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
            }

            // Create source node ONLY ONCE
            if (!sourceRef.current) {
                // IMPORTANT: For local blobs, crossOrigin isn't needed but for external URLs it is
                // mediaRef.current.crossOrigin = "anonymous"; 

                const source = audioCtxRef.current.createMediaElementSource(mediaRef.current);
                sourceRef.current = source;

                const analyser = audioCtxRef.current.createAnalyser();
                analyser.fftSize = 256;
                analyser.smoothingTimeConstant = 0.8;
                analyserRef.current = analyser;

                source.connect(analyser);
                analyser.connect(audioCtxRef.current.destination);
            }
        } catch (error) {
            console.warn("Audio/Visualizer Init Error:", error);
        }
    };

    // Controls Logic
    const togglePlay = async () => {
        if (currentTrack.type === 'mock') {
            setIsPlaying(!isPlaying);
        } else {
            if (mediaRef.current) {
                // Ensure Context is Ready
                initAudioContext();

                // Double check resume state
                if (audioCtxRef.current?.state === 'suspended') {
                    await audioCtxRef.current.resume();
                }

                if (isPlaying) {
                    mediaRef.current.pause();
                } else {
                    try {
                        await mediaRef.current.play();
                    } catch (e) {
                        console.error("Playback Failed:", e);
                        // Fallback UI or Alert
                    }
                }
                setIsPlaying(!isPlaying);
            }
        }
    };

    const nextTrack = () => { setCurrentTrackIndex((p) => (p + 1) % playlist.length); setIsPlaying(true); };
    const prevTrack = () => { setCurrentTrackIndex((p) => (p - 1 + playlist.length) % playlist.length); setIsPlaying(true); };

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
            const radius = 60;

            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#00f2ea'); // Cyan
            gradient.addColorStop(0.5, '#ff0050'); // Red/Pink
            gradient.addColorStop(1, '#7a00ff'); // Violet

            ctx.lineWidth = 3;
            ctx.lineCap = 'round';

            for (let i = 0; i < bufferLength; i++) {
                const barHeight = (dataArray[i] / 255) * 100;
                const angle = (i * 2 * Math.PI) / bufferLength;

                const x1 = centerX + Math.cos(angle) * (radius + 10);
                const y1 = centerY + Math.sin(angle) * (radius + 10);
                const x2 = centerX + Math.cos(angle) * (radius + 10 + barHeight);
                const y2 = centerY + Math.sin(angle) * (radius + 10 + barHeight);

                ctx.strokeStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
            }

            // Dynamic Pulse
            const average = dataArray.reduce((prev, curr) => prev + curr, 0) / bufferLength;
            if (average > 40) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius + (average / 3), 0, 2 * Math.PI);
                ctx.strokeStyle = `rgba(255, 255, 255, ${average / 300})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }

            animationFrameRef.current = requestAnimationFrame(renderVisualizer);
        };

        renderVisualizer();

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }
    }, [isPlaying, currentTrack]);

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

    // Spotify Integration State
    const [showSpotify, setShowSpotify] = useState(false);

    return (
        <div
            className="h-full w-full"
            style={{ perspective: '1200px' }} // Deeper perspective
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            ref={containerRef}
        >
            <motion.div
                className="glass-strong rounded-[2rem] p-6 h-full flex flex-col justify-between border border-white/10 relative overflow-hidden bg-black/40 backdrop-blur-xl"
                animate={{
                    rotateX: tilt.x,
                    rotateY: tilt.y,
                    boxShadow: Math.abs(tilt.x) > 0
                        ? '0 25px 60px -12px rgba(0,0,0,0.7), 0 0 40px rgba(var(--neon-blue-rgb), 0.2)'
                        : '0 10px 40px -10px rgba(0,0,0,0.5)'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Holographic Grid Background */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.07] pointer-events-none mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-blue)]/5 via-transparent to-[var(--neon-purple)]/5 pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center z-30 transform translate-z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        <span className="relative flex h-3 w-3">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </span>
                        <span className="tracking-[0.2em] text-sm">SONIC<span className="text-[var(--neon-blue)]">LINK</span></span>
                    </h3>

                    <div className="flex items-center gap-3">
                        {/* Stream Mode Toggle */}
                        <button
                            onClick={() => setShowSpotify(!showSpotify)}
                            className={`p-2 rounded-full transition-all border backdrop-blur-md ${showSpotify ? 'bg-[#1DB954] border-[#1DB954] text-black shadow-[0_0_15px_#1DB954]' : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30'}`}
                            title="Spotify Uplink"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.199.78-1.38 4.199-1.261 11.341-1.02 15.72 1.56.6.36.78 1.14.42 1.74-.3.6-1.02.78-1.62.42z" /></svg>
                        </button>

                        <input type="file" ref={fileInputRef} className="hidden" accept="audio/*,video/*" onChange={handleFileUpload} />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-[var(--neon-blue)] hover:text-white transition-all text-[var(--neon-blue)] border border-[var(--neon-blue)]/30 hover:shadow-[0_0_15px_var(--neon-blue)] backdrop-blur-md group"
                        >
                            <span className="text-[10px] font-bold tracking-widest group-hover:tracking-[0.15em] transition-all">TAP TO UPLOAD VIBES</span>
                            <span className="text-xs">⬆️</span>
                        </button>
                    </div>
                </div>

                {/* 3D Visualizer Stage */}
                <div className="flex-1 flex flex-col justify-center items-center relative preserve-3d isolate overflow-hidden py-4">

                    {/* Spotify Overlay - Conditional */}
                    <AnimatePresence>
                        {showSpotify && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
                                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                                exit={{ opacity: 0, scale: 0.8, rotateX: -20 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="absolute inset-2 z-50 bg-black flex items-center justify-center rounded-2xl border border-[#1DB954]/50 shadow-[0_0_50px_rgba(29,185,84,0.3)] overflow-hidden"
                            >
                                <iframe
                                    src="https://open.spotify.com/embed/artist/4EXTUyxQQ2xYoiCyhDGBwH?utm_source=generator&theme=0"
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                />
                                <button
                                    onClick={() => setShowSpotify(false)}
                                    className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/50 rounded-full p-1"
                                >✕</button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Canvas Overlay */}
                    <canvas
                        ref={canvasRef}
                        width={600}
                        height={400}
                        className="absolute inset-0 w-full h-full pointer-events-none z-10 mix-blend-screen opacity-100"
                    />

                    {/* Central Entity */}
                    <div className={`relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center translate-z-20 group transition-all duration-500 ${showSpotify ? 'scale-[0.8] opacity-0 blur-xl translate-y-20' : ''}`}>

                        {currentTrack.type === 'video' ? (
                            <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-[var(--neon-blue)] relative z-20 shadow-[0_0_30px_rgba(0,242,234,0.3)] bg-black">
                                <video ref={mediaRef} className="w-full h-full object-cover" onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)} onEnded={nextTrack} src={currentTrack.src} muted={false} playsInline />
                            </div>
                        ) : (
                            <>
                                {currentTrack.type !== 'mock' && <audio ref={mediaRef as any} className="hidden" crossOrigin="anonymous" onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)} onEnded={nextTrack} />}
                                <motion.div
                                    className="w-full h-full rounded-full bg-black border-[3px] border-white/20 flex items-center justify-center relative shadow-[0_0_60px_rgba(0,242,234,0.15)] z-20 overflow-hidden"
                                    animate={{ rotate: isPlaying ? 360 : 0 }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                                >
                                    {/* Album Art Gradient */}
                                    <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-black via-gray-900 to-[#1a1a1a] flex items-center justify-center">
                                        {/* Vinyl Grooves */}
                                        <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: 'scale(0.9)' }} />
                                        <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: 'scale(0.8)' }} />
                                        <div className="absolute inset-0 rounded-full border border-white/5" style={{ transform: 'scale(0.6)' }} />

                                        <div className="text-5xl filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] relative z-10 animate-pulse-slow">
                                            {currentTrack.type === 'mock' ? '🕷️' : '🎵'}
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {/* Back Glow */}
                        <div className="absolute inset-0 rounded-full bg-[var(--neon-blue)] blur-[80px] opacity-20 animate-pulse" />
                    </div>
                </div>

                {/* Track Info */}
                <div className="text-center z-30 mb-6 transform translate-z-10 relative">
                    <div className="inline-block px-6 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 shadow-lg">
                        <h2 className="text-xl font-bold text-white mb-0.5 truncate tracking-wide drop-shadow-md">{currentTrack.title}</h2>
                        <p className="text-[var(--neon-blue)] text-xs tracking-[0.2em] uppercase font-bold opacity-80">{currentTrack.artist}</p>
                    </div>
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
