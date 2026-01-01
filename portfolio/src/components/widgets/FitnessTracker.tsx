'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function FitnessTracker() {
    const [stats, setStats] = useState({
        steps: 8432,
        calories: 420,
        bpm: 72,
        distance: 5.2, // km
        sleep: '7h 12m'
    });

    // Heart Rate History for Sparkline
    const [bpmHistory, setBpmHistory] = useState<number[]>(Array(20).fill(72));

    useEffect(() => {
        const interval = setInterval(() => {
            setStats(prev => {
                const addSteps = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
                const newBpm = 70 + Math.floor(Math.sin(Date.now() / 1000) * 10) + (Math.random() - 0.5) * 5;

                return {
                    ...prev,
                    steps: prev.steps + addSteps,
                    calories: prev.calories + (addSteps * 0.04),
                    bpm: Math.round(newBpm),
                    distance: prev.distance + (addSteps * 0.0007)
                };
            });

            setBpmHistory(prev => {
                const newBpm = 70 + Math.floor(Math.sin(Date.now() / 1000) * 10) + (Math.random() - 0.5) * 5;
                return [...prev.slice(1), newBpm];
            });

        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Ring Calculations
    const stepGoal = 10000;
    const stepProgress = Math.min(100, (stats.steps / stepGoal) * 100);
    const calGoal = 600;
    const calProgress = Math.min(100, (stats.calories / calGoal) * 100);
    const standGoal = 12;
    const standProgress = 75; // Locked for demo

    const Radius1 = 80;
    const Radius2 = 60;
    const Radius3 = 40;
    const Circumference1 = 2 * Math.PI * Radius1;
    const Circumference2 = 2 * Math.PI * Radius2;
    const Circumference3 = 2 * Math.PI * Radius3;

    return (
        <div className="glass-strong rounded-3xl p-6 h-full flex flex-col justify-between border border-[var(--glass-border)] hover:border-[var(--neon-green)] transition-all relative overflow-hidden group">

            {/* Header */}
            <div className="flex justify-between items-center z-10 mb-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>❤️</span> Bio-Link
                </h3>
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    Live Vitals
                </div>
            </div>

            {/* Main Content: Rings + detailed stats */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 z-10 flex-1">

                {/* Rings */}
                <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90">
                        {/* Ring 1 Background */}
                        <circle cx="50%" cy="50%" r={Radius1} stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                        {/* Ring 1 Progress (Steps) */}
                        <motion.circle
                            cx="50%" cy="50%" r={Radius1}
                            stroke="var(--neon-blue)" strokeWidth="12" fill="none"
                            strokeLinecap="round"
                            strokeDasharray={Circumference1}
                            initial={{ strokeDashoffset: Circumference1 }}
                            animate={{ strokeDashoffset: Circumference1 - (stepProgress / 100) * Circumference1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />

                        {/* Ring 2 Background */}
                        <circle cx="50%" cy="50%" r={Radius2} stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                        {/* Ring 2 Progress (Cals) */}
                        <motion.circle
                            cx="50%" cy="50%" r={Radius2}
                            stroke="var(--neon-purple)" strokeWidth="12" fill="none"
                            strokeLinecap="round"
                            strokeDasharray={Circumference2}
                            initial={{ strokeDashoffset: Circumference2 }}
                            animate={{ strokeDashoffset: Circumference2 - (calProgress / 100) * Circumference2 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                        />

                        {/* Ring 3 Background */}
                        <circle cx="50%" cy="50%" r={Radius3} stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" />
                        {/* Ring 3 Progress (Stand - Static Demo) */}
                        <motion.circle
                            cx="50%" cy="50%" r={Radius3}
                            stroke="white" strokeWidth="12" fill="none"
                            strokeLinecap="round"
                            strokeDasharray={Circumference3}
                            initial={{ strokeDashoffset: Circumference3 }}
                            animate={{ strokeDashoffset: Circumference3 - (standProgress / 100) * Circumference3 }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                        />
                    </svg>

                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                        >
                            ⚡
                        </motion.div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4 w-full">
                    {/* Steps */}
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <div className="text-[10px] text-[var(--text-tertiary)] uppercase">Steps</div>
                        <div className="text-xl font-bold font-mono text-[var(--neon-blue)]">{stats.steps.toLocaleString()}</div>
                    </div>
                    {/* Calories */}
                    <div className="bg-black/30 p-3 rounded-xl border border-white/5">
                        <div className="text-[10px] text-[var(--text-tertiary)] uppercase">Kcal</div>
                        <div className="text-xl font-bold font-mono text-[var(--neon-purple)]">{stats.calories.toFixed(0)}</div>
                    </div>
                    {/* BPM */}
                    <div className="col-span-2 bg-black/30 p-3 rounded-xl border border-white/5 relative overflow-hidden">
                        <div className="flex justify-between items-end mb-1 relative z-10">
                            <div>
                                <div className="text-[10px] text-[var(--text-tertiary)] uppercase flex items-center gap-1">
                                    Heart Rate <span className="text-red-500 animate-pulse">❤</span>
                                </div>
                                <div className="text-2xl font-bold font-mono text-white">{stats.bpm} <span className="text-sm font-normal text-[var(--text-tertiary)]">BPM</span></div>
                            </div>
                        </div>
                        {/* Micro Sparkline */}
                        <div className="flex items-end gap-[2px] h-8 mt-1 opacity-50">
                            {bpmHistory.map((val, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-red-500/50 rounded-t-sm transition-all duration-300"
                                    style={{ height: `${((val - 50) / 100) * 100}%` }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Background Decor */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--neon-blue)]/5 rounded-full blur-2xl" />
        </div>
    );
}
