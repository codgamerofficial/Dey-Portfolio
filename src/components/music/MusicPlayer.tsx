'use client';

import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useMusicStore } from '@/lib/store/useMusicStore';
import FullScreenPlayer from './FullScreenPlayer';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Repeat, Shuffle, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import QueueDrawer from './QueueDrawer'; // Future import

export default function MusicPlayer() {
    const {
        currentTrack, isPlaying, volume, isMuted, shuffle, repeat,
        play, pause, playNext, playPrev, setCurrentTime, setVolume,
        toggleShuffle, toggleRepeat, toggleMute
    } = useMusicStore();

    const soundRef = useRef<Howl | null>(null);
    const [progress, setProgress] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false); // Fullscreen toggle
    const [showQueue, setShowQueue] = useState(false); // Queue toggle

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    if (isPlaying) pause(); else play();
                    break;
                case 'ArrowRight':
                    playNext();
                    break;
                case 'ArrowLeft':
                    playPrev();
                    break;
                case 'KeyM':
                    toggleMute();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, playNext, playPrev, toggleMute]);

    // Initial Sound Setup
    useEffect(() => {
        if (currentTrack) {
            if (soundRef.current) {
                soundRef.current.unload();
            }

            const sound = new Howl({
                src: [currentTrack.audioUrl],
                html5: true, // Force HTML5 Audio for streaming
                volume: isMuted ? 0 : volume,
                onplay: () => play(),
                onpause: () => pause(),
                onend: () => playNext(),
                onloaderror: (id, err) => console.error('Load Error:', err),
                onplayerror: (id, err) => {
                    console.error('Play Error:', err);
                    sound.once('unlock', () => sound.play());
                }
            });

            soundRef.current = sound;
            sound.play();

            // Progress Loop
            const timer = setInterval(() => {
                if (sound.playing()) {
                    const seek = sound.seek() as number;
                    setCurrentTime(seek);
                    setProgress((seek / sound.duration()) * 100);
                }
            }, 1000);

            return () => {
                clearInterval(timer);
                sound.unload();
            };
        }
    }, [currentTrack]);

    // Handle Play/Pause
    useEffect(() => {
        if (soundRef.current) {
            if (isPlaying && !soundRef.current.playing()) {
                soundRef.current.play();
            } else if (!isPlaying && soundRef.current.playing()) {
                soundRef.current.pause();
            }
        }
    }, [isPlaying]);

    // Handle Volume/Mute
    useEffect(() => {
        if (soundRef.current) {
            soundRef.current.volume(isMuted ? 0 : volume);
        }
    }, [volume, isMuted]);

    if (!currentTrack) return null;

    return (
        <AnimatePresence>
            {isExpanded && <FullScreenPlayer onClose={() => setIsExpanded(false)} />}
            {showQueue && <QueueDrawer onClose={() => setShowQueue(false)} />}

            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
            >
                <div className="max-w-7xl mx-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-2xl relative overflow-hidden">

                    {/* Glassmorphic Glow */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-full bg-[var(--neon-cyan)] blur-[100px] opacity-10 pointer-events-none" />

                    {/* Track Info */}
                    <div className="flex items-center gap-4 w-1/4 z-10">
                        <div className="w-14 h-14 rounded-lg overflow-hidden relative group bg-zinc-800 flex items-center justify-center cursor-pointer" onClick={() => setIsExpanded(true)}>
                            {currentTrack.coverUrl ? (
                                <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                                <div className="text-white/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 size={16} className="text-white drop-shadow-md" />
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-white font-bold truncate text-sm">{currentTrack.title}</h4>
                            <p className="text-white/50 text-xs truncate hover:text-[var(--neon-cyan)] transition-colors cursor-pointer">{currentTrack.artist}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 flex flex-col items-center gap-2 z-10">
                        <div className="flex items-center gap-6">
                            <button
                                className={cn("transition-colors", shuffle ? "text-[var(--neon-cyan)]" : "text-white/40 hover:text-white")}
                                onClick={toggleShuffle}
                                title="Shuffle"
                            >
                                <Shuffle size={16} />
                            </button>

                            <button className="text-white hover:text-[var(--neon-cyan)] transition-colors" onClick={playPrev}><SkipBack size={24} /></button>

                            <button
                                onClick={() => isPlaying ? pause() : play()}
                                className="w-10 h-10 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_20px_var(--neon-cyan)]"
                            >
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                            </button>

                            <button className="text-white hover:text-[var(--neon-cyan)] transition-colors" onClick={playNext}><SkipForward size={24} /></button>

                            <button
                                className={cn("transition-colors relative", repeat !== 'off' ? "text-[var(--neon-cyan)]" : "text-white/40 hover:text-white")}
                                onClick={toggleRepeat}
                                title="Repeat"
                            >
                                <Repeat size={16} />
                                {repeat === 'one' && <span className="absolute -top-1 -right-1 text-[8px] font-bold bg-black rounded-full px-0.5 border border-[var(--neon-cyan)] leading-none text-[var(--neon-cyan)]">1</span>}
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full flex items-center gap-3 group">
                            <span className="text-[10px] text-white/40 font-mono w-8 text-right">
                                {formatTime(soundRef.current?.seek() || 0)}
                            </span>
                            <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer">
                                <motion.div
                                    className="absolute left-0 top-0 bottom-0 bg-[var(--neon-cyan)] rounded-full"
                                    style={{ width: `${progress}%` }}
                                />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={progress}
                                        onChange={(e) => {
                                            const val = Number(e.target.value);
                                            const duration = soundRef.current?.duration() || 0;
                                            soundRef.current?.seek(duration * (val / 100));
                                            setProgress(val);
                                        }}
                                        className="w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                            </div>
                            <span className="text-[10px] text-white/40 font-mono w-8">
                                {formatTime(currentTrack.duration)}
                            </span>
                        </div>
                    </div>

                    {/* Volume & Extras */}
                    <div className="w-1/4 flex items-center justify-end gap-4 z-10">
                        <button
                            className={cn("transition-colors", showQueue ? "text-[var(--neon-cyan)]" : "text-white/40 hover:text-white")}
                            onClick={() => setShowQueue(!showQueue)}
                            title="Queue"
                        >
                            <ListMusic size={18} />
                        </button>

                        <div className="flex items-center gap-2 group/vol">
                            <button onClick={toggleMute} className="text-white/60 hover:text-white">
                                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                            </button>
                            <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden relative group">
                                <div className="absolute left-0 top-0 bottom-0 bg-white/60 group-hover/vol:bg-[var(--neon-cyan)] transition-colors" style={{ width: `${isMuted ? 0 : volume * 100}%` }} />
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => {
                                        if (isMuted) toggleMute();
                                        setVolume(Number(e.target.value))
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-white/40 hover:text-white transition-colors"
                            title="Full Screen Player"
                        >
                            <Maximize2 size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
