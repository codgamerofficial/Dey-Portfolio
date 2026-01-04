'use client';
import { motion, useScroll, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
    const { scrollY } = useScroll();
    const [isVisible, setIsVisible] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        return scrollY.onChange((latest) => {
            if (latest > 500) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        });
    }, [scrollY]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-10 md:right-20 z-40 p-4 rounded-full bg-[var(--dhurandhar-gold)] text-[var(--dhurandhar-dark)] shadow-[0_0_20px_var(--dhurandhar-amber)] border border-white/20 backdrop-blur-md group"
                >
                    <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
                    {/* Ring Pulse */}
                    <div className="absolute inset-0 rounded-full border border-[var(--dhurandhar-gold)] opacity-50 animate-ping" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
