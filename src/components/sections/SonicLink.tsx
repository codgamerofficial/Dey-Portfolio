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
                    className="relative h-[450px] w-full order-2 lg:order-1 z-20"
                >
                    <SpiderPlayer key="sonic-sys-v2" />

                    {/* Visual Connector Node (Right Side of Player) */}
                    <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-12 h-12 hidden lg:flex items-center justify-center z-30">
                        <div className="w-full h-[2px] bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] animate-pulse" />
                        <div className="absolute right-0 w-3 h-3 bg-[var(--neon-purple)] rounded-full shadow-[0_0_10px_var(--neon-purple)] animate-ping" />
                    </div>
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

                    {/* Spotify Branding Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="mt-12 relative group z-20"
                    >
                        {/* Connecting Line (Into Top of Card) */}
                        <div className="absolute -top-12 left-10 w-[2px] h-12 bg-gradient-to-b from-[var(--neon-purple)] to-[#1DB954] hidden lg:block opacity-50">
                            <div className="w-full h-1/2 bg-white blur-[1px] animate-slide-down" />
                        </div>
                        {/* Decorative 'Official' Badge */}
                        <div className="absolute -top-5 -right-4 z-20 bg-[#1DB954] text-black font-bold text-xs px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(29,185,84,0.6)] transform rotate-3 flex items-center gap-1.5 border-2 border-white/20">
                            <span className="bg-black text-[#1DB954] rounded-full p-0.5 w-4 h-4 flex items-center justify-center text-[10px]">✓</span>
                            VERIFIED ARTIST
                        </div>

                        <div className="w-full glass-strong rounded-3xl overflow-hidden hover:shadow-[0_0_50px_rgba(29,185,84,0.4)] transition-all duration-500 border border-[#1DB954]/30 relative bg-black/60">
                            {/* Brand Header */}
                            <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-[#1DB954]/5 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <svg className="w-8 h-8 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.199.78-1.38 4.199-1.261 11.341-1.02 15.72 1.56.6.36.78 1.14.42 1.74-.3.6-1.02.78-1.62.42z" />
                                    </svg>
                                    <div className="flex flex-col">
                                        <span className="font-bold tracking-widest text-sm text-white leading-none mb-1">SPOTIFY</span>
                                        <span className="text-[10px] text-[#1DB954] font-mono">OFFICIAL PROFILE</span>
                                    </div>
                                </div>
                                <span className="text-[10px] text-white/50 font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                                    LIVE
                                </span>
                            </div>

                            <div className="relative">
                                <iframe
                                    style={{ borderRadius: '0 0 24px 24px' }}
                                    src="https://open.spotify.com/embed/artist/4EXTUyxQQ2xYoiCyhDGBwH?utm_source=generator&theme=0"
                                    width="100%"
                                    height="352"
                                    frameBorder="0"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    className="relative z-10 block"
                                />
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
