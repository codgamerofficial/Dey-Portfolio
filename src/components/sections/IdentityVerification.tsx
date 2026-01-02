'use client';

import { motion } from 'framer-motion';
import DigitalID from '../widgets/DigitalID';
import { ShieldCheck, Star, Award } from 'lucide-react';

export default function IdentityVerification() {
    return (
        <section className="section py-20 px-4 relative overflow-hidden bg-black border-y border-[var(--neon-blue)]/20">
            {/* Exclusive Background Elements */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--neon-purple)]/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[var(--neon-blue)]/5 rounded-full blur-[100px]" />

            <div className="container mx-auto relative z-10">

                {/* Header Branding */}
                <div className="text-center mb-16 relative">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold tracking-[0.2em] mb-4"
                    >
                        <Star className="w-3 h-3 fill-yellow-500" />
                        PREMIUM VERIFICATION DETECTED
                        <Star className="w-3 h-3 fill-yellow-500" />
                    </motion.div>

                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
                        OFFICIAL CREDENTIALS
                    </h2>
                    <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] mt-4 rounded-full" />
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Branding & Status */}
                    <div className="flex flex-col gap-6 text-center lg:text-left">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold flex items-center justify-center lg:justify-start gap-3">
                                <ShieldCheck className="w-8 h-8 text-green-400" />
                                <span className="text-white">Authorized Personnel</span>
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed">
                                Validated academic records from prestigious institutions.
                                Full cryptographic clearance granted for Engineering and Diploma credentials.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 group hover:border-[var(--neon-blue)] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[var(--neon-blue)]/10 flex items-center justify-center text-[var(--neon-blue)]">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-white/50 font-mono">DEGREE</div>
                                    <div className="text-sm font-bold text-white">B.Tech (CSE)</div>
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 group hover:border-[var(--neon-purple)] transition-colors">
                                <div className="w-10 h-10 rounded-full bg-[var(--neon-purple)]/10 flex items-center justify-center text-[var(--neon-purple)]">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs text-white/50 font-mono">DIPLOMA</div>
                                    <div className="text-sm font-bold text-white">CSE</div>
                                </div>
                            </div>
                        </div>

                        <div className="inline-block mt-4 p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-yellow-200/80 text-xs font-mono">
                            // ENCRYPTED DATA BLOCK <br />
                            // HASH: 9a8b...7f2c <br />
                            // STATUS: IMMUTABLE
                        </div>
                    </div>

                    {/* Right: The Holographic Card */}
                    <div className="relative">
                        {/* Glow Effect behind card */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-[var(--neon-blue)] to-[var(--neon-purple)] opacity-20 blur-[60px] animate-pulse-slow" />
                        <DigitalID />
                        <div className="absolute -bottom-8 left-0 right-0 text-center text-[10px] text-white/30 font-mono">
                            INTERACTIVE COMPONENT: TAP TO FLIP • SWITCH TABS
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
