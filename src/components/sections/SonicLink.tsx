'use client';

import { motion } from 'framer-motion';
import SpiderPlayer from '../widgets/SpiderPlayer';

export default function SonicLink() {
    return (
        <section className="section relative overflow-hidden min-h-[60vh] flex items-center border-t border-white/5">
            <div className="absolute inset-0 bg-black">
                {/* Musical Waveform Background Simulation */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--neon-purple)]/10 to-transparent" />
            </div>

            <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[450px] w-full order-2 lg:order-1"
                >
                    <SpiderPlayer />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-right order-1 lg:order-2"
                >
                    <div className="flex items-center justify-end gap-3 mb-4">
                        <span className="text-[var(--neon-purple)] tracking-widest uppercase text-sm font-bold">Audio Visual Interface</span>
                        <div className="flex gap-1 items-end h-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-1 bg-[var(--neon-purple)] animate-pulse" style={{ height: `${i * 25}%`, animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                        Sonic <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-l from-[var(--neon-purple)] to-white">Link</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] mb-8 ml-auto max-w-md">
                        Immersive audio experience with local file playback support. Upload your tracks and visualize the soundscape.
                    </p>

                    <div className="flex flex-wrap justify-end gap-3">
                        {['MP3', 'WAV', 'MP4', 'OGG'].map((fmt) => (
                            <span key={fmt} className="px-3 py-1 bg-white/5 rounded text-xs font-mono text-[var(--text-tertiary)] hover:bg-white/10">{fmt}</span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
