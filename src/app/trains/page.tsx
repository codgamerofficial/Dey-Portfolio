'use client';

import TrainTracker from '@/components/widgets/TrainTracker';

export default function TrainsPage() {
    return (
        <main className="min-h-screen bg-black pt-20 relative overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none" />

            <div className="max-w-[1920px] mx-auto h-[calc(100vh-80px)]">
                <TrainTracker />
            </div>
        </main>
    );
}
