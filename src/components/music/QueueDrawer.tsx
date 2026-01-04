'use client';

import { useMusicStore } from '@/lib/store/useMusicStore';
import { X, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';


interface QueueDrawerProps {
    onClose: () => void;
}

export default function QueueDrawer({ onClose }: QueueDrawerProps) {
    const { queue, currentTrack, play, removeFromQueue } = useMusicStore();

    // Grouping or just list? Just list for now.

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-zinc-900 border-l border-white/10 shadow-2xl flex flex-col"
        >
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20 backdrop-blur-md">
                <h3 className="font-bold text-white flex items-center gap-2">
                    Playing Queue
                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">{queue.length}</span>
                </h3>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {queue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-2">
                        <p>Queue is empty</p>
                    </div>
                ) : (
                    queue.map((track, idx) => {
                        const isCurrent = currentTrack?.id === track.id;
                        return (
                            <div
                                key={`${track.id}-${idx}`}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-colors group cursor-pointer border border-transparent",
                                    isCurrent ? "bg-white/10 border-white/5" : "hover:bg-white/5"
                                )}
                                onClick={() => play(track)}
                            >
                                <div className="relative w-10 h-10 rounded overflow-hidden bg-zinc-800 shrink-0">
                                    {track.coverUrl && (
                                        <img src={track.coverUrl} className="w-full h-full object-cover" alt="" />
                                    )}
                                    {isCurrent && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <div className="w-1.5 h-1.5 bg-[var(--neon-cyan)] rounded-full animate-pulse" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className={cn("text-sm font-medium truncate", isCurrent ? "text-[var(--neon-cyan)]" : "text-white")}>
                                        {track.title}
                                    </h4>
                                    <p className="text-xs text-white/40 truncate">{track.artist}</p>
                                </div>

                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFromQueue(track.id); }}
                                    className="p-1.5 text-white/0 group-hover:text-white/40 hover:!text-red-500 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}
