'use client';

import React, { useRef, useCallback, useState } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, X } from 'lucide-react';

interface WebcamCaptureProps {
    onCapture: (imageSrc: string) => void;
    onClose: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onClose }) => {
    const webcamRef = useRef<Webcam>(null);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc) {
            onCapture(imageSrc);
        }
    }, [webcamRef, onCapture]);

    const toggleCamera = () => {
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-lg overflow-hidden rounded-xl bg-gray-900 border border-gray-700 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between bg-gray-800 px-4 py-3 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-400" />
                        Take Photo
                    </h3>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Webcam View */}
                <div className="relative aspect-[4/3] bg-black">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            facingMode: facingMode,
                            width: 1280,
                            height: 720,
                        }}
                        className="h-full w-full object-cover"
                    />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 bg-gray-800 p-6">
                    <button
                        onClick={toggleCamera}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                        title="Switch Camera"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>

                    <button
                        onClick={capture}
                        className="flex h-16 w-16 items-center justify-center rounded-full bg-white border-4 border-gray-300 hover:border-blue-500 hover:scale-105 active:scale-95 transition-all shadow-lg"
                        title="Capture"
                    >
                        <div className="h-12 w-12 rounded-full bg-blue-600"></div>
                    </button>

                    {/* Spacer for centering */}
                    <div className="w-12"></div>
                </div>
            </div>
        </div>
    );
};

export default WebcamCapture;
