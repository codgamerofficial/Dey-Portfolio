'use client';

import { motion } from 'framer-motion';
import TimeLocation from '../widgets/TimeLocation';
import SpiderPlayer from '../widgets/SpiderPlayer';
import MarketWatch from '../widgets/MarketWatch';
import FitnessTracker from '../widgets/FitnessTracker';

export default function MissionControl() {
    return (
        <section className="section relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat" />
            </div>

            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-6">
                        <span className="gradient-text">Mission Control</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)]">
                        Real-time systems monitoring and utilities
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 h-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="h-[350px] lg:h-[400px]"
                    >
                        <TimeLocation />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="h-[350px] lg:h-[400px]"
                    >
                        <MarketWatch />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="h-[350px] lg:h-[400px]"
                    >
                        <FitnessTracker />
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="h-[350px] lg:h-[400px]"
                    >
                        <SpiderPlayer />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
