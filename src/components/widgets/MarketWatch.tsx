'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import {
    ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Asset Definitions
const MARKETS = {
    CRYPTO: [
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', type: 'Crypto', isReal: true },
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', type: 'Crypto', isReal: true },
        { id: 'solana', symbol: 'SOL', name: 'Solana', type: 'Crypto', isReal: true },
        { id: 'tether', symbol: 'USDT', name: 'Tether', type: 'Crypto', isReal: true },
    ],
    INDIAN: [
        { id: 'nifty', symbol: 'NIFTY 50', name: 'Nifty 50', base: 22450, type: 'Index', isReal: false },
        { id: 'sensex', symbol: 'SENSEX', name: 'BSE Sensex', base: 73900, type: 'Index', isReal: false },
        { id: 'reliance', symbol: 'RELIANCE', name: 'Reliance Ind.', base: 2985, type: 'Stock', isReal: false },
        { id: 'hdfc', symbol: 'HDFCBANK', name: 'HDFC Bank', base: 1450, type: 'Stock', isReal: false },
    ],
    US: [
        { id: 'ndx', symbol: 'NASDAQ', name: 'Nasdaq 100', base: 18200, type: 'Index', isReal: false },
        { id: 'spx', symbol: 'S&P 500', name: 'S&P 500', base: 5200, type: 'Index', isReal: false },
        { id: 'nvda', symbol: 'NVDA', name: 'NVIDIA Corp', base: 920, type: 'Stock', isReal: false },
        { id: 'aapl', symbol: 'AAPL', name: 'Apple Inc.', base: 170, type: 'Stock', isReal: false },
    ]
};

interface MarketData {
    time: string;
    price: number;
    volume: number;
    rsi: number;
}

