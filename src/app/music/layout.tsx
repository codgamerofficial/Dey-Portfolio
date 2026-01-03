import MusicPlayer from '@/components/music/MusicPlayer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sonic Nexus | Premium Music Streaming',
    description: 'Exclusive high-fidelity music streaming platform.',
};

export default function MusicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen bg-black selection:bg-[var(--neon-cyan)] selection:text-black">
            {children}
            <MusicPlayer />
        </div>
    );
}
