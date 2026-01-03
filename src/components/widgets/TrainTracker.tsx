'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Train, Clock, MapPin, AlertCircle, RefreshCw, ArrowRight } from 'lucide-react';

// Dynamic import for the MapWidget to avoid server-side issues with Leaflet
const MapWidget = dynamic(() => import('./MapWidget'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-slate-900/50 animate-pulse flex items-center justify-center text-cyan-500/50">Initializing Satellite Uplink...</div>
});



export default function TrainTracker() {
    const [searchQuery, setSearchQuery] = useState('');
    const [trainData, setTrainData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setTrainData(null);

        try {
            const res = await fetch(`/api/train-status?trainNo=${searchQuery}`);
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch train data');
            }
            const data = await res.json();
            setTrainData(data);
        } catch (err: any) {
            setError(err.message || 'An error occurred while communicating with the satellite uplink.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col md:flex-row gap-6 p-6">
            {/* Control Panel */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[var(--neon-cyan)]/10 rounded-bl-full -mr-10 -mt-10 blur-2xl" />

                    <h2 className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-blue)] mb-6 flex items-center">
                        <Train className="w-6 h-6 mr-2 text-[var(--neon-cyan)]" />
                        LOCOMOTIVE TRACKER
                    </h2>

                    <form onSubmit={handleSearch} className="relative mb-6">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="ENTER TRAIN NO."
                            className="w-full bg-black/50 border border-white/20 rounded-xl py-3 px-4 pl-12 text-white placeholder-white/30 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors font-mono tracking-wider"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--neon-cyan)]/20 hover:bg-[var(--neon-cyan)]/40 rounded-lg text-[var(--neon-cyan)] transition-colors"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center text-sm font-mono">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {error}
                        </div>
                    )}

                    {loading && (
                        <div className="flex items-center justify-center py-10 text-[var(--neon-cyan)] animate-pulse font-mono">
                            <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                            ESTABLISHING UPLINK...
                        </div>
                    )}

                    <AnimatePresence>
                        {trainData && !loading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <div>
                                    <div className="text-xs text-white/40 mb-1 font-mono tracking-widest">DESIGNATION</div>
                                    <div className="text-xl font-bold text-white tracking-wide">{trainData.name}</div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white/70">{trainData.number}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${trainData.status === 'ON TIME' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {trainData.status} {trainData.delay > 0 && `(+${trainData.delay}min)`}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-white/10">
                                    {trainData.route.map((station: any, idx: number) => (
                                        <div key={idx} className="relative pl-6">
                                            <div className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 ${station.status === 'ARRIVED' ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)] shadow-[0_0_10px_var(--neon-cyan)]' : station.status === 'DEPARTED' ? 'border-white/20 bg-white/10' : 'border-white/20 bg-black'}`} />
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <div className={`text-sm font-bold ${station.status === 'ARRIVED' ? 'text-[var(--neon-cyan)]' : 'text-white/80'}`}>{station.name}</div>
                                                    <div className="text-xs text-white/40 font-mono">{station.code}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-mono text-[var(--neon-blue)]">{station.time}</div>
                                                    <div className="text-[10px] text-white/30 uppercase tracking-wider">{station.status}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Map Visualization */}
            <div className="flex-1 h-[500px] md:h-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden relative">
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur rounded-full border border-white/10 text-xs font-mono text-white/60">
                    <MapPin className="w-3 h-3 inline mr-2 text-[var(--neon-cyan)]" />
                    LIVE SATELLITE FEED
                </div>
                {trainData ? (
                    <MapWidget lat={trainData.currentLocation.lat} lon={trainData.currentLocation.lon} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                        <MapPin className="w-16 h-16 mb-4 opacity-20" />
                        <div className="font-mono tracking-widest text-sm">WAITING FOR TARGET COORDINATES</div>
                    </div>
                )}
            </div>
        </div>
    );
}
