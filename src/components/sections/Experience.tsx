'use client';

import { motion } from 'framer-motion';

interface Experience {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string;
    skills: string[];
    achievements: string[];
    icon: string;
    color: string;
}

const experiences: Experience[] = [
    {
        id: '1',
        title: 'Drone Data Processor (GIS Intern)',
        company: 'Digital Indian Business Solution Pvt. Ltd.',
        period: 'Aug 2025 – Nov 2025',
        description: 'Processed and analyzed drone and GIS data for mapping, surveying, and infrastructure development using ArcGIS and QGIS.',
        skills: ['ArcGIS', 'QGIS', 'Photogrammetry', 'Spatial Data Analysis', '3D Terrain Modeling'],
        achievements: [
            'Processed drone & GIS data for mapping and infrastructure development',
            'Collaborated with technical teams to maintain geospatial dataset accuracy',
            'Enhanced deliverables through spatial analytics and 3D terrain modeling',
        ],
        icon: '🚁',
        color: '#ff0000',
    },
    {
        id: '2',
        title: 'Sales & Marketing Intern',
        company: 'HighRadius Technologies',
        period: 'May 2024 – Jun 2024',
        description: 'Conducted B2B lead generation and managed client relationships using Salesforce and CRM tools.',
        skills: ['Salesforce', 'B2B Lead Generation', 'CRM', 'Market Research', 'Communication'],
        achievements: [
            'Conducted B2B lead generation using LinkedIn and internal systems',
            'Delivered product demos and managed client relationships via Salesforce',
            'Contributed to marketing campaigns improving conversion rates',
        ],
        icon: '📈',
        color: '#990000',
    },
];

export default function Experience() {
    return (
        <section id="experience" className="section relative overflow-hidden bg-gradient-to-b from-[var(--bg-secondary)] to-[var(--bg-primary)]">
            {/* Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[var(--neon-blue)] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[var(--neon-purple)] rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="gradient-text">Experience Timeline</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        My professional journey and learning experiences
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical Line */}
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[var(--neon-blue)] via-[var(--neon-purple)] to-[var(--neon-pink)]" />

                    {/* Experience Cards */}
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.3 }}
                            className={`relative mb-20 last:mb-0 ${index % 2 === 0 ? 'md:pr-[50%] md:pl-0' : 'md:pl-[50%] md:pr-0'
                                }`}
                        >
                            {/* Timeline Dot */}
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.3 + 0.2 }}
                                className="absolute left-4 md:left-1/2 top-8 transform -translate-x-1/2 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center z-10"
                                style={{
                                    background: `${exp.color}20`,
                                    border: `3px solid ${exp.color}`,
                                }}
                            >
                                <span className="text-3xl">{exp.icon}</span>

                                {/* Glow Effect */}
                                <div
                                    className="absolute inset-0 rounded-full blur-xl opacity-50"
                                    style={{ background: exp.color }}
                                />
                            </motion.div>

                            {/* Card */}
                            <motion.div
                                whileHover={{
                                    scale: 1.02,
                                    y: -5,
                                    borderColor: exp.color
                                }}
                                className={`glass-strong rounded-3xl p-6 md:p-8 border-2 border-transparent transition-all duration-300 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'
                                    }`}
                                style={{
                                    borderColor: 'transparent',
                                }}
                            >
                                {/* Period Badge */}
                                <div
                                    className="inline-block px-4 py-2 rounded-full mb-4"
                                    style={{
                                        background: `${exp.color}20`,
                                        border: `2px solid ${exp.color}`,
                                    }}
                                >
                                    <span className="text-sm font-semibold" style={{ color: exp.color }}>
                                        {exp.period}
                                    </span>
                                </div>

                                {/* Title & Company */}
                                <h3 className="text-2xl font-bold mb-2 text-white">{exp.title}</h3>
                                <p className="text-lg text-[var(--text-secondary)] mb-4">{exp.company}</p>

                                {/* Description */}
                                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                                    {exp.description}
                                </p>

                                {/* Skills */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold mb-3 text-[var(--text-secondary)]">
                                        Skills Gained
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {exp.skills.map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-3 py-1 text-sm rounded-full bg-[var(--bg-tertiary)] text-white border border-[var(--glass-border)]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Achievements */}
                                <div>
                                    <h4 className="text-sm font-semibold mb-3 text-[var(--text-secondary)]">
                                        Key Achievements
                                    </h4>
                                    <ul className="space-y-2">
                                        {exp.achievements.map((achievement, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                                                <span className="text-[var(--neon-blue)] mt-1">▸</span>
                                                <span>{achievement}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
