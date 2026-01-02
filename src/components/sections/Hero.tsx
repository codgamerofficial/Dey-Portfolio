'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import Scene3D from '../3d/Scene3D';
import SpiderWeb from '../ui/SpiderWeb';

export default function Hero() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 20,
                y: (e.clientY / window.innerHeight - 0.5) * 20,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99],
            },
        },
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* 3D Background */}
            <Scene3D />
            <SpiderWeb />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--bg-primary)]/50 to-[var(--bg-primary)] pointer-events-none" />

            {/* Content */}
            <motion.div
                className="container relative z-10 text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
                    transition: 'transform 0.3s ease-out',
                }}
            >
                {/* Glitch Effect Name */}
                <motion.div variants={itemVariants} className="mb-6">
                    <h1 className="text-8xl md:text-9xl font-bold mb-4 relative glitch-text" data-text="Saswata Dey">
                        <span className="gradient-text">Saswata Dey</span>
                        <span className="absolute inset-0 gradient-text opacity-50 blur-sm animate-pulse">
                            Saswata Dey
                        </span>
                    </h1>
                </motion.div>

                {/* Tagline */}
                <motion.p
                    variants={itemVariants}
                    className="text-xl md:text-2xl text-[var(--text-secondary)] mb-4 font-light flex items-center justify-center gap-3 flex-wrap"
                >
                    <span>QA-Focused Engineer</span>
                    <span className="text-[var(--neon-blue)]">•</span>
                    <span>Computer Vision</span>
                    <span className="text-[var(--neon-blue)]">•</span>
                    <a
                        href="https://teestate-7531.myshopify.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white hover:text-[var(--neon-blue)] transition-colors underline decoration-[var(--neon-blue)] decoration-2 underline-offset-4"
                    >
                        <span>Founder @ TeeState</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                </motion.p>

                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-[var(--text-tertiary)] mb-12 max-w-2xl mx-auto"
                >
                    Building quality into every pixel, every line of code, every system.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <a
                        href="https://teestate-7531.myshopify.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative px-8 py-4 bg-transparent border-2 border-white rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
                    >
                        <span className="relative z-10 text-white font-semibold flex items-center gap-2">
                            👕 Visit TeeState
                        </span>
                        <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" ></div>
                        <span className="absolute z-10 inset-0 flex items-center justify-center gap-2 text-black font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            👕 Visit TeeState
                        </span>
                    </a>

                    <a
                        href="/resume.pdf"
                        download
                        className="group relative px-8 py-4 bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] rounded-full overflow-hidden transition-all duration-300 hover:scale-105 neon-glow"
                    >
                        <span className="relative z-10 text-white font-semibold flex items-center gap-2">
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            Download Resume
                        </span>
                    </a>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    variants={itemVariants}
                    className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-[var(--neon-blue)] rounded-full flex justify-center p-2">
                        <motion.div
                            className="w-1.5 h-1.5 bg-[var(--neon-blue)] rounded-full"
                            animate={{
                                y: [0, 12, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                        />
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
