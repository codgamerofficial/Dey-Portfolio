'use client';

import { useEffect, useState } from 'react';

export default function SeasonalEffects() {
    const [isWinter, setIsWinter] = useState(false);

    useEffect(() => {
        const now = new Date();
        const month = now.getMonth(); // 0 = Jan, 11 = Dec
        // Active during Dec (11), Jan (0), Feb (1)
        if (month === 11 || month === 0 || month === 1) {
            setIsWinter(true);
        }
    }, []);

    if (!isWinter) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
            {/* CSS Snowfall Layer */}
            <div className="snow-layer" />
            <style jsx global>{`
                .snow-layer {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.9), transparent),
                        radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.6), transparent),
                        radial-gradient(2px 2px at 50px 160px, rgba(255,255,255,0.7), transparent),
                        radial-gradient(2px 2px at 90px 40px, rgba(255,255,255,0.8), transparent);
                    background-size: 200px 300px;
                    animation: snow 8s linear infinite;
                }

                .snow-layer::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-image: 
                        radial-gradient(3px 3px at 100px 50px, rgba(0,242,234,0.4), transparent), /* Cyber Cyan Snow */
                        radial-gradient(3px 3px at 200px 150px, rgba(255,255,255,0.5), transparent),
                        radial-gradient(2px 2px at 300px 250px, rgba(255,255,255,0.6), transparent);
                    background-size: 400px 400px;
                    animation: snow 12s linear infinite reverse;
                }

                @keyframes snow {
                    0% {
                        background-position: 0px 0px;
                    }
                    100% {
                        background-position: 50px 600px;
                    }
                }
            `}</style>
        </div>
    );
}
