'use client';

import { useMusicStore } from '@/lib/store/useMusicStore';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Minimize2, Repeat, Shuffle, ListMusic } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';


interface FullScreenPlayerProps {
    onClose: () => void;
}

export default function FullScreenPlayer({ onClose }: FullScreenPlayerProps) {
    const {
        currentTrack, isPlaying, volume, isMuted, shuffle, repeat, currentTime,
        play, pause, playNext, playPrev, setVolume, toggleShuffle, toggleRepeat, toggleMute
    } = useMusicStore();

    // We can't access soundRef directly here to seek, but we can update currentTime in store?
    // Actually the Store has setCurrentTime, but that doesn't seek the Howl instance inside MusicPlayer.
    // The MusicPlayer controls the audio source.
    // Ideally, FullScreenPlayer should emit events or control the same store, but "seeking" needs to communicate to the Howler instance.
    // Refactor: The Howl instance is in MusicPlayer. We need a way to seek.
    // Option A: Move Howl to a Context or Custom Hook used by both.
    // Option B: Pass seek handler as prop.
    // Option C: Use a global event bus.
    // For simplicity, let's assume MusicPlayer handles the audio. The progress bar here might be read-only or we need to refactor control.
    // Wait, the Store has `setCurrentTime` but that updates state, it doesn't seek audio.
    // To support seeking from FullScreen, passing a handler from MusicPlayer is best.

    // However, I can't pass props easily if I'm not rendering it directly inside MusicPlayer.
    // I AM rendering it inside MusicPlayer. So I can pass a proper seek handler!

    // For now I'll write the UI. 
    // NOTE: Seek functionality requires refactoring MusicPlayer to pass a seek function. 
    // I will add `onSeek` prop.

    return (
        <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-black/95 flex flex-col items-center justify-center text-white overflow-hidden"
        >
            {/* Background Blur */}
            <div className="absolute inset-0 z-0">
                {currentTrack?.coverUrl && (
                    <img
                        src={currentTrack.coverUrl}
                        className="w-full h-full object-cover blur-[100px] opacity-30 scale-150 animate-pulse-slow"
                        alt="Background"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-4xl px-6 md:px-8 flex flex-col h-full py-6 md:py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-4 md:mb-8 shrink-0">
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Minimize2 size={24} />
                    </button>
                    <span className="text-xs md:text-sm font-medium tracking-widest uppercase text-white/50">Playing from Sonic Nexus</span>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ListMusic size={24} />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-20 min-h-0">
                    {/* Album Art */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full max-w-[300px] md:max-w-[450px] aspect-square relative group shrink-0"
                    >
                        <div className={cn(
                            "w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10",
                            isPlaying ? "animate-breathing-glow" : ""
                        )}>
                            {currentTrack?.coverUrl ? (
                                <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white/20">
                                    <div className="w-32 h-32 rounded-full border-4 border-current flex items-center justify-center">
                                        <div className="w-4 h-4 bg-current rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Controls & Info */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center space-y-6 md:space-y-8 min-h-0">
                        <div className="space-y-1 md:space-y-2 text-center md:text-left shrink-0">
                            <motion.h2
                                key={currentTrack?.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-2xl md:text-5xl font-bold leading-tight truncate px-4 md:px-0"
                            >
                                {currentTrack?.title}
                            </motion.h2>
                            <motion.p
                                key={currentTrack?.artist}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-lg md:text-2xl text-[var(--neon-cyan)] font-medium truncate"
                            >
                                {currentTrack?.artist}
                            </motion.p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2 shrink-0">
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[var(--neon-cyan)] rounded-full transition-all duration-1000 ease-linear"
                                    style={{ width: `${(currentTime / (currentTrack?.duration || 1)) * 100}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs font-mono text-white/40">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(currentTrack?.duration || 0)}</span>
                            </div>
                        </div>

                        {/* Main Controls */}
                        <div className="flex items-center justify-center md:justify-between gap-6 md:gap-6 shrink-0">
                            <button onClick={toggleShuffle} className={cn("p-2 transition-colors", shuffle ? "text-[var(--neon-cyan)]" : "text-white/40 hover:text-white")}>
                                <Shuffle size={20} className="md:w-6 md:h-6" />
                            </button>

                            <div className="flex items-center gap-6 md:gap-8">
                                <button onClick={playPrev} className="text-white hover:text-[var(--neon-cyan)] transition-colors transform hover:-translate-x-1">
                                    <SkipBack size={28} className="md:w-8 md:h-8" />
                                </button>

                                <button
                                    onClick={() => isPlaying ? pause() : play()}
                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--neon-cyan)] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_40px_rgba(0,255,255,0.3)]"
                                >
                                    {isPlaying ? <Pause size={28} fill="currentColor" className="md:w-8 md:h-8" /> : <Play size={28} fill="currentColor" className="ml-1 md:w-8 md:h-8" />}
                                </button>

                                <button onClick={playNext} className="text-white hover:text-[var(--neon-cyan)] transition-colors transform hover:translate-x-1">
                                    <SkipForward size={28} className="md:w-8 md:h-8" />
                                </button>
                            </div>

                            <button onClick={toggleRepeat} className={cn("p-2 transition-colors relative", repeat !== 'off' ? "text-[var(--neon-cyan)]" : "text-white/40 hover:text-white")}>
                                <Repeat size={20} className="md:w-6 md:h-6" />
                                {repeat === 'one' && <span className="absolute top-0 right-0 text-[10px] bg-black px-1 rounded-full">1</span>}
                            </button>
                        </div>

                        {/* Volume */}
                        <div className="flex items-center gap-4 px-4 bg-white/5 rounded-xl p-3 shrink-0">
                            <button onClick={toggleMute}>
                                {isMuted || volume === 0 ? <VolumeX className="text-white/50" /> : <Volume2 className="text-white/50" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => setVolume(Number(e.target.value))}
                                className="w-full h-1 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
