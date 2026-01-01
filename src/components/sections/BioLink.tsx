'use client';

import { motion } from 'framer-motion';
import FitnessTracker from '../widgets/FitnessTracker';

export default function BioLink() {
    return (
        <section className="section relative overflow-hidden min-h-[60vh] flex items-center border-t border-white/5">
            <div className="absolute inset-0 bg-black">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,0,0,0.05),transparent_50%)]" />
            </div>

            <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-2 mb-4 text-[var(--neon-purple)]">
                        <span className="text-2xl">⚡</span>
                        <span className="font-bold tracking-widest uppercase">Biometric Systems</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                        Bio-Link <br />
                        <span className="text-white/50">Tracker</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-md">
                        Monitoring vital statistics in real-time. Tracking activity rings, heart rate variability, and caloric burn with military precision.
                    </p>

                    <button className="px-8 py-4 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all flex items-center gap-3 group">
                        <span>Sync Device</span>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse group-hover:bg-green-500" />
                    </button>
                </motion.div>

                {/* Widget */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="relative h-[400px] w-full"
                >
                    <FitnessTracker />
                </motion.div>
            </div>
        </section>
    );
}
