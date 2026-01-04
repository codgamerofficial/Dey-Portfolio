'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Skill {
    name: string;
    category: 'qa' | 'tech';
    description: string;
    example: string;
    color: string;
}

const skills: Skill[] = [
    // QA Skills
    {
        name: 'Manual Testing',
        category: 'qa',
        description: 'Comprehensive functional and non-functional testing',
        example: 'Executed smoke, sanity, and regression suites for critical releases',
        color: '#ff0000',
    },
    {
        name: 'UI & Usability',
        category: 'qa',
        description: 'Testing user interface and user experience flow',
        example: 'Ensured simplified user journeys and consistent design implementation',
        color: '#ff4444',
    },
    {
        name: 'JIRA',
        category: 'qa',
        description: 'Defect tracking and project management',
        example: 'Logged and tracked 200+ defects through complete resolution lifecycle',
        color: '#990000',
    },
    {
        name: 'Postman',
        category: 'qa',
        description: 'API testing fundamentals',
        example: 'Validated REST API endpoints and response status codes',
        color: '#cc0000',
    },
    {
        name: 'STLC',
        category: 'qa',
        description: 'Software Testing Life Cycle expert',
        example: 'Managed full testing lifecycle from planning to closure',
        color: '#ff6666',
    },
    // Tech Skills
    {
        name: 'Selenium',
        category: 'tech',
        description: 'Basic automation testing knowledge',
        example: 'Wrote basic scripts for automated browser interactions',
        color: '#ff3333',
    },
    {
        name: 'Core Java',
        category: 'tech',
        description: 'Programming fundamentals',
        example: 'Understanding of OOPS concepts for test automation',
        color: '#e60000',
    },
    {
        name: 'SQL',
        category: 'tech',
        description: 'Database verification',
        example: 'Executed queries to validate backend data integrity',
        color: '#bf0000',
    },
    {
        name: 'Python',
        category: 'tech',
        description: 'Scripting and development',
        example: 'Used for computer vision and scripting projects',
        color: '#ff1a1a',
    },
    {
        name: 'ArcGIS / GIS',
        category: 'tech',
        description: 'Geospatial data analysis',
        example: 'Processed complex spatial datasets for mapping projects',
        color: '#800000',
    },
    {
        name: 'Computer Vision',
        category: 'tech',
        description: 'OpenCV & TensorFlow',
        example: 'Developed ALPR and Pothole detection systems',
        color: '#ff4d4d',
    },
    {
        name: 'MS Office',
        category: 'tech',
        description: 'Documentation & Analysis',
        example: 'Created detailed test reports in Word and metrics in Excel',
        color: '#a3a3a3',
    },
];

export default function Skills() {
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
    const [filter, setFilter] = useState<'all' | 'qa' | 'tech'>('all');

    const filteredSkills = skills.filter(
        (skill) => filter === 'all' || skill.category === filter
    );

    return (
        <section id="skills" className="section relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--neon-blue)] rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--neon-purple)] rounded-full blur-3xl" />
            </div>

            <div className="container relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        <span className="gradient-text">Skills Galaxy</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Interactive visualization of my QA and technical expertise
                    </p>
                </motion.div>

                {/* Filter Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center gap-4 mb-12"
                >
                    {(['all', 'qa', 'tech'] as const).map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${filter === category
                                ? 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white neon-glow'
                                : 'glass text-[var(--text-secondary)] hover:text-white'
                                }`}
                        >
                            {category === 'all' ? 'All Skills' : category === 'qa' ? 'QA Skills' : 'Tech Skills'}
                        </button>
                    ))}
                </motion.div>

                {/* Skills Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                    {filteredSkills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            onClick={() => setSelectedSkill(skill)}
                            className="glass-strong rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
                            style={{
                                borderColor: skill.color,
                                borderWidth: '2px',
                            }}
                        >
                            {/* Hover Glow Effect */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                                style={{ background: skill.color }}
                            />

                            {/* Content */}
                            <div className="relative z-10">
                                <div
                                    className="w-12 h-12 rounded-full mb-4 flex items-center justify-center"
                                    style={{
                                        background: `${skill.color}20`,
                                        border: `2px solid ${skill.color}`,
                                    }}
                                >
                                    <div
                                        className="w-6 h-6 rounded-full"
                                        style={{ background: skill.color }}
                                    />
                                </div>
                                <h3 className="text-lg font-bold mb-2 text-white">{skill.name}</h3>
                                <p className="text-sm text-[var(--text-tertiary)] line-clamp-2">
                                    {skill.description}
                                </p>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute top-3 right-3">
                                <span
                                    className="text-xs px-2 py-1 rounded-full font-semibold"
                                    style={{
                                        background: `${skill.color}30`,
                                        color: skill.color,
                                    }}
                                >
                                    {skill.category.toUpperCase()}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Selected Skill Detail Modal */}
                {selectedSkill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedSkill(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-strong rounded-3xl p-8 max-w-2xl w-full"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                borderColor: selectedSkill.color,
                                borderWidth: '2px',
                            }}
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-3xl font-bold mb-2" style={{ color: selectedSkill.color }}>
                                        {selectedSkill.name}
                                    </h3>
                                    <span
                                        className="text-sm px-3 py-1 rounded-full font-semibold"
                                        style={{
                                            background: `${selectedSkill.color}30`,
                                            color: selectedSkill.color,
                                        }}
                                    >
                                        {selectedSkill.category.toUpperCase()}
                                    </span>
                                </div>
                                <button
                                    onClick={() => setSelectedSkill(null)}
                                    className="text-[var(--text-secondary)] hover:text-white transition-colors"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-lg font-semibold mb-2 text-[var(--text-secondary)]">
                                        Description
                                    </h4>
                                    <p className="text-white">{selectedSkill.description}</p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-2 text-[var(--text-secondary)]">
                                        Real-World Example
                                    </h4>
                                    <p className="text-white">{selectedSkill.example}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
