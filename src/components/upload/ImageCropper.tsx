'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Point, Area } from 'react-easy-crop/types';
import { Check, X, ZoomIn, ZoomOut } from 'lucide-react';
import { getCroppedImg } from '@/lib/upload-utils/cropImageHelper';

interface ImageCropperProps {
    imageSrc: string;
    aspectRatio: number;
    targetWidth?: number;
    targetHeight?: number;
    onCropComplete: (croppedBlob: Blob) => void;
    onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
    imageSrc,
    aspectRatio,
    targetWidth,
    targetHeight,
    onCropComplete,
    onCancel,
}) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [grayscale, setGrayscale] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

    const onCropChange = (crop: Point) => {
        setCrop(crop);
    };

    const onZoomChange = (zoom: number) => {
        setZoom(zoom);
    };

    const onCropCompleteCallback = useCallback(
        (croppedArea: Area, croppedAreaPixels: Area) => {
            setCroppedAreaPixels(croppedAreaPixels);
        },
        []
    );

    const handleConfirm = async () => {
        if (croppedAreaPixels) {
            try {
                const croppedImage = await getCroppedImg(
                    imageSrc,
                    croppedAreaPixels,
                    grayscale,
                    targetWidth,
                    targetHeight
                );
                if (croppedImage) {
                    onCropComplete(croppedImage);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
            <div className="flex w-full max-w-2xl flex-col rounded-xl bg-gray-900 border border-gray-700 shadow-2xl h-[80vh]">
                {/* Header */}
                <div className="flex items-center justify-between bg-gray-800 px-6 py-4 border-b border-gray-700">
                    <h3 className="text-lg font-semibold text-white">Adjust Image</h3>
                    <button onClick={onCancel} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative flex-1 bg-black overflow-hidden">
                    <div className={grayscale ? "grayscale contrast-125 brightness-110 h-full" : "h-full"}>
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={onCropChange}
                            onCropComplete={onCropCompleteCallback}
                            onZoomChange={onZoomChange}
                            showGrid={true}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col gap-4 bg-gray-800 px-6 py-4 border-t border-gray-700">
                    {/* Zoom Slider */}
                    <div className="flex items-center gap-4">
                        <ZoomOut className="w-5 h-5 text-gray-400" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <ZoomIn className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Scanner Filter Toggle */}
                    <div className="flex items-center gap-2">
                        <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={grayscale}
                                onChange={(e) => setGrayscale(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-500 bg-gray-700 text-blue-600 focus:ring-blue-500 ring-offset-gray-800"
                            />
                            Apply Document Scanner Filter (B&W)
                        </label>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20"
                        >
                            <Check className="w-4 h-4" />
                            Crop & Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCropper;
