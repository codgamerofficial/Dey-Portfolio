'use client';

import { motion } from 'framer-motion';
import { Play, TrendingUp, Music2, Radio, Heart } from 'lucide-react';
import { useMusicStore } from '@/lib/store/useMusicStore';

const FEATURED_ALBUM = {
    id: 'feat-1',
    title: 'Neon Nights: Synthwave Vol. 1',
    artist: 'Cyber Collective',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop',
    tracks: [
        {
            id: 't1',
            title: 'Midnight Drive',
            artist: 'Cyber Collective',
            album: 'Neon Nights',
            duration: 214,
            coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1000&auto=format&fit=crop',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Legal Free Test Audio
            source: 'INDIE' as const
        },
        {
            id: 't2',
            title: 'Digital Dreams',
            artist: 'Cyber Collective',
            album: 'Neon Nights',
            duration: 198,
            coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
            source: 'INDIE' as const
        }
    ]
};

const CATEGORIES = [
    { title: 'Trending Now', icon: TrendingUp },
    { title: 'New Releases', icon: Music2 },
    { title: 'Radio Stations', icon: Radio },
    { title: 'For You', icon: Heart },
];

export default function MusicPage() {
    const { play } = useMusicStore();

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            {/* Hero Section */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${FEATURED_ALBUM.coverUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute bottom-0 left-0 p-8 md:p-16 max-w-4xl z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end gap-8"
                    >
                        <img
                            src={FEATURED_ALBUM.coverUrl}
                            alt={FEATURED_ALBUM.title}
                            className="w-48 h-48 md:w-64 md:h-64 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hidden md:block"
                        />
                        <div>
                            <span className="text-[var(--neon-cyan)] text-sm font-bold tracking-widest mb-2 block">EXCLUSIVE PREMIERE</span>
                            <h1 className="text-4xl md:text-7xl font-bold mb-4 leading-tight">{FEATURED_ALBUM.title}</h1>
                            <p className="text-white/70 text-lg mb-8">{FEATURED_ALBUM.artist} • 2024 • Synthwave</p>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => play(FEATURED_ALBUM.tracks[0])}
                                    className="px-8 py-4 bg-[var(--neon-cyan)] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                                >
                                    <Play fill="currentColor" /> PLAY NOW
                                </button>
                                <button className="px-8 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-full hover:bg-white/20 transition-colors border border-white/10">
                                    SAVE TO LIBRARY
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Categories */}
            <div className="px-8 md:px-16 py-12">
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {CATEGORIES.map((cat, idx) => (
                        <div key={idx} className="flex-shrink-0 px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 cursor-pointer hover:bg-white/10 hover:border-[var(--neon-cyan)] transition-all">
                            <cat.icon className="w-5 h-5 text-[var(--neon-cyan)]" />
                            <span className="font-medium whitespace-nowrap">{cat.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Track Grid */}
            <div className="px-8 md:px-16">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    <TrendingUp className="text-[var(--neon-cyan)]" />
                    Top Charts
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {FEATURED_ALBUM.tracks.map((track, idx) => (
                        <motion.div
                            key={track.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                        >
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                                <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                <button
                                    onClick={() => play(track)}
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="w-12 h-12 bg-[var(--neon-cyan)] rounded-full flex items-center justify-center text-black shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <Play fill="currentColor" className="ml-1" />
                                    </div>
                                </button>
                            </div>
                            <h3 className="font-bold text-white mb-1 truncate">{track.title}</h3>
                            <p className="text-xs text-white/50">{track.artist}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
