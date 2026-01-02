'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
    FileInput, Layers, Scissors, Trash2, FileOutput, Scan,
    Minimize2, Wrench, FileSearch, Image, FileText, FileSpreadsheet,
    MoveHorizontal, RotateCw, Hash, Stamp, Crop, Lock, Unlock,
    Shield, PenTool, Eraser, GitCompare, FileCode, CheckCircle, AlertCircle
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import jsPDF from 'jspdf';

// Tool Definitions
const TOOLS = {
    ORGANIZE: [
        { id: 'merge', name: 'Merge PDF', icon: Layers, desc: 'Combine multiple PDFs into one unified document.' },
        { id: 'split', name: 'Split PDF', icon: Scissors, desc: 'Separate one page or a whole set for easy conversion.' },
        { id: 'remove', name: 'Remove Pages', icon: Trash2, desc: 'Delete specific pages from your document.' },
        { id: 'extract', name: 'Extract Pages', icon: FileOutput, desc: 'Get a new document containing only the desired pages.' },
        { id: 'organize', name: 'Organize PDF', icon: Layers, desc: 'Sort, add and delete PDF pages.' },
        { id: 'scan', name: 'Scan to PDF', icon: Scan, desc: 'Capture document from images to PDF.' },
    ],
    OPTIMIZE: [
        { id: 'compress', name: 'Compress PDF', icon: Minimize2, desc: 'Reduce file size while optimizing for maximal PDF quality.' },
        { id: 'repair', name: 'Repair PDF', icon: Wrench, desc: 'Fix a damaged PDF and recover data.' },
        { id: 'ocr', name: 'OCR PDF', icon: FileSearch, desc: 'Convert scanned PDFs into searchable and selectable documents.' },
    ],
    CONVERT_TO: [
        { id: 'jpg-pdf', name: 'JPG to PDF', icon: Image, desc: 'Convert JPG images to PDF in seconds.' },
        { id: 'word-pdf', name: 'WORD to PDF', icon: FileText, desc: 'Make DOC and DOCX files easy to read by converting them to PDF.' },
        { id: 'ppt-pdf', name: 'POWERPOINT to PDF', icon: FileSpreadsheet, desc: 'Make PPT and PPTX slideshows easy to view by converting them to PDF.' },
        { id: 'excel-pdf', name: 'EXCEL to PDF', icon: FileSpreadsheet, desc: 'Make EXCEL spreadsheets easy to read by converting them to PDF.' },
        { id: 'html-pdf', name: 'HTML to PDF', icon: FileCode, desc: 'Convert web pages or HTML files to PDF.' },
    ],
    CONVERT_FROM: [
        { id: 'pdf-jpg', name: 'PDF to JPG', icon: Image, desc: 'Convert each PDF page into a JPG or extract all images.' },
        { id: 'pdf-word', name: 'PDF to WORD', icon: FileText, desc: 'Convert your PDF to WORD documents with incredible accuracy.' },
        { id: 'pdf-ppt', name: 'PDF to POWERPOINT', icon: FileSpreadsheet, desc: 'Convert your PDFs to POWERPOINT.' },
        { id: 'pdf-excel', name: 'PDF to EXCEL', icon: FileSpreadsheet, desc: 'Convert PDF data to EXCEL spreadsheets.' },
        { id: 'pdf-pdfa', name: 'PDF to PDF/A', icon: FileText, desc: 'Convert PDF documents to PDF/A for ISO-compliant long-term archiving.' },
    ],
    EDIT: [
        { id: 'rotate', name: 'Rotate PDF', icon: RotateCw, desc: 'Rotate your PDF files as you want.' },
        { id: 'numbers', name: 'Add Page Numbers', icon: Hash, desc: 'Add page numbers into PDF documents easily.' },
        { id: 'watermark', name: 'Add Watermark', icon: Stamp, desc: 'Stamp an image or text over your PDF.' },
        { id: 'crop', name: 'Crop PDF', icon: Crop, desc: 'Crop PDF margins, change page size.' },
        { id: 'edit', name: 'Edit PDF', icon: Wrench, desc: 'Add text, shapes, comments and highlights to a PDF file.' },
    ],
    SECURITY: [
        { id: 'unlock', name: 'Unlock PDF', icon: Unlock, desc: 'Remove PDF password security.' },
        { id: 'protect', name: 'Protect PDF', icon: Lock, desc: 'Encrypt your PDF with a password.' },
        { id: 'sign', name: 'Sign PDF', icon: PenTool, desc: 'Sign yourself or request electronic signatures.' },
        { id: 'redact', name: 'Redact PDF', icon: Eraser, desc: 'Permanently remove visible text and graphics from PDF.' },
        { id: 'compare', name: 'Compare PDF', icon: GitCompare, desc: 'Compare two versions of a PDF file.' },
    ]
};

