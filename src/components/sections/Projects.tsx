'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Project {
    id: string;
    title: string;
    description: string;
    tech_stack: string[];
    problem: string;
    solution: string;
    result: string;
    github_url?: string;
    demo_url?: string;
    category: string;
}

const projects: Project[] = [
    {
        id: '1',
        title: 'Automatic License Plate Recognition',
        description: 'Major project developing a real-time system to detect and classify license plates',
        tech_stack: ['Python', 'OpenCV', 'Tesseract OCR', 'TensorFlow', 'Keras'],
        problem: 'Manual tracking of vehicle data is inefficient for traffic management',
        solution: 'Built a robust recognition pipeline using OpenCV for localization and Tesseract OCR for text extraction',
        result: 'Achieved high accuracy in plate detection and text classification in real-time scenarios',
        github_url: '#',
        category: 'Computer Vision',
    },
    {
        id: '2',
        title: 'Pothole Detection via IoT',
        description: 'Minor project creating an automated system to detect road anomalies and alert via GPS',
        tech_stack: ['YOLOv5', 'TensorFlow', 'Python', 'IoT', 'GPS'],
        problem: 'Delayed road maintenance due to lack of real-time damage reporting',
        solution: 'Integrated YOLOv5 object detection with IoT sensors to map potholes automatically',
        result: 'Successfully enhanced road maintenance efficiency through automated data collection',
        github_url: '#',
        category: 'Computer Vision + IoT',
    },
    {
        id: '3',
        title: 'TeeState (University Project)',
        description: 'E-commerce platform for custom t-shirt sales powered by Shopify',
        tech_stack: ['Shopify', 'Liquid', 'HTML/CSS', 'Payment Gateway'],
        problem: 'Need for a streamlined digital storefront for custom apparel',
        solution: 'Developed a scalable Shopify store with custom themes and integrated payment processing',
        result: 'Successfully launched a functional business platform handling real transactions',
        demo_url: 'https://teestate-7531.myshopify.com/',
        category: 'E-Commerce',
    },
];

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <section id="projects" className="section relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat" />
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
                        <span className="gradient-text">Featured Projects</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Real-world engineering solutions combining QA mindset with technical innovation
                    </p>
                </motion.div>

                {/* Projects Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="glass-strong rounded-3xl p-8 h-full border-2 border-transparent hover:border-[var(--neon-blue)] transition-all duration-500 relative overflow-hidden">
                                {/* Hover Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--neon-blue)]/10 to-[var(--neon-purple)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Category Badge */}
                                    <div className="inline-block px-4 py-2 rounded-full bg-[var(--neon-blue)]/20 border border-[var(--neon-blue)] mb-4">
                                        <span className="text-sm font-semibold text-[var(--neon-blue)]">
                                            {project.category}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-[var(--neon-blue)] transition-colors">
                                        {project.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Tech Stack */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {project.tech_stack.map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-3 py-1 text-sm rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--glass-border)]"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setSelectedProject(project)}
                                            className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white font-semibold hover:scale-105 transition-transform neon-glow"
                                        >
                                            View Details
                                        </button>
                                        {project.demo_url && (
                                            <a
                                                href={project.demo_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 rounded-full glass border-2 border-white text-white font-semibold hover:bg-white hover:text-black transition-all flex items-center justify-center group/demo"
                                                title="Live Demo"
                                            >
                                                <span className="text-xl group-hover/demo:scale-110 transition-transform">🌐</span>
                                            </a>
                                        )}
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 rounded-full glass border-2 border-[var(--neon-blue)] text-white font-semibold hover:bg-[var(--neon-blue)] transition-all"
                                            >
                                                <svg
                                                    className="w-6 h-6"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                </svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Project Detail Modal */}
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="glass-strong rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border-2 border-[var(--neon-blue)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <div className="inline-block px-4 py-2 rounded-full bg-[var(--neon-blue)]/20 border border-[var(--neon-blue)] mb-4">
                                        <span className="text-sm font-semibold text-[var(--neon-blue)]">
                                            {selectedProject.category}
                                        </span>
                                    </div>
                                    <h3 className="text-4xl font-bold gradient-text mb-4">
                                        {selectedProject.title}
                                    </h3>
                                    <p className="text-xl text-[var(--text-secondary)]">
                                        {selectedProject.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedProject(null)}
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

                            {/* Tech Stack */}
                            <div className="mb-8">
                                <h4 className="text-lg font-semibold mb-4 text-[var(--neon-blue)]">
                                    Tech Stack
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {selectedProject.tech_stack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-4 py-2 rounded-full bg-[var(--bg-tertiary)] text-white border border-[var(--neon-blue)]"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Problem → Solution → Result */}
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <span className="text-2xl">🎯</span>
                                        <span className="text-[var(--neon-pink)]">Problem</span>
                                    </h4>
                                    <p className="text-[var(--text-secondary)] leading-relaxed pl-8">
                                        {selectedProject.problem}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <span className="text-2xl">💡</span>
                                        <span className="text-[var(--neon-cyan)]">Solution</span>
                                    </h4>
                                    <p className="text-[var(--text-secondary)] leading-relaxed pl-8">
                                        {selectedProject.solution}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <span className="text-2xl">🚀</span>
                                        <span className="text-[var(--neon-blue)]">Result</span>
                                    </h4>
                                    <p className="text-[var(--text-secondary)] leading-relaxed pl-8">
                                        {selectedProject.result}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
