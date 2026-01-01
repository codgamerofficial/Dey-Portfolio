'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ThemeToggle() {
    // Default to dark (true)
    const [isDark, setIsDark] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // On mount, check if there's a stored pref, otherwise default to dark (which is our base CSS)
        const stored = localStorage.getItem('theme');
        if (stored === 'light') {
            setIsDark(false);
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            setIsDark(true);
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }, []);

    const toggle = () => {
        const newState = !isDark;
        setIsDark(newState);
        localStorage.setItem('theme', newState ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', newState ? 'dark' : 'light');
    };

    if (!mounted) return null;

    return (
        <motion.button
            onClick={toggle}
            className="fixed bottom-6 left-6 z-[100] w-14 h-14 rounded-full bg-white border-2 border-[var(--neon-blue)] shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center text-2xl cursor-pointer overflow-hidden group"
            initial={{ rotate: -10, y: 100 }}
            animate={{ rotate: -10, y: 0 }}
            whileHover={{ rotate: 0, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
                boxShadow: isDark ? '0 0 20px var(--neon-blue)' : '0 4px 10px rgba(0,0,0,0.2)'
            }}
        >
            <div className="relative w-full h-full">
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isDark ? 'moon' : 'sun'}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        {isDark ? '🕷️' : '☀️'}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Sticker Peel Effect */}
            <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200/50 rounded-bl-lg shadow-sm group-hover:w-6 group-hover:h-6 transition-all" />
        </motion.button>
    );
}
