
import React, { useState, useRef } from 'react';
import { Upload, X, Music, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUploadSuccess: () => void;
}

export default function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            // Auto-fill title with filename (minus extension) if empty
            if (!title) {
                setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file.');
            return;
        }

        setIsUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('artist', artist);

        try {
            const res = await fetch('http://localhost:4000/music/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            onUploadSuccess();
            onClose();
            // Reset form
            setTitle('');
            setArtist('');
            setFile(null);
        } catch (err: any) {
            console.error(err);
            setError(`Upload failed: ${err.message || 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
                    >
                        {/* Background Gradient */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--neon-cyan)] to-purple-500" />

                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Upload className="text-[var(--neon-cyan)]" size={24} />
                                Upload to Sonic Nexus
                            </h2>
                            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* File Input */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${file ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/5' : 'border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <>
                                        <Music className="text-[var(--neon-cyan)] mb-2" size={32} />
                                        <p className="text-sm font-medium text-white text-center break-all">{file.name}</p>
                                        <p className="text-xs text-zinc-400 mt-1">Click to change</p>
                                    </>
                                ) : (
                                    <>
                                        <Upload className="text-zinc-500 mb-2" size={32} />
                                        <p className="text-sm font-medium text-zinc-300">Click to select song</p>
                                        <p className="text-xs text-zinc-500 mt-1">MP3, ID3, WAV supported</p>
                                    </>
                                )}
                            </div>

                            {/* Metadata Inputs */}
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Track Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Midnight City"
                                    className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1">Artist Name</label>
                                <input
                                    type="text"
                                    value={artist}
                                    onChange={(e) => setArtist(e.target.value)}
                                    placeholder="e.g. M83"
                                    className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--neon-cyan)] transition-colors"
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={isUploading || !file}
                                className="w-full bg-[var(--neon-cyan)] text-black font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Uploading...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} /> Confirm Upload
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
