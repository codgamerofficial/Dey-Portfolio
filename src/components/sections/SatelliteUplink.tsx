'use client';

import { motion } from 'framer-motion';
import TimeLocation from '../widgets/TimeLocation';

export default function SatelliteUplink() {
    return (
        <section className="section relative overflow-hidden min-h-[60vh] flex items-center">
            {/* Background elements */}
            <div className="absolute inset-0 bg-black">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[var(--neon-blue)]/5 to-transparent" />
            </div>

            <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-[var(--neon-blue)] rounded-full animate-ping" />
                        <span className="text-[var(--neon-blue)] tracking-widest uppercase text-sm font-bold">Live Connection</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                        Satellite <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--neon-blue)] to-white">Uplink</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] mb-8 max-w-md border-l-4 border-[var(--neon-blue)] pl-6">
                        Establishing secure connection to your current coordinates. Real-time environmental telemetry and precise geolocation tracking active.
                    </p>

                    <div className="flex gap-4 text-sm font-mono text-[var(--text-tertiary)]">
                        <div>LAT: <span className="text-white">Scanning...</span></div>
                        <div>LON: <span className="text-white">Scanning...</span></div>
                    </div>
                </motion.div>

                {/* Widget */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative h-[400px] w-full"
                >
                    <div className="absolute -inset-4 bg-[var(--neon-blue)]/20 rounded-full blur-3xl opacity-20 animate-pulse" />
                    <TimeLocation />
                </motion.div>
            </div>
        </section>
    );
}
