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

    // New State
    shuffle: boolean;
    repeat: 'off' | 'all' | 'one';
    isMuted: boolean;
    previousVolume: number;

    // Actions
    play: (track?: Track) => void;
    pause: () => void;
    setVolume: (vol: number) => void;
    toggleMute: () => void;
    addToQueue: (track: Track) => void;
    removeFromQueue: (id: string) => void;
    playNext: () => void;
    playPrev: () => void;
    setCurrentTime: (time: number) => void;
    setQueue: (tracks: Track[]) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
}

export const useMusicStore = create<MusicStore>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    queue: [],
    volume: 0.8,
    currentTime: 0,

    shuffle: false,
    repeat: 'off',
    isMuted: false,
    previousVolume: 0.8,

    play: (track) => {
        if (track) {
            set({ currentTrack: track, isPlaying: true });
        } else if (get().currentTrack) {
            set({ isPlaying: true });
        }
    },

    pause: () => set({ isPlaying: false }),

    setVolume: (vol) => {
        set({ volume: vol, isMuted: vol === 0 });
    },

    toggleMute: () => {
        const { isMuted, volume, previousVolume } = get();
        if (isMuted) {
            set({ isMuted: false, volume: previousVolume || 0.5 });
        } else {
            set({ isMuted: true, previousVolume: volume, volume: 0 });
        }
    },

    addToQueue: (track) => set((state) => ({ queue: [...state.queue, track] })),

    removeFromQueue: (id) => set((state) => ({ queue: state.queue.filter(t => t.id !== id) })),

    setQueue: (tracks) => set({ queue: tracks }),

    toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),

    toggleRepeat: () => set((state) => {
        const modes: ('off' | 'all' | 'one')[] = ['off', 'all', 'one'];
        const nextIndex = (modes.indexOf(state.repeat) + 1) % modes.length;
        return { repeat: modes[nextIndex] };
    }),

    playNext: () => {
        const { queue, currentTrack, shuffle, repeat } = get();
        if (!currentTrack || queue.length === 0) return;

        // Repeat One Logic
        if (repeat === 'one') {
            // Just seek to 0 (handled by player component usually, but here we re-set track to trigger effects)
            // Ideally player detects end and seeks 0. But if manually clicked "Next", usually skip "Repeat One"?
            // Standard behavior: Manual Next skips "Repeat One". Auto-end obeys "Repeat One".
            // Implementation: We'll assume this is called manually or by auto-end. 
            // For simplicity, let's treat manual "Next" as skipping repeat-one behavior.
            // But we can't distinguish caller here easily.
            // Let's implement standard "Queue" logic.
        }

        const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
        let nextIndex = -1;

        if (shuffle) {
            // Random index that isn't current (unless only 1 track)
            if (queue.length > 1) {
                do {
                    nextIndex = Math.floor(Math.random() * queue.length);
                } while (nextIndex === currentIndex);
            } else {
                nextIndex = 0;
            }
        } else {
            if (currentIndex < queue.length - 1) {
                nextIndex = currentIndex + 1;
            } else if (repeat === 'all') {
                nextIndex = 0; // Loop back
            }
        }

        if (nextIndex !== -1) {
            set({ currentTrack: queue[nextIndex], isPlaying: true });
        } else {
            set({ isPlaying: false });
        }
    },

    playPrev: () => {
        const { queue, currentTrack, shuffle } = get();
        if (!currentTrack) return;

        // If shuffle is on, "Prev" usually goes to history. 
        // We don't track history yet. Simple fallback: Random or Previous index.
        // Let's stick to Index logic for now.

        const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
        if (currentIndex > 0) {
            set({ currentTrack: queue[currentIndex - 1], isPlaying: true });
        } else {
            // Restart current song logic usually handled by Player if > 3s
            // Here just loop back to end if we want? Or stop.
            // Standard: Stop at 0.
        }
    },

    setCurrentTime: (time) => set({ currentTime: time }),
}));
