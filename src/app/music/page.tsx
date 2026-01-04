'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Music2, Radio, Heart, Upload, Trash2, Loader2 } from 'lucide-react';
import { useMusicStore } from '@/lib/store/useMusicStore';
import UploadModal from '@/components/music/UploadModal';

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
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<any[]>([]);
    const [isSearching, setIsSearching] = React.useState(false);
    const [myUploads, setMyUploads] = React.useState<any[]>([]);
    const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
    const [deletingId, setDeletingId] = React.useState<string | null>(null);

    const fetchUploads = async () => {
        try {
            const res = await fetch('/music/my-uploads');
            if (res.ok) {
                const data = await res.json();
                setMyUploads(data);
            }
        } catch (error) {
            console.error('Failed to fetch uploads', error);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent playing the song
        if (!confirm('Are you sure you want to delete this song?')) return;

        setDeletingId(id);
        try {
            const res = await fetch(`/music/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                // Refresh list
                setMyUploads(prev => prev.filter(s => s.id !== id));
            } else {
                alert('Failed to delete song');
            }
        } catch (error) {
            console.error('Delete error', error);
            alert('Error deleting song');
        } finally {
            setDeletingId(null);
        }
    };

    React.useEffect(() => {
        fetchUploads();
    }, []);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Attempt to search via the NestJS Media Server
            const res = await fetch(`/music/search?q=${encodeURIComponent(searchQuery)}`)
                .catch(() => null);

            if (res && res.ok) {
                const data = await res.json();
                // Merge local results if available in backend response, or purely handle local
                // Assuming backend returns { local: [], audius: [] } or just flat array?
                // The service returns { local: [] }. Let's assume for now we just show local results if searching matches them?
                // Actually the current backend service only returns { local: filtered }.
                // If I want to search BOTH, I might need to update the backend logic more robustly later.
                // For now, let's just use what the backend returns.
                // The previous code expected { audius: [] }. My new backend returns { local: [] }.
                // I should update the handler to support both or just set results.

                // Let's blindly set results if array, or extracting keys.
                const results = data.audius || data.local || [];
                setSearchResults(results);
            } else {
                console.warn('Backend unavailable, using static data only.');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-32">
            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={fetchUploads}
            />

            {/* Search Bar - Floating */}
            <div className="fixed top-24 left-0 right-0 z-40 px-4 pointer-events-none">
                <div className="max-w-2xl mx-auto pointer-events-auto flex gap-4">
                    <form onSubmit={handleSearch} className="relative group flex-1">
                        <div className="absolute inset-0 bg-[var(--neon-cyan)] rounded-full blur opacity-20 group-hover:opacity-40 transition-opacity" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search the Sonic Nexus..."
                            className="w-full bg-black/80 backdrop-blur-xl border border-white/20 rounded-full py-4 px-8 text-white placeholder-white/50 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors shadow-2xl relative z-10"
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 rounded-full hover:bg-[var(--neon-cyan)] hover:text-black transition-colors z-20">
                            <Music2 size={20} />
                        </button>
                    </form>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="h-[58px] px-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full hover:bg-[var(--neon-cyan)] hover:text-black transition-all shadow-2xl z-10 flex items-center gap-2 font-bold whitespace-nowrap"
                    >
                        <Upload size={20} /> <span className="hidden md:inline">Upload</span>
                    </button>
                </div>
            </div>

            {/* Hero Section (Hidden when searching) */}
            {!searchResults.length && !isSearching ? (
                <div className="relative h-[60vh] w-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${FEATURED_ALBUM.coverUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-6 md:p-16 max-w-4xl z-10">
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
                                        className="px-6 py-3 md:px-8 md:py-4 bg-[var(--neon-cyan)] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2 shadow-[0_0_30px_rgba(34,211,238,0.4)] text-sm md:text-base"
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
            ) : null}

            {/* Quick Categories */}
            {!searchResults.length && (
                <div className="px-4 md:px-16 py-8 md:py-12">
                    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                        {CATEGORIES.map((cat, idx) => (
                            <div key={idx} className="flex-shrink-0 px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 cursor-pointer hover:bg-white/10 hover:border-[var(--neon-cyan)] transition-all">
                                <cat.icon className="w-5 h-5 text-[var(--neon-cyan)]" />
                                <span className="font-medium whitespace-nowrap">{cat.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* My Sonic Nexus (Uploads) */}
            {!searchResults.length && (
                <div className="px-4 md:px-16 pb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <Music2 className="text-[var(--neon-cyan)]" />
                            My Sonic Nexus
                        </h2>
                    </div>
                    {myUploads.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-6">
                            {myUploads.map((track, idx) => (
                                <motion.div
                                    key={track.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="group relative bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                                >
                                    <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-black/50">
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900 group-hover:scale-110 transition-transform duration-500">
                                            <Music2 size={40} className="text-white/20" />
                                        </div>
                                        <button
                                            onClick={() => play(track)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <div className="w-12 h-12 bg-[var(--neon-cyan)] rounded-full flex items-center justify-center text-black shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                                <Play fill="currentColor" className="ml-1" />
                                            </div>
                                        </button>

                                        {/* Delete Button */}
                                        <button
                                            onClick={(e) => handleDelete(e, track.id)}
                                            disabled={deletingId === track.id}
                                            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white/70 hover:text-red-500 hover:bg-black/80 transition-colors opacity-0 group-hover:opacity-100 z-10"
                                            title="Delete Song"
                                        >
                                            {deletingId === track.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    <h3 className="font-bold text-white mb-1 truncate">{track.title}</h3>
                                    <p className="text-xs text-white/50">{track.artist}</p>
                                </motion.div>
                            ))
                            }
                        </div >
                    ) : (
                        <div
                            onClick={() => setIsUploadModalOpen(true)}
                            className="border-2 border-dashed border-zinc-800 rounded-2xl p-12 flex flex-col items-center justify-center text-zinc-500 hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/5 transition-all cursor-pointer"
                        >
                            <Upload size={48} className="mb-4" />
                            <p className="font-bold text-lg">Upload your first song</p>
                            <p className="text-sm opacity-60">Add to your lifetime library</p>
                        </div>
                    )}
                </div >
            )}

            {/* Search Results or Top Charts */}
            <div className="px-4 md:px-16 pt-0 md:pt-4">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                    {searchResults.length > 0 ? (
                        <>
                            <Radio className="text-[var(--neon-cyan)]" />
                            Search Results
                        </>
                    ) : (
                        <>
                            <TrendingUp className="text-[var(--neon-cyan)]" />
                            Top Charts
                        </>
                    )}
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-6">
                    {(searchResults.length > 0 ? searchResults : FEATURED_ALBUM.tracks).map((track, idx) => (
                        <motion.div
                            key={track.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
                        >
                            <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-black/50">
                                {track.coverUrl ? (
                                    <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                        <Music2 size={48} />
                                    </div>
                                )}
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
        </div >
    );
}