export default function MarketWatch() {
    const [category, setCategory] = useState<'CRYPTO' | 'INDIAN' | 'US'>('INDIAN');
    const [activeAsset, setActiveAsset] = useState(MARKETS['INDIAN'][0]);

    // Data State
    const [data, setData] = useState<MarketData[]>([]);
    const [currentRealPrice, setCurrentRealPrice] = useState<number | null>(null);
    const [algoState, setAlgoState] = useState('Analyzing...');
    const [recommendation, setRecommendation] = useState<'STRONG BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG SELL'>('HOLD');

    // Refs for simulation stability
    const basePriceRef = useRef(activeAsset.base || 100);

    // Fetch Real Crypto Price
    const fetchRealPrice = async (id: string) => {
        try {
            const res = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
            const price = res.data[id]?.usd;
            if (price) {
                setCurrentRealPrice(price);
                basePriceRef.current = price;
            }
        } catch (e) {
            console.warn("Crypto API Limit", e);
        }
    };

    // Initialize / Switch Asset
    useEffect(() => {
        // Reset Logic
        setData([]);
        setAlgoState('Initializing...');

        if (activeAsset.isReal) {
            fetchRealPrice(activeAsset.id);
        } else {
            basePriceRef.current = activeAsset.base || 1000;
            setCurrentRealPrice(activeAsset.base || 1000);
        }

        // Generate History
        const hist = [];
        let price = activeAsset.isReal ? (currentRealPrice || 0) : (activeAsset.base || 1000);
        // If real price not active yet, use 0 (will fix on update)

        for (let i = 0; i < 40; i++) {
            hist.push({
                time: `T-${40 - i}`,
                price: price, // Flat start, will animate
                volume: 500,
                rsi: 50
            });
        }
        setData(hist);

    }, [activeAsset, category]);

    // Live Tick Loop
    useEffect(() => {
        const interval = setInterval(async () => {

            // Update Base Price if Real
            let tickPrice = 0;
            if (activeAsset.isReal) {
                // Poll API rarely (every 10 ticks? no, rate limits)
                // Just simulate jitter around last known real price
                if (Math.random() > 0.9) await fetchRealPrice(activeAsset.id);
                const lastPrice = currentRealPrice || basePriceRef.current;
                // Micro-jitter for liveness
                tickPrice = lastPrice * (1 + (Math.random() - 0.5) * 0.0005);
            } else {
                // Simulation Logic
                const vol = (Math.random() - 0.48) * 0.005; // Volatility
                basePriceRef.current = basePriceRef.current * (1 + vol);
                tickPrice = basePriceRef.current;
            }

            setData(prev => {
                const last = prev[prev.length - 1];
                const newRsi = Math.max(10, Math.min(90, last.rsi + (Math.random() - 0.5) * 8));

                // Algo Logic
                let rec: any = 'HOLD';
                let state = 'Consolidating';

                if (newRsi > 75) { rec = 'SELL'; state = 'Overbought'; }
                else if (newRsi < 25) { rec = 'BUY'; state = 'Oversold'; }
                else if (tickPrice > last.price) { rec = 'BUY'; state = 'Bullish'; }
                else { rec = 'SELL'; state = 'Bearish'; }

                if (newRsi > 85) rec = 'STRONG SELL';
                if (newRsi < 15) rec = 'STRONG BUY';

                setRecommendation(rec);
                setAlgoState(state);

                const newPoint = {
                    time: new Date().toLocaleTimeString(),
                    price: tickPrice,
                    volume: Math.floor(Math.random() * 5000) + 1000,
                    rsi: newRsi
                };
                return [...prev.slice(1), newPoint];
            });

        }, 1000);
        return () => clearInterval(interval);
    }, [activeAsset, currentRealPrice]);


    const currentPriceDisplay = data[data.length - 1]?.price || basePriceRef.current;
    const startPrice = data[0]?.price || basePriceRef.current;
    const change = ((currentPriceDisplay - startPrice) / startPrice) * 100;

    return (
        <div className="glass-strong rounded-3xl p-6 h-full border border-[var(--glass-border)] hover:border-[var(--neon-blue)] transition-colors relative overflow-hidden flex flex-col group">

            {/* Header: Market Tabs */}
            <div className="flex gap-4 mb-4 border-b border-white/10 pb-2 z-20">
                {(Object.keys(MARKETS) as Array<keyof typeof MARKETS>).map(m => (
                    <button
                        key={m}
                        onClick={() => { setCategory(m); setActiveAsset(MARKETS[m][0]); }}
                        className={`text-xs font-bold tracking-wider px-2 py-1 rounded transition-colors ${category === m ? 'bg-white/10 text-[var(--neon-blue)]' : 'text-[var(--text-tertiary)] hover:text-white'}`}
                    >
                        {m}
                    </button>
                ))}
            </div>

            {/* Asset Selector */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar z-20 pb-2">
                {MARKETS[category].map(asset => (
                    <button
                        key={asset.id}
                        onClick={() => setActiveAsset(asset)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap border transition-all ${activeAsset.id === asset.id
                                ? 'bg-[var(--neon-blue)] border-[var(--neon-blue)] text-black'
                                : 'border-white/10 text-[var(--text-secondary)] hover:border-white/30'
                            }`}
                    >
                        {asset.symbol}
                    </button>
                ))}
            </div>

            {/* Main Display */}
            <div className="flex justify-between items-end mb-6 z-10 px-1">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm text-white font-bold">{activeAsset.name}</h3>
                        {activeAsset.isReal && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="Live Data"></span>}
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-mono font-bold text-white tracking-tighter">
                            {activeAsset.type === 'Crypto' ? '$' : category === 'INDIAN' ? '₹' : '$'}
                            {currentPriceDisplay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={`text-xs font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                        </span>
                    </div>
                </div>

                {/* AI Rec Engine */}
                <div className="flex flex-col items-end">
                    <span className="text-[9px] text-[var(--text-tertiary)] uppercase tracking-widest mb-1">AI Recommendation</span>
                    <div className={`
                        px-3 py-1.5 rounded bg-black/40 border backdrop-blur flex items-center gap-2
                        ${recommendation.includes('BUY') ? 'border-green-500/50 text-green-400' :
                            recommendation.includes('SELL') ? 'border-red-500/50 text-red-400' : 'border-yellow-500/50 text-yellow-400'}
                    `}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span className="font-bold text-xs">{recommendation}</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full relative z-0 min-h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={data}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--neon-blue)" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="var(--neon-blue)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <YAxis domain={['auto', 'auto']} hide />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="var(--neon-blue)"
                            strokeWidth={2}
                            fill="url(#colorPrice)"
                            isAnimationActive={false}
                        />
                        <ReferenceLine y={data[0]?.price} stroke="#ffffff20" strokeDasharray="3 3" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [value.toFixed(2), 'Price']}
                            labelStyle={{ display: 'none' }}
                        />
                    </ComposedChart>
                </ResponsiveContainer>

                {/* Overlay Text */}
                <div className="absolute top-2 left-2 text-[10px] text-[var(--text-tertiary)] font-mono">
                    VOL: {(data[data.length - 1]?.volume / 1000).toFixed(1)}K
                </div>
            </div>

            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
        </div>
    );
}
