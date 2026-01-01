'use client';

import { motion } from 'framer-motion';

const TECHS = [
    "React", "Next.js", "TypeScript", "TailwindCSS",
    "Python", "Selenium", "Appium", "Cypress", "PyTest",
    "Node.js", "GraphQL", "Docker", "AWS", "OpenCV", "TensorFlow",
    "JIRA", "Postman", "Git"
];

export default function TechLoop() {
    return (
        <section className="py-8 border-y border-white/5 bg-black/40 overflow-hidden relative select-none">
            <div className="flex w-[200%]">
                <motion.div
                    className="flex gap-8 md:gap-16 pr-8 md:pr-16"
                    animate={{ x: "-100%" }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                >
                    {[...TECHS, ...TECHS, ...TECHS, ...TECHS].map((tech, i) => (
                        <span key={i} className="text-xl md:text-3xl font-bold text-white/20 uppercase tracking-widest whitespace-nowrap hover:text-[var(--neon-blue)] transition-colors cursor-crosshair">
                            {tech}
                        </span>
                    ))}
                </motion.div>
                <motion.div
                    className="flex gap-8 md:gap-16 pr-8 md:pr-16"
                    animate={{ x: "-100%" }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                >
                    {[...TECHS, ...TECHS, ...TECHS, ...TECHS].map((tech, i) => (
                        <span key={`dup-${i}`} className="text-xl md:text-3xl font-bold text-white/20 uppercase tracking-widest whitespace-nowrap hover:text-[var(--neon-blue)] transition-colors cursor-crosshair">
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </div>

            {/* Fade Edges */}
            <div className="absolute left-0 top-0 w-20 md:w-40 h-full bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10" />
            <div className="absolute right-0 top-0 w-20 md:w-40 h-full bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10" />
        </section>
    );
}
