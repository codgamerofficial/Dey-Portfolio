'use client';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const [percent, setPercent] = useState(0);

    useEffect(() => {
        return scrollYProgress.onChange((latest) => {
            setPercent(Math.round(latest * 100));
        });
    }, [scrollYProgress]);

    return (
        <>
            {/* Top Plasma Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--dhurandhar-gold)] origin-left z-[100] shadow-[0_0_20px_var(--dhurandhar-amber)]"
                style={{ scaleX }}
            />

            {/* Vertical Tech Readout (HUD Style) */}
            <div className="fixed right-6 bottom-10 z-50 opacity-0 md:opacity-100 transition-opacity pointer-events-none">
                <div className="flex flex-col items-end gap-1">
                    {/* Percentage */}
                    <div className="text-4xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[var(--dhurandhar-gold)] to-transparent leading-none">
                        {percent}<span className="text-sm align-top opacity-50">%</span>
                    </div>

                    {/* Label */}
                    <div className="text-[8px] font-mono tracking-[0.2em] text-[var(--dhurandhar-amber)] uppercase border-t border-[var(--dhurandhar-gold)]/30 pt-1 mt-1">
                        Sys_Scroll.v2
                    </div>

                    {/* Visual Bar */}
                    <div className="w-1 h-32 bg-[var(--dhurandhar-dark)]/50 border border-[var(--dhurandhar-gold)]/20 mt-2 rounded-full overflow-hidden backdrop-blur-sm relative">
                        <motion.div
                            className="absolute bottom-0 w-full bg-[var(--dhurandhar-gold)] shadow-[0_0_15px_var(--dhurandhar-gold)]"
                            style={{ height: useTransform(scrollYProgress, value => `${value * 100}%`) }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
