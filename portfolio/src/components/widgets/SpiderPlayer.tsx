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

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRef = useRef<HTMLVideoElement>(null); // Shared for audio/video (video tag handles audio too mostly, or switch)
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const currentTrack = playlist[currentTrackIndex];

    // Handle File Upload
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        const type = file.type.startsWith('video') ? 'video' : 'audio';

        const newTrack: Track = {
            id: Date.now().toString(),
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Local Upload",
            type,
            src: url,
            duration: 0 // Will be set on metadata load
        };

        setPlaylist((prev) => [...prev, newTrack]);
        // Auto play the new track
        setCurrentTrackIndex(playlist.length);
        setIsPlaying(true);
    };

    // Toggle Play
    const togglePlay = () => {
        if (currentTrack.type === 'mock') {
            setIsPlaying(!isPlaying);
        } else {
            if (mediaRef.current) {
                if (isPlaying) mediaRef.current.pause();
                else mediaRef.current.play();
                setIsPlaying(!isPlaying);
            }
        }
    };

    // Navigation
    const nextTrack = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
        setIsPlaying(true); // Auto play next
    };

    const prevTrack = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
        setIsPlaying(true);
    };

    // Effect: Handle Mock vs Real
    useEffect(() => {
        setProgress(0);

        // If real media, auto-play if isPlaying is true
        if (currentTrack.type !== 'mock' && mediaRef.current) {
            mediaRef.current.src = currentTrack.src!;
            mediaRef.current.load();
            if (isPlaying) {
                mediaRef.current.play().catch(e => console.error("Play error", e));
            }
        }
    }, [currentTrack]);

    // Effect: Watch State for Play/Pause changes (for existing track)
    useEffect(() => {
        if (currentTrack.type !== 'mock' && mediaRef.current) {
            if (isPlaying) mediaRef.current.play().catch(() => { });
            else mediaRef.current.pause();
        }
    }, [isPlaying, currentTrack]);

    // Effect: Progress Logic
    useEffect(() => {
        if (currentTrack.type === 'mock') {
            // Mock Simulation
            if (isPlaying) {
                intervalRef.current = setInterval(() => {
                    setProgress((prev) => {
                        if (prev >= currentTrack.duration) {
                            nextTrack();
                            return 0;
                        }
                        return prev + 1;
                    });
                }, 1000);
            } else if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        } else {
            // Real Media Events handled via onTimeUpdate prop
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isPlaying, currentTrackIndex]);

    const formatTime = (secs: number) => {
        return new Date(Math.max(0, secs) * 1000).toISOString().substr(14, 5);
    };

    return (
        <div className="glass-strong rounded-3xl p-6 h-full flex flex-col justify-between border border-[var(--glass-border)] hover:border-[var(--neon-purple)] transition-colors relative overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center z-10">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>🎧</span> Sonic Link
                </h3>

                {/* Upload Button */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 rounded-full bg-[var(--bg-tertiary)] hover:bg-[var(--neon-purple)] hover:text-white transition-colors text-[var(--neon-purple)]"
                        title="Upload Local File"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="audio/*,video/*"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-center items-center text-center z-10 py-4 relative w-full">

                {/* Visualization / Video Output */}
                <div className="relative w-full aspect-video flex items-center justify-center mb-4">
                    {currentTrack.type === 'video' ? (
                        <video
                            ref={mediaRef}
                            className="w-full h-full object-cover rounded-xl border border-[var(--glass-border)]"
                            onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                            onEnded={nextTrack}
                            onLoadedMetadata={(e) => {
                                // Update duration if needed in state, or just read from ref
                                // For simplicity using e.currentTarget.duration
                            }}
                            src={currentTrack.src}
                        />
                    ) : (
                        // Audio Visualization (Spinning Art)
                        <>
                            {currentTrack.type !== 'mock' && (
                                <audio
                                    ref={mediaRef as any}
                                    onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime)}
                                    onEnded={nextTrack}
                                    src={currentTrack.src}
                                    className="hidden"
                                />
                            )}
                            <motion.div
                                className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--neon-blue)] to-[var(--neon-purple)] shadow-[0_0_30px_rgba(168,85,247,0.4)] flex items-center justify-center relative overflow-hidden"
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-30 animate-pulse" />
                                <span className="text-4xl">{currentTrack.type === 'mock' ? '🕷️' : '🎵'}</span>
                            </motion.div>
                        </>
                    )}
                </div>

                {/* Track Info */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTrack.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full"
                    >
                        <h4 className="text-xl font-bold text-white truncate px-4">{currentTrack.title}</h4>
                        <p className="text-sm text-[var(--text-tertiary)]">{currentTrack.artist}</p>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="z-10 bg-black/40 p-4 rounded-xl backdrop-blur-md border border-white/5">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-4">
                    <span>{formatTime(progress)}</span>
                    <div className="flex-1 h-1.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                        // Seek logic
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        const newTime = percent * (mediaRef.current?.duration || currentTrack.duration);

                        if (currentTrack.type !== 'mock' && mediaRef.current) {
                            mediaRef.current.currentTime = newTime;
                        }
                        setProgress(newTime);
                    }}>
                        <motion.div
                            className="h-full bg-[var(--neon-purple)]"
                            style={{
                                width: `${(progress / (currentTrack.type === 'mock' ? currentTrack.duration : (mediaRef.current?.duration || 100))) * 100}%`
                            }}
                        />
                    </div>
                    <span>{formatTime(currentTrack.type === 'mock' ? currentTrack.duration : (mediaRef.current?.duration || 0))}</span>
                </div>

                <div className="flex justify-around items-center">
                    <button onClick={prevTrack} className="p-2 hover:text-[var(--neon-purple)] transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11 19V5l-9 7 9 7zm11 0V5l-9 7 9 7z" /></svg>
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-[var(--neon-purple)] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-[0_0_20px_var(--neon-purple)]"
                    >
                        {isPlaying ? (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        )}
                    </button>

                    <button onClick={nextTrack} className="p-2 hover:text-[var(--neon-purple)] transition-colors">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M4 19l9-7-9-7v14zm11 0l9-7-9-7v14z" /></svg>
                    </button>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[var(--neon-purple)]/10 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
}
