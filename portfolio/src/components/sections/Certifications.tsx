'use client';

import { motion } from 'framer-motion';

export default function Certifications() {
    return (
        <section id="certifications" className="section relative overflow-hidden">
            <div className="container relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl font-bold mb-6">
                        <span className="gradient-text">Education & Certifications</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)]">
                        My academic background and professional qualifications
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Education Column */}
                    <div>
                        <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                            <span className="text-3xl">🎓</span> Education
                        </h3>
                        <div className="space-y-6">
                            {[
                                {
                                    degree: 'B.Tech in Computer Science & Engineering',
                                    institution: 'KIIT University',
                                    year: '2022 - 2025',
                                    score: '6.15 CGPA',
                                },
                                {
                                    degree: 'Diploma in Computer Science & Engineering',
                                    institution: 'KIIT Polytechnic',
                                    year: '2019 - 2022',
                                    score: '71%',
                                },
                                {
                                    degree: '10th (Matriculation)',
                                    institution: 'Contai High School',
                                    year: '2018 - 2019',
                                    score: '68%',
                                },
                            ].map((edu, index) => (
                                <motion.div
                                    key={edu.degree}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-strong p-6 rounded-2xl border-l-4 border-[var(--neon-blue)]"
                                >
                                    <h4 className="text-lg font-bold text-white mb-1">{edu.degree}</h4>
                                    <p className="text-[var(--neon-blue)] font-medium mb-2">{edu.institution}</p>
                                    <div className="flex justify-between text-sm text-[var(--text-secondary)]">
                                        <span>{edu.year}</span>
                                        <span className="font-semibold text-white">{edu.score}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Certifications Column */}
                    <div>
                        <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
                            <span className="text-3xl">📜</span> Certifications
                        </h3>
                        <div className="space-y-6">
                            {[
                                {
                                    name: 'QA Metrics & KPIs: Testing, Defect Tracking & Automation',
                                    issuer: 'Udemy',
                                    date: 'Dec 22, 2025',
                                    color: '#ff0000',
                                },
                                {
                                    name: 'Sales & Marketing',
                                    issuer: 'HighRadius Technologies',
                                    date: '2024',
                                    color: '#b30000',
                                },
                                {
                                    name: 'Web Development',
                                    issuer: 'Cognifyz Technology',
                                    date: '2024',
                                    color: '#ff4d4d',
                                },
                            ].map((cert, index) => (
                                <motion.div
                                    key={cert.name}
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-strong p-6 rounded-2xl flex items-center gap-4 group hover:bg-[var(--bg-tertiary)] transition-colors"
                                    style={{ borderLeft: `4px solid ${cert.color}` }}
                                >
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                                        style={{ background: `${cert.color}20`, color: cert.color }}
                                    >
                                        🏆
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white group-hover:text-[var(--neon-blue)] transition-colors">
                                            {cert.name}
                                        </h4>
                                        <div className="flex gap-2 text-sm text-[var(--text-secondary)] mt-1">
                                            <span>{cert.issuer}</span>
                                            <span>•</span>
                                            <span>{cert.date}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
