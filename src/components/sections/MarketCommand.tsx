'use client';

import { motion } from 'framer-motion';
import MarketWatch from '../widgets/MarketWatch';

export default function MarketCommand() {
    return (
        <section className="section relative overflow-hidden min-h-[60vh] flex items-center border-t border-white/5">
            <div className="absolute inset-0 bg-black">
                <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[var(--neon-purple)]/5 to-transparent skew-x-12" />
            </div>

            <div className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                {/* Widget (Left/Right alternating?) Let's put Widget Right for variety? Or keep standard.
                    User might want consistent flow. Let's flip this one: Text Right.
                 */}

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[450px] w-full order-2 lg:order-1"
                >
                    <MarketWatch />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-right order-1 lg:order-2"
                >
                    <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white mb-4 border border-white/20">
                        FINANCIAL INTELLIGENCE
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
                        Market <br />
                        <span className="text-[var(--neon-pink)]">Command</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] mb-8 ml-auto max-w-md">
                        Advanced algorithmic trading simulations with real-time RSI analysis, volume metrics, and buy/sell signals.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-left bg-white/5 p-4 rounded-xl border border-white/10">
                        <div>
                            <div className="text-xs text-[var(--text-tertiary)]">ALGO STATUS</div>
                            <div className="text-[var(--neon-green)] font-mono">ACTIVE</div>
                        </div>
                        <div>
                            <div className="text-xs text-[var(--text-tertiary)]">DATA FEED</div>
                            <div className="text-[var(--neon-blue)] font-mono">LIVE</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
