'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Phone, CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface QRCaptureProps {
    onScanComplete: (mockFile: File) => void;
    onCancel: () => void;
}

const QRCapture: React.FC<QRCaptureProps> = ({ onScanComplete, onCancel }) => {
    const [sessionId, setSessionId] = useState('');
    const [status, setStatus] = useState<'waiting' | 'scanned' | 'uploading' | 'complete'>('waiting');

    // Generate a mock session ID
    useEffect(() => {
        setSessionId(Math.random().toString(36).substring(7));
    }, []);

    // Simulate the "polling" mechanism
    useEffect(() => {
        if (!sessionId) return;

        // Mock timeline:
        // 5s -> Scanned
        // 8s -> Uploading from phone
        // 10s -> Complete

        const scanTimer = setTimeout(() => setStatus('scanned'), 5000);
        const uploadTimer = setTimeout(() => setStatus('uploading'), 8000);
        const completeTimer = setTimeout(() => {
            setStatus('complete');
            // Mock a file return
            const mockFile = new File(["mock-content"], "mobile_upload.jpg", { type: "image/jpeg" });
            // Delay callback slightly to show complete state
            setTimeout(() => onScanComplete(mockFile), 1000);
        }, 11000);

        return () => {
            clearTimeout(scanTimer);
            clearTimeout(uploadTimer);
            clearTimeout(completeTimer);
        };
    }, [sessionId, onScanComplete]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl text-center">
                {status === 'waiting' && (
                    <>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Scan with Mobile</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Scan this QR code to open the camera on your phone.
                        </p>

                        <div className="flex justify-center mb-6">
                            <div className="p-4 bg-white border-2 border-gray-100 rounded-xl shadow-sm">
                                <QRCodeSVG value={`https://example.com/upload/${sessionId}`} size={200} />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600 animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Waiting for connection...
                        </div>
                    </>
                )}

                {status === 'scanned' && (
                    <div className="py-10">
                        <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                            <Phone className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Connected!</h3>
                        <p className="text-gray-500 mt-2">Please take the photo on your device.</p>
                    </div>
                )}

                {status === 'uploading' && (
                    <div className="py-10">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Uploading...</h3>
                        <p className="text-gray-500 mt-2">Transferring image from mobile.</p>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="py-10">
                        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Success!</h3>
                        <p className="text-gray-500 mt-2">Image received.</p>
                    </div>
                )}

                <button
                    onClick={onCancel}
                    className="mt-6 text-sm text-gray-400 hover:text-gray-600 underline"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default QRCapture;
