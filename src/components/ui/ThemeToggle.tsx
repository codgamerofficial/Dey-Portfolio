'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DimensionSwitcher() {
    const [isMiles, setIsMiles] = useState(true);
    const [mounted, setMounted] = useState(false);
    const [glitching, setGlitching] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('dimension');
        if (stored === 'earth-65') {
            setIsMiles(false);
            document.documentElement.setAttribute('data-theme', 'earth-65');
        } else {
            setIsMiles(true);
            document.documentElement.setAttribute('data-theme', 'earth-1610');
        }
    }, []);

    const warpDimension = () => {
        if (glitching) return;
        setGlitching(true);

        // Haptic Feedback
        if (navigator.vibrate) navigator.vibrate(50);

        // Apply Glitch to Body
        document.body.classList.add('dimension-glitch-active');

        // Delay Toggle to sync with glitch peak
        setTimeout(() => {
            const newState = !isMiles;
            setIsMiles(newState);
            localStorage.setItem('dimension', newState ? 'earth-1610' : 'earth-65');
            document.documentElement.setAttribute('data-theme', newState ? 'earth-1610' : 'earth-65');
        }, 150);

        // Remove Glitch
        setTimeout(() => {
            document.body.classList.remove('dimension-glitch-active');
            setGlitching(false);
        }, 600);
    };

    if (!mounted) return null;

    return (
        <>
            {/* Global Glitch Styles (dynamic injection) */}
            <style jsx global>{`
                .dimension-glitch-active {
                    animation: dimension-shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
                    filter: invert(10%) contrast(150%);
                }
                
                @keyframes dimension-shake {
                    10%, 90% { transform: translate3d(-2px, 2px, 0) skewX(2deg); filter: hue-rotate(-20deg); }
                    20%, 80% { transform: translate3d(4px, -2px, 0) skewY(-2deg); filter: hue-rotate(20deg); }
                    30%, 50%, 70% { transform: translate3d(-6px, 0, 0) scale(1.02); filter: invert(20%); }
                    40%, 60% { transform: translate3d(6px, 0, 0) scale(0.98); }
                }

                .badge-text {
                    writing-mode: vertical-rl;
                    text-orientation: upright;
                }
            `}</style>

            <motion.div
                className="fixed bottom-6 left-6 z-[100]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
            >
                {/* Visual Glitch Fragments */}
                {glitching && (
                    <>
                        <div className="absolute inset-0 bg-red-500 mix-blend-screen animate-pulse translate-x-1" />
                        <div className="absolute inset-0 bg-cyan-500 mix-blend-screen animate-pulse -translate-x-1" />
                    </>
                )}

                <button
                    onClick={warpDimension}
                    className={`
                        relative w-16 h-16 rounded-xl border-2 flex items-center justify-center overflow-hidden transition-all duration-300
                        ${isMiles
                            ? 'bg-black border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.4)]'
                            : 'bg-white border-cyan-400 shadow-[0_0_20px_rgba(0,242,234,0.4)]'}
                    `}
                >
                    {/* Dimension Label */}
                    <div className="absolute top-0.5 right-1 text-[8px] font-bold opacity-60 font-mono tracking-tighter">
                        {isMiles ? 'E-1610' : 'E-65'}
                    </div>

                    {/* Icon */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isMiles ? 'miles' : 'gwen'}
                            initial={{ scale: 0, rotate: 180, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0, rotate: -180, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="text-2xl"
                        >
                            {isMiles ? '🕷️' : '🩰'}
                        </motion.div>
                    </AnimatePresence>

                    {/* Scanner Line */}
                    <motion.div
                        className={`absolute inset-0 w-full h-[2px] ${isMiles ? 'bg-red-500' : 'bg-cyan-400'} opacity-50`}
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />

                </button>
            </motion.div>
        </>
    );
}