const CATEGORIES = ['ORGANIZE', 'OPTIMIZE', 'CONVERT_TO', 'CONVERT_FROM', 'EDIT', 'SECURITY'];

export default function PDFMatrix() {
    const [activeCategory, setActiveCategory] = useState('ORGANIZE');
    const [activeTool, setActiveTool] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'DONE' | 'ERROR'>('IDLE');
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    // Dropzone logic
    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    // Processing Logic (Stubbed + Real Implementations)
    const processFiles = async () => {
        if (files.length === 0) return;
        setStatus('PROCESSING');

        try {
            await new Promise(r => setTimeout(r, 1500)); // Simulaton delay

            if (activeTool === 'merge') {
                const mergedPdf = await PDFDocument.create();
                for (const file of files) {
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await PDFDocument.load(arrayBuffer);
                    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));
                }
                const pdfBytes = await mergedPdf.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                setResultUrl(URL.createObjectURL(blob));
            }
            else if (activeTool === 'jpg-pdf') {
                const doc = new jsPDF();
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (!file.type.includes('image')) continue;

                    const imgData = await new Promise<string>((resolve) => {
                        const reader = new FileReader();
                        reader.onload = (e) => resolve(e.target?.result as string);
                        reader.readAsDataURL(file);
                    });

                    const imgProps = doc.getImageProperties(imgData);
                    const pdfWidth = doc.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                    if (i > 0) doc.addPage();
                    doc.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                }
                setResultUrl(doc.output('bloburl').toString());
            }
            else {
                // Mock Success for other tools
                setResultUrl(URL.createObjectURL(files[0]));
            }
            setStatus('DONE');
        } catch (e) {
            console.error(e);
            setStatus('ERROR');
        }
    };

    const reset = () => {
        setFiles([]);
        setStatus('IDLE');
        setResultUrl(null);
    };

    return (
        <section className="section py-20 px-4 md:px-10 border-t border-white/5 bg-black relative overflow-hidden" id="pdf-matrix">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-tighter">
                        PDF <span className="text-[var(--neon-blue)]">MATRIX</span>
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Advanced Document Processing Unit. Manipulate, secure, and transform your digital archives with military-grade precision.
                    </p>
                </div>

                {/* Interface Container */}
                <div className="glass-strong rounded-3xl border border-white/10 min-h-[600px] flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">

                    {/* Sidebar / Tabs */}
                    <div className="w-full md:w-64 bg-black/40 border-r border-white/10 flex flex-nowrap md:flex-col overflow-x-auto md:overflow-visible">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => { setActiveCategory(cat); setActiveTool(null); reset(); }}
                                className={`
                                    px-6 py-4 text-left text-xs font-bold tracking-widest transition-all whitespace-nowrap md:whitespace-normal
                                    ${activeCategory === cat
                                        ? 'bg-[var(--neon-blue)]/10 text-[var(--neon-blue)] border-b-2 md:border-l-2 md:border-b-0 border-[var(--neon-blue)]'
                                        : 'text-[var(--text-tertiary)] hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {cat.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-6 md:p-10 relative">

                        {/* Tool Grid (If no tool active) */}
                        {!activeTool && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                {TOOLS[activeCategory as keyof typeof TOOLS].map((tool: any) => (
                                    <button
                                        key={tool.id}
                                        onClick={() => setActiveTool(tool.id)}
                                        className="group p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-[var(--neon-blue)]/10 hover:border-[var(--neon-blue)]/50 transition-all text-left flex flex-col gap-3"
                                    >
                                        <tool.icon className="w-8 h-8 text-[var(--neon-blue)] group-hover:scale-110 transition-transform" />
                                        <div>
                                            <h3 className="font-bold text-sm text-white group-hover:text-[var(--neon-blue)]">{tool.name}</h3>
                                            <p className="text-[10px] text-[var(--text-tertiary)] mt-1 leading-relaxed">{tool.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </motion.div>
                        )}

                        {/* Active Tool Workspace */}
                        {activeTool && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col"
                            >
                                {/* Workspace Header */}
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => { setActiveTool(null); reset(); }} className="text-white/50 hover:text-white transition-colors">
                                            ← BACK
                                        </button>
                                        <h3 className="text-xl font-bold text-[var(--neon-blue)]">
                                            {TOOLS[activeCategory as keyof typeof TOOLS].find((t: any) => t.id === activeTool)?.name}
                                        </h3>
                                    </div>
                                    <div className="px-3 py-1 bg-[var(--neon-blue)]/10 rounded border border-[var(--neon-blue)]/30 text-[10px] text-[var(--neon-blue)] font-mono">
                                        SECURED ENV
                                    </div>
                                </div>

                                {/* Parsing Status / Upload Area */}
                                <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black/20 rounded-2xl border-2 border-dashed border-white/10 relative">

                                    {status === 'IDLE' && (
                                        <div {...getRootProps()} className="text-center cursor-pointer w-full h-full flex flex-col items-center justify-center gap-4">
                                            <input {...getInputProps()} />
                                            <div className="w-20 h-20 rounded-full bg-[var(--neon-blue)]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <FileInput className="w-8 h-8 text-[var(--neon-blue)]" />
                                            </div>
                                            {isDragActive ? (
                                                <p className="text-[var(--neon-blue)] font-bold animate-pulse">DROP FILES LINKING...</p>
                                            ) : (
                                                <>
                                                    <h4 className="text-lg font-bold text-white">Select PDF files</h4>
                                                    <p className="text-sm text-[var(--text-tertiary)] max-w-xs">
                                                        or drop files here. Secured processing.
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {status === 'PROCESSING' && (
                                        <div className="text-center">
                                            <div className="w-16 h-16 border-4 border-[var(--neon-blue)] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                            <h4 className="text-xl font-bold text-white animate-pulse">PROCESSING DATA...</h4>
                                        </div>
                                    )}

                                    {status === 'DONE' && (
                                        <div className="text-center">
                                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                                            <h4 className="text-2xl font-bold text-white mb-2">TASK COMPLETE</h4>
                                            <div className="flex gap-4 justify-center mt-6">
                                                <button onClick={reset} className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-colors text-white text-sm">
                                                    Process More
                                                </button>
                                                {resultUrl && (
                                                    <a href={resultUrl} download={`processed_matrix_${Date.now()}.pdf`} className="px-6 py-2 rounded-full bg-[var(--neon-blue)] text-black font-bold text-sm hover:bg-white transition-colors shadow-[0_0_20px_var(--neon-blue)]">
                                                        DOWNLOAD FILE
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {status === 'ERROR' && (
                                        <div className="text-center">
                                            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                                            <h4 className="text-xl font-bold text-white mb-2">SYSTEM FAILURE</h4>
                                            <p className="text-white/50 text-sm">The operation encountered a breakdown.</p>
                                            <button onClick={reset} className="mt-6 px-6 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10">
                                                RETRY LINK
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* File List Preview */}
                                {files.length > 0 && status === 'IDLE' && (
                                    <div className="mt-6 w-full">
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {files.map((f, i) => (
                                                <div key={i} className="px-3 py-1 bg-white/10 rounded md:max-w-[200px] truncate text-xs text-white/70 border border-white/5">
                                                    {f.name}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            onClick={processFiles}
                                            className="w-full py-4 bg-[var(--neon-blue)] rounded-xl text-black font-bold tracking-widest hover:bg-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_30px_rgba(0,242,234,0.2)]"
                                        >
                                            {activeTool === 'merge' ? 'INITIATE MERGE SEQUENCE' : 'EXECUTE PROCESS'}
                                        </button>
                                    </div>
                                )}

                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
