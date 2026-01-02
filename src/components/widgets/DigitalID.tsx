'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DigitalID() {
    const [activeCard, setActiveCard] = useState<'btech' | 'diploma'>('btech');
    const [flipped, setFlipped] = useState(false);

    return (
        <div className="perspective-1000 w-full max-w-md mx-auto h-[300px] relative group">

            {/* Card Switcher Controls */}
            <div className="absolute -top-12 left-0 right-0 flex justify-center gap-4 z-20">
                <button
                    onClick={() => setActiveCard('btech')}
                    className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest border transition-all ${activeCard === 'btech' ? 'bg-[var(--neon-blue)] text-black border-[var(--neon-blue)]' : 'text-white/50 border-white/10 hover:border-white/30'}`}
                >
                    B.TECH
                </button>
                <button
                    onClick={() => setActiveCard('diploma')}
                    className={`px-4 py-1 rounded-full text-xs font-bold tracking-widest border transition-all ${activeCard === 'diploma' ? 'bg-[var(--neon-purple)] text-white border-[var(--neon-purple)]' : 'text-white/50 border-white/10 hover:border-white/30'}`}
                >
                    DIPLOMA
                </button>
            </div>

            {/* 3D Floating Container */}
            <motion.div
                className="w-full h-full relative preserve-3d transition-all duration-700"
                style={{ transformStyle: 'preserve-3d' }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: flipped ? 180 : 0 }}
                onClick={() => setFlipped(!flipped)}
            >
                {/* ID CARD VISUAL (Front) */}
                <div className="absolute inset-0 backface-hidden">
                    <div className={`
                        w-full h-full rounded-2xl overflow-hidden border-[3px] bg-black relative shadow-[0_0_40px_rgba(0,0,0,0.5)]
                        ${activeCard === 'btech' ? 'border-[var(--neon-blue)]' : 'border-[var(--neon-purple)]'}
                    `}>
                        {/* Holographic Overlay */}
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-20 pointer-events-none mix-blend-screen" />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent z-20 pointer-events-none" />

                        {/* Scan Line Animation */}
                        <motion.div
                            className={`absolute w-full h-1 z-30 opacity-50 ${activeCard === 'btech' ? 'bg-cyan-400' : 'bg-purple-500'}`}
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        />

                        {/* Image Container */}
                        <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
                            {/* Placeholder for user images */}
                            <img
                                src={activeCard === 'btech' ? '/id-btech.jpg' : '/id-diploma.jpg'}
                                alt="ID Card"
                                className="w-full h-full object-contain"
                            />

                            {/* Fallback Text if image missing */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 bg-black/80 transition-opacity z-10 text-center p-4">
                                <p className="text-white text-xs font-mono">
                                    VERIFIED CREDENTIAL<br />
                                    <span className={activeCard === 'btech' ? 'text-cyan-400' : 'text-purple-400'}>
                                        {activeCard === 'btech' ? 'KIIT UNIVERSITY' : 'KIIT POLYTECHNIC'}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white/20 rounded-tl-xl z-20" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white/20 rounded-br-xl z-20" />
                    </div>
                </div>

                {/* Back of Card (Data Matrix) */}
                <div
                    className="absolute inset-0 backface-hidden bg-black rounded-2xl border border-white/10 p-6 flex flex-col justify-center items-center"
                    style={{ transform: 'rotateY(180deg)' }}
                >
                    <div className="text-center space-y-4 font-mono">
                        <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <span className="text-3xl">🎓</span>
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg">SASWATA DEY</h3>
                            <p className="text-[var(--text-tertiary)] text-xs tracking-widest">{activeCard === 'btech' ? 'B.TECH (CSE)' : 'DIPLOMA (CSE)'}</p>
                        </div>
                        <div className="text-xs text-white/50 space-y-1">
                            <p>ID: {activeCard === 'btech' ? '22057084' : '1910546'}</p>
                            <p>INSTITUTE: KIIT</p>
                            <p>STATUS: VERIFIED</p>
                        </div>
                    </div>
                </div>

            </motion.div>
        </div>
    );
}
