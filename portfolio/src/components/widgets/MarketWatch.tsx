'use client';

import { useState, useEffect, useMemo } from 'react';
import {
    ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Exclusive Assets
const ASSETS = [
    { symbol: 'NDX', name: 'NASDAQ 100', price: 17850.45, type: 'Index' },
    { symbol: 'QA-X', name: 'QA Tech Index', price: 420.69, type: 'Custom' },
    { symbol: 'BTC', name: 'Bitcoin Pro', price: 69420.00, type: 'Crypto' },
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 950.00, type: 'Stock' },
];

interface MarketData {
    time: string;
    price: number;
    volume: number;
    rsi: number; // Relative Strength Index simulation
}

export default function MarketWatch() {
    const [activeAsset, setActiveAsset] = useState(ASSETS[1]);
    const [data, setData] = useState<MarketData[]>([]);
    const [algoState, setAlgoState] = useState('Analyzing...');
    const [recommendation, setRecommendation] = useState<'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL'>('HOLD');

    // Generate initial data
    const initialData = useMemo(() => {
        const basePrice = activeAsset.price;
        return Array.from({ length: 30 }, (_, i) => ({
            time: `T-${30 - i}`,
            price: basePrice + (Math.random() - 0.5) * (basePrice * 0.05),
            volume: Math.floor(Math.random() * 1000) + 500,
            rsi: 40 + Math.random() * 20
        }));
    }, [activeAsset]);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    // Live update simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setData((prev) => {
                const last = prev[prev.length - 1];
                const newPrice = last.price * (1 + (Math.random() - 0.48) * 0.01); // Subtle drift
                const newRsi = Math.max(0, Math.min(100, last.rsi + (Math.random() - 0.5) * 5));

                const newEntry = {
                    time: 'Now',
                    price: newPrice,
                    volume: Math.floor(Math.random() * 2000),
                    rsi: newRsi
                };

                const newData = [...prev.slice(1), newEntry];

                // Algo Logic
                if (newRsi > 70) {
                    setRecommendation('STRONG SELL');
                    setAlgoState('Overbought Detected');
                } else if (newRsi < 30) {
                    setRecommendation('STRONG BUY');
                    setAlgoState('Oversold Opportunity');
                } else if (newPrice > last.price * 1.005) {
                    setRecommendation('BUY');
                    setAlgoState('Bullish Momentum');
                } else if (newPrice < last.price * 0.995) {
                    setRecommendation('SELL');
                    setAlgoState('Bearish Divergence');
                } else {
                    setRecommendation('HOLD');
                    setAlgoState('Market Consolidation');
                }

                return newData;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    const currentPrice = data[data.length - 1]?.price || activeAsset.price;
    const priceChange = ((currentPrice - activeAsset.price) / activeAsset.price) * 100;
    const currentRsi = data[data.length - 1]?.rsi || 50;

    return (
        <div className="glass-strong rounded-3xl p-6 h-full border border-[var(--glass-border)] hover:border-[var(--neon-green)] transition-colors relative overflow-hidden flex flex-col group">

            {/* Top Bar: Asset Selection */}
            <div className="flex justify-between items-center mb-4 z-10 overflow-x-auto pb-2 no-scrollbar">
                <div className="flex gap-2">
                    {ASSETS.map((asset) => (
                        <button
                            key={asset.symbol}
                            onClick={() => setActiveAsset(asset)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${activeAsset.symbol === asset.symbol
                                    ? 'bg-[var(--neon-blue)] border-[var(--neon-blue)] text-black shadow-[0_0_15px_var(--neon-blue)]'
                                    : 'glass border-white/10 text-[var(--text-secondary)] hover:border-white hover:text-white'
                                }`}
                        >
                            {asset.symbol}
                        </button>
                    ))}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)] hidden md:block animate-pulse">
                    ● LIVE FEED
                </div>
            </div>

            {/* Main Stats Panel */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 z-10 px-2">
                <div>
                    <h3 className="text-sm text-[var(--text-tertiary)] mb-1">{activeAsset.name}</h3>
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-mono font-bold text-white tracking-tighter">
                            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-sm font-bold px-2 py-0.5 rounded ${priceChange >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                        </span>
                    </div>
                </div>

                {/* Algo Recommendation Card */}
                <div className="mt-4 md:mt-0 flex gap-4">
                    <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-[var(--text-tertiary)]">RSI (14)</div>
                        <div className={`font-mono font-bold ${currentRsi > 70 ? 'text-red-400' : currentRsi < 30 ? 'text-green-400' : 'text-yellow-400'}`}>
                            {currentRsi.toFixed(1)}
                        </div>
                    </div>

                    <div className={`
                        px-4 py-2 rounded-xl border backdrop-blur-md flex flex-col items-center justify-center min-w-[120px] shadow-lg
                        ${recommendation.includes('BUY') ? 'bg-green-900/40 border-green-500/50 shadow-green-500/20' :
                            recommendation.includes('SELL') ? 'bg-red-900/40 border-red-500/50 shadow-red-500/20' :
                                'bg-yellow-900/40 border-yellow-500/50 shadow-yellow-500/20'}
                     `}>
                        <span className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{algoState}</span>
                        <span className={`text-lg font-black tracking-wider ${recommendation.includes('BUY') ? 'text-green-400' :
                                recommendation.includes('SELL') ? 'text-red-400' :
                                    'text-yellow-400'
                            }`}>
                            {recommendation}
                        </span>
                    </div>
                </div>
            </div>

            {/* Advanced Chart */}
            <div className="flex-1 min-h-[180px] w-full relative z-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--neon-blue)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--neon-blue)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fff" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#fff" stopOpacity={0.02} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis yAxisId="left" domain={['auto', 'auto']} hide />
                        <YAxis yAxisId="right" orientation="right" hide />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#000000dd', border: '1px solid #333', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                            labelStyle={{ color: '#888' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                        />

                        {/* Volume Bars */}
                        <Bar
                            yAxisId="right"
                            dataKey="volume"
                            fill="url(#colorVol)"
                            barSize={6}
                        />

                        {/* Price Area */}
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="price"
                            stroke="var(--neon-blue)"
                            strokeWidth={3}
                            fill="url(#colorPrice)"
                            isAnimationActive={false} // Smoother for live updates
                        />

                        {/* Dynamic Threshold Lines */}
                        <ReferenceLine yAxisId="left" y={activeAsset.price} stroke="#ffffff30" strokeDasharray="5 5" />
                    </ComposedChart>
                </ResponsiveContainer>

                {/* Grid Overlay for aesthetic */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
            </div>

            {/* Footer Status */}
            <div className="mt-2 flex justify-between items-center text-[10px] text-[var(--text-tertiary)] z-10">
                <div className="flex gap-2">
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Market Open</span>
                    <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--neon-blue)]"></div> Algo Active</span>
                </div>
                <div>Vol: {(data[data.length - 1]?.volume / 1000).toFixed(1)}k</div>
            </div>
        </div>
    );
}
