import { create } from 'zustand';

export interface Track {
    id: string;
    title: string;
    artist: string;
    album: string;
    coverUrl: string;
    audioUrl: string;
    duration: number;
    source: 'AUDIUS' | 'YOUTUBE' | 'INDIE';
}

interface MusicStore {
    currentTrack: Track | null;
    isPlaying: boolean;
    queue: Track[];
    volume: number;
    currentTime: number;

    // Actions
    play: (track?: Track) => void;
    pause: () => void;
    setVolume: (vol: number) => void;
    addToQueue: (track: Track) => void;
    playNext: () => void;
    playPrev: () => void;
    setCurrentTime: (time: number) => void;
    setQueue: (tracks: Track[]) => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    volume: 0.8,
    currentTime: 0,

    play: (track) => {
        if (track) {
            set({ currentTrack: track, isPlaying: true });
        } else if (get().currentTrack) {
            set({ isPlaying: true });
        }
    },

    pause: () => set({ isPlaying: false }),

    setVolume: (vol) => set({ volume: vol }),

    addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),

    setQueue: (tracks) => set({ queue: tracks }),

    playNext: () => {
        const { queue, currentTrack } = get();
        if (!currentTrack) return;

        const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
        if (currentIndex < queue.length - 1) {
            set({ currentTrack: queue[currentIndex + 1], isPlaying: true });
        } else {
            // Loop or stop
            set({ isPlaying: false });
        }
    },

    playPrev: () => {
        const { queue, currentTrack } = get();
        if (!currentTrack) return;

        const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
        if (currentIndex > 0) {
            set({ currentTrack: queue[currentIndex - 1], isPlaying: true });
        }
    },

    setCurrentTime: (time) => set({ currentTime: time }),
}));
