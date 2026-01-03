'use client';

import { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useMusicStore } from '@/lib/store/useMusicStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize2, Repeat, Shuffle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MusicPlayer() {
    const { currentTrack, isPlaying, volume, play, pause, playNext, playPrev, setCurrentTime } = useMusicStore();
    const soundRef = useRef<Howl | null>(null);
    const [progress, setProgress] = useState(0);

    // Initial Sound Setup
    useEffect(() => {
        if (currentTrack) {
            if (soundRef.current) {
                soundRef.current.unload();
            }

            const sound = new Howl({
                src: [currentTrack.audioUrl],
                html5: true, // Force HTML5 Audio for streaming
                volume: volume,
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
                    const seek = sound.seek();
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

    // Handle Volume
    useEffect(() => {
        if (soundRef.current) {
            soundRef.current.volume(volume);
        }
    }, [volume]);

    if (!currentTrack) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
            >
                <div className="max-w-7xl mx-auto bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-6 shadow-2xl">
                    {/* Track Info */}
                    <div className="flex items-center gap-4 w-1/4">
                        <div className="w-14 h-14 rounded-lg overflow-hidden relative group">
                            <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/20" />
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="text-white font-bold truncate text-sm">{currentTrack.title}</h4>
                            <p className="text-white/50 text-xs truncate hover:text-[var(--neon-cyan)] transition-colors cursor-pointer">{currentTrack.artist}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                        <div className="flex items-center gap-6">
                            <button className="text-white/40 hover:text-white transition-colors" onClick={() => { }}><Shuffle size={16} /></button>
                            <button className="text-white hover:text-[var(--neon-cyan)] transition-colors" onClick={playPrev}><SkipBack size={24} /></button>

                            <button
                                onClick={() => isPlaying ? pause() : play()}
                                className="w-10 h-10 rounded-full bg-[var(--neon-cyan)] flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_20px_var(--neon-cyan)]"
                            >
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                            </button>

                            <button className="text-white hover:text-[var(--neon-cyan)] transition-colors" onClick={playNext}><SkipForward size={24} /></button>
                            <button className="text-white/40 hover:text-white transition-colors" onClick={() => { }}><Repeat size={16} /></button>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full flex items-center gap-3 group">
                            <span className="text-[10px] text-white/40 font-mono">
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
                            <span className="text-[10px] text-white/40 font-mono">
                                {formatTime(currentTrack.duration)}
                            </span>
                        </div>
                    </div>

                    {/* Volume & Extras */}
                    <div className="w-1/4 flex items-center justify-end gap-4">
                        <Volume2 size={18} className="text-white/60" />
                        <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden relative group">
                            <div className="absolute left-0 top-0 bottom-0 bg-white/60 group-hover:bg-[var(--neon-cyan)] transition-colors" style={{ width: `${volume * 100}%` }} />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={(e) => useMusicStore.getState().setVolume(Number(e.target.value))}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
                        <Maximize2 size={18} className="text-white/40 hover:text-white transition-colors cursor-pointer" />
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
