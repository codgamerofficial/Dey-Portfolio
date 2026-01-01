'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const qaPhilosophy = [
    {
        icon: '🔍',
        title: 'Think Like a User',
        description: 'Every feature is tested from the end-user perspective, not just technical requirements',
        color: '#00d4ff',
    },
    {
        icon: '🎯',
        title: 'Quality Over Speed',
        description: 'Fast releases mean nothing if they break user trust. Quality is non-negotiable',
        color: '#a855f7',
    },
    {
        icon: '🔄',
        title: 'Continuous Improvement',
        description: 'Every bug is a learning opportunity. Every test case makes the product stronger',
        color: '#ec4899',
    },
    {
        icon: '📊',
        title: 'Data-Driven Decisions',
        description: 'Metrics, logs, and evidence guide testing strategy, not assumptions',
        color: '#06b6d4',
    },
];

const bugLifecycle = [
    { stage: 'New', color: '#ef4444', description: 'Bug reported and logged' },
    { stage: 'Assigned', color: '#f97316', description: 'Assigned to developer' },
    { stage: 'Open', color: '#f59e0b', description: 'Under investigation' },
    { stage: 'Fixed', color: '#84cc16', description: 'Fix implemented' },
    { stage: 'Retest', color: '#06b6d4', description: 'QA verification' },
    { stage: 'Closed', color: '#22c55e', description: 'Verified and closed' },
];

const testingPyramid = [
    { level: 'E2E Tests', percentage: 10, color: '#ef4444', description: 'Full user journey tests' },
    { level: 'Integration Tests', percentage: 30, color: '#f59e0b', description: 'Component interaction tests' },
    { level: 'Unit Tests', percentage: 60, color: '#22c55e', description: 'Individual function tests' },
];

export default function QAMindset() {
    const [activeTab, setActiveTab] = useState<'philosophy' | 'lifecycle' | 'pyramid'>('philosophy');

    return (
        <section id="qa-mindset" className="section relative overflow-hidden bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
            {/* Background */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[var(--neon-purple)] rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[var(--neon-blue)] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
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
                    <h2 className="text-6xl font-bold mb-6">
                        <span className="gradient-text">QA Mindset</span>
                    </h2>
                    <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
                        How I think as a Quality Assurance Engineer
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center gap-4 mb-12 flex-wrap"
                >
                    {(['philosophy', 'lifecycle', 'pyramid'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${activeTab === tab
                                    ? 'bg-gradient-to-r from-[var(--neon-blue)] to-[var(--neon-purple)] text-white neon-glow scale-105'
                                    : 'glass text-[var(--text-secondary)] hover:text-white hover:scale-105'
                                }`}
                        >
                            {tab === 'philosophy' && '💭 Philosophy'}
                            {tab === 'lifecycle' && '🔄 Bug Lifecycle'}
                            {tab === 'pyramid' && '📊 Testing Pyramid'}
                        </button>
                    ))}
                </motion.div>

                {/* Content */}
                <div className="max-w-6xl mx-auto">
                    {/* Philosophy Tab */}
                    {activeTab === 'philosophy' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {qaPhilosophy.map((item, index) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ scale: 1.02, y: -5 }}
                                    className="glass-strong rounded-2xl p-8 border-2 border-transparent hover:border-[var(--neon-blue)] transition-all duration-300"
                                >
                                    <div className="text-5xl mb-4">{item.icon}</div>
                                    <h3 className="text-2xl font-bold mb-3" style={{ color: item.color }}>
                                        {item.title}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] leading-relaxed">
                                        {item.description}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Bug Lifecycle Tab */}
                    {activeTab === 'lifecycle' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="glass-strong rounded-3xl p-12"
                        >
                            <h3 className="text-3xl font-bold mb-8 text-center gradient-text">
                                Defect Lifecycle Flow
                            </h3>
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                {bugLifecycle.map((stage, index) => (
                                    <motion.div
                                        key={stage.stage}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="flex flex-col items-center text-center relative"
                                    >
                                        {/* Stage Circle */}
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="w-24 h-24 rounded-full flex items-center justify-center mb-4 relative"
                                            style={{
                                                background: `${stage.color}20`,
                                                border: `3px solid ${stage.color}`,
                                            }}
                                        >
                                            <span className="text-2xl font-bold" style={{ color: stage.color }}>
                                                {index + 1}
                                            </span>

                                            {/* Glow Effect */}
                                            <div
                                                className="absolute inset-0 rounded-full blur-xl opacity-50"
                                                style={{ background: stage.color }}
                                            />
                                        </motion.div>

                                        {/* Stage Name */}
                                        <h4 className="text-lg font-bold mb-2" style={{ color: stage.color }}>
                                            {stage.stage}
                                        </h4>
                                        <p className="text-sm text-[var(--text-tertiary)] max-w-[120px]">
                                            {stage.description}
                                        </p>

                                        {/* Arrow */}
                                        {index < bugLifecycle.length - 1 && (
                                            <div className="hidden md:block absolute top-12 left-full w-8">
                                                <svg
                                                    className="w-8 h-8 text-[var(--neon-blue)]"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Testing Pyramid Tab */}
                    {activeTab === 'pyramid' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="glass-strong rounded-3xl p-12"
                        >
                            <h3 className="text-3xl font-bold mb-8 text-center gradient-text">
                                Testing Pyramid Strategy
                            </h3>
                            <div className="max-w-2xl mx-auto">
                                {testingPyramid.map((level, index) => (
                                    <motion.div
                                        key={level.level}
                                        initial={{ opacity: 0, x: -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.2 }}
                                        className="mb-6 last:mb-0"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-xl font-bold" style={{ color: level.color }}>
                                                {level.level}
                                            </h4>
                                            <span className="text-2xl font-bold" style={{ color: level.color }}>
                                                {level.percentage}%
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--text-tertiary)] mb-3">
                                            {level.description}
                                        </p>

                                        {/* Progress Bar */}
                                        <div className="h-16 bg-[var(--bg-tertiary)] rounded-xl overflow-hidden relative">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${level.percentage}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
                                                className="h-full rounded-xl relative overflow-hidden"
                                                style={{ background: level.color }}
                                            >
                                                {/* Shimmer Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                            </motion.div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Quality vs Speed Balance */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="mt-12 p-6 rounded-2xl bg-[var(--bg-tertiary)] border border-[var(--neon-blue)]"
                            >
                                <h4 className="text-xl font-bold mb-4 text-center text-[var(--neon-blue)]">
                                    ⚖️ Quality vs Speed Balance
                                </h4>
                                <p className="text-center text-[var(--text-secondary)]">
                                    More unit tests = faster feedback, fewer bugs in production.<br />
                                    Fewer E2E tests = faster test execution, focused on critical paths.
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </div>
            </div>
        </section>
    );
}
