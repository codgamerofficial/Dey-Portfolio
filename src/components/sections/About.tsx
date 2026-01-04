'use client';

import { motion } from 'framer-motion';
import NextImage from 'next/image';

export default function About() {
    return (
        <section id="about" className="section relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat" />
            </div>

            <div className="container relative z-10">
                <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                    {/* Left: 3D Rotating Card with Profile */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <motion.div
                            whileHover={{ rotateY: 10, rotateX: 10 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="glass-strong rounded-3xl p-8 border-2 border-[var(--neon-blue)] relative overflow-hidden"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-blue)]/20 to-[var(--neon-purple)]/20" />

                            {/* Profile Image Placeholder */}
                            <div className="relative z-10">
                                <NextImage
                                    src="/profile.jpg"
                                    alt="Saswata Dey"
                                    width={500}
                                    height={500}
                                    className="w-full aspect-square rounded-2xl object-cover border-4 border-white shadow-[8px_8px_0px_var(--neon-blue)] rotate-2 hover:rotate-0 transition-transform duration-300 mb-6 grayscale hover:grayscale-0"
                                />

                                {/* Quick Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 rounded-xl bg-[var(--bg-tertiary)]">
                                        <div className="text-2xl font-bold gradient-text">2+</div>
                                        <div className="text-xs text-[var(--text-tertiary)]">Years Learning</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-[var(--bg-tertiary)]">
                                        <div className="text-2xl font-bold gradient-text">10+</div>
                                        <div className="text-xs text-[var(--text-tertiary)]">Projects</div>
                                    </div>
                                    <div className="text-center p-4 rounded-xl bg-[var(--bg-tertiary)]">
                                        <div className="text-2xl font-bold gradient-text">14+</div>
                                        <div className="text-xs text-[var(--text-tertiary)]">Skills</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right: Story-based Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-5xl font-bold mb-6"
                        >
                            <span className="gradient-text">About Me</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="space-y-6 text-lg text-[var(--text-secondary)] leading-relaxed"
                        >
                            <p>
                                I am a <span className="text-[var(--neon-blue)] font-semibold">Detail-oriented and motivated Fresher QA Engineer</span> with
                                extensive knowledge of software testing fundamentals, SDLC, STLC, and defect lifecycles.
                            </p>

                            <p>
                                My objective is to contribute to <span className="text-[var(--neon-purple)] font-semibold">quality assurance processes</span>,
                                ensure product reliability, and grow within a dynamic organization. I bring a strong foundation in
                                <span className="text-white font-semibold"> Manual Testing, JIRA, and Automation basics</span>.
                            </p>

                            <p>
                                With experience as a <span className="text-white font-semibold">Drone Data Processor</span> and
                                <span className="text-white font-semibold"> Sales & Marketing Intern</span>, I have developed a sharp eye for detail
                                and a problem-solving mindset that I apply to every testing challenge.
                            </p>

                            <p className="text-[var(--neon-blue)] font-semibold italic">
                                "Seeking an entry-level QA role to ensure product reliability and deliver seamless user experiences."
                            </p>
                        </motion.div>

                        {/* Key Traits */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-8 grid grid-cols-2 gap-4"
                        >
                            {[
                                { icon: '🎯', text: 'Detail-Oriented' },
                                { icon: '🔍', text: 'Analytical Thinker' },
                                { icon: '🚀', text: 'Fast Learner' },
                                { icon: '💡', text: 'Problem Solver' },
                            ].map((trait, index) => (
                                <motion.div
                                    key={trait.text}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                    className="glass rounded-xl p-4 flex items-center gap-3"
                                >
                                    <span className="text-3xl">{trait.icon}</span>
                                    <span className="font-semibold text-white">{trait.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Featured Venture */}
                        <motion.a
                            href="https://teestate-7531.myshopify.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="mt-8 block p-6 rounded-2xl bg-gradient-to-r from-[#0f0f0f] to-black border border-white/10 hover:border-[var(--neon-blue)] relative overflow-hidden group transition-all"
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-[0_0_15px_white]">👕</div>
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--neon-blue)] transition-colors flex items-center gap-2">
                                        Founder @ TeeState
                                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </h4>
                                    <p className="text-sm text-[var(--text-secondary)] group-hover:text-white transition-colors">
                                        Running a live e-commerce platform for custom apparel.
                                    </p>
                                </div>
                            </div>
                            {/* Background Glow */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-blue)]/0 via-[var(--neon-blue)]/5 to-[var(--neon-blue)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
