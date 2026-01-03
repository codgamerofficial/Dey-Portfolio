'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Network, BarChart3, Fingerprint, Music, FileText, ArrowRight, Train } from 'lucide-react';

const FEATURES = [
    {
        id: 'satellite',
        title: 'Satellite Uplink',
        desc: 'Global communication node visualizations and orbital tracking.',
        icon: Network,
        href: '/satellite',
        color: 'text-cyan-400',
        border: 'border-cyan-400/30'
    },
    {
        id: 'market',
        title: 'Market Command',
        desc: 'Real-time crypto and asset intelligence dashboard.',
        icon: BarChart3,
        href: '/market',
        color: 'text-green-400',
        border: 'border-green-400/30'
    },
    {
        id: 'bio',
        title: 'Bio Link',
        desc: 'Centralized digital identity and portfolio nexus.',
        icon: Fingerprint,
        href: '/bio',
        color: 'text-purple-400',
        border: 'border-purple-400/30'
    },
    {
        id: 'sonic',
        title: 'Sonic Link',
        desc: 'Immersive audio-visual experience with Spider-Verse aesthetics.',
        icon: Music,
        href: '/sonic',
        color: 'text-pink-400',
        border: 'border-pink-400/30'
    },
    {
        id: 'pdf',
        title: 'PDF Matrix',
        desc: 'Advanced military-grade document manipulation suite.',
        icon: FileText,
        href: '/pdf',
        color: 'text-blue-400',
        border: 'border-blue-400/30'
    },
    {
        id: 'trains',
        title: 'Loco Tracker',
        desc: 'Real-time locomotive tracking and telemetry system.',
        icon: Train,
        href: '/trains',
        color: 'text-orange-400',
        border: 'border-orange-400/30'
    }
];

export default function FeatureHub() {
    return (
        <section className="section py-20 px-4 md:px-10 bg-black relative overflow-hidden" id="features">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tighter">
                        FEATURE <span className="text-[var(--neon-blue)]">NEXUS</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Access specialized modules and experimental tools.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, i) => (
                        <Link href={feature.href} key={feature.id} className="block group">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`h-full p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all hover:scale-[1.02] flex flex-col justify-between group-hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden`}
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full transition-transform group-hover:scale-150`} />

                                <div>
                                    <div className={`w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center mb-6 border ${feature.border} group-hover:scale-110 transition-transform`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2 font-mono">{feature.title}</h3>
                                    <p className="text-[var(--text-tertiary)] text-sm leading-relaxed">{feature.desc}</p>
                                </div>

                                <div className="mt-8 flex items-center text-xs font-bold tracking-widest text-white/50 group-hover:text-white transition-colors">
                                    INITIALIZE <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
