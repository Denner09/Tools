"use client";

import React, { useState, useEffect } from 'react';
import { PDFHandler } from '../utils/pdf-handler';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileIcon, 
    LayoutGridIcon, 
    ZapIcon, 
    ScanIcon, 
    ShieldCheckIcon,
    RotateCwIcon, 
    Trash2Icon, 
    DownloadIcon, 
    PlusIcon,
    XIcon,
    ChevronLeftIcon,
    Loader2Icon,
    InfoIcon
} from 'lucide-react';

/**
 * PDF Thumbnail component with Framer Motion
 */
const PageThumbnail = ({ page, onRotate, onDelete }) => {
    const [imgData, setImgData] = useState(null);

    useEffect(() => {
        const render = async () => {
            try {
                const pdfjs = await import('pdfjs-dist/build/pdf.min.mjs');
                pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
                
                const buffer = await page.file.arrayBuffer();
                const pdf = await pdfjs.getDocument(buffer).promise;
                const pdfPage = await pdf.getPage(page.pageIndex + 1);
                
                // Optimized scale for thumbnails
                const viewport = pdfPage.getViewport({ scale: 0.3 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                
                await pdfPage.render({ canvasContext: context, viewport }).promise;
                setImgData(canvas.toDataURL('image/png'));
            } catch (e) {
                console.error("Thumbnail error:", e);
            }
        };
        render();
    }, [page.file, page.pageIndex]);

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -4 }}
            className="relative group bg-white dark:bg-gray-800 border-2 border-transparent dark:border-gray-700 hover:border-orange-500 rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
        >
            <div className="p-3 flex flex-col items-center">
                <div className="h-44 w-full flex items-center justify-center bg-gray-50 dark:bg-gray-900/40 rounded-xl overflow-hidden relative">
                    {imgData ? (
                        <motion.div 
                            animate={{ rotate: page.rotation }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="h-full w-full flex items-center justify-center p-2"
                        >
                            <img src={imgData} alt={`Pág ${page.pageIndex + 1}`} className="max-h-full max-w-full shadow-md rounded-sm" />
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2Icon className="animate-spin text-orange-500/50" />
                        </div>
                    )}
                </div>
                <div className="mt-3 px-1 w-full flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 truncate">
                        {page.fileName}
                    </span>
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Página {page.pageIndex + 1}
                    </span>
                </div>
            </div>
            
            {/* Hover Actions */}
            <div className="absolute top-2 right-2 flex flex-col gap-1.5 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                <button 
                    onClick={() => onRotate(page.id)}
                    className="p-2 bg-white/95 dark:bg-gray-800/95 hover:bg-orange-500 hover:text-white text-gray-600 dark:text-gray-400 rounded-xl shadow-lg transition-colors border border-gray-100 dark:border-gray-700"
                >
                    <RotateCwIcon size={14} />
                </button>
                <button 
                    onClick={() => onDelete(page.id)}
                    className="p-2 bg-white/95 dark:bg-gray-800/95 hover:bg-red-500 hover:text-white text-gray-600 dark:text-gray-400 rounded-xl shadow-lg transition-colors border border-gray-100 dark:border-gray-700"
                >
                    <Trash2Icon size={14} />
                </button>
            </div>
        </motion.div>
    );
};

export default function PDFToolsPage() {
    const [activeTool, setActiveTool] = useState('dashboard');
    const [pages, setPages] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const tools = [
        { id: 'multi', label: 'Multi-tool', icon: LayoutGridIcon, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', desc: 'Edite, organize e junte páginas visualmente' },
        { id: 'compress', label: 'Compressor', icon: ZapIcon, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10', desc: 'Reduza o tamanho sem perder legibilidade' },
        { id: 'ocr', label: 'OCR & Texto', icon: ScanIcon, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', desc: 'Extraia texto e torne PDFs pesquisáveis' },
        { id: 'security', label: 'Segurança', icon: ShieldCheckIcon, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', desc: 'Gerencie senhas e permissões (Em breve)' },
    ];

    const handleFileDrop = async (e) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        if (!files.length) return;
        
        setIsProcessing(true);
        
        try {
            const newPages = await PDFHandler.loadPagesFromFiles(files);
            setPages(prev => [...prev, ...newPages]);
            setActiveTool('multi');
        } catch (err) {
            console.error(err);
            alert("Erro ao carregar arquivos: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRotate = (id) => {
        setPages(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
    };

    const handleDelete = (id) => {
        setPages(prev => prev.filter(p => p.id !== id));
    };

    const handleExport = async () => {
        if (!pages.length) return;
        setIsProcessing(true);
        try {
            const pdfBytes = await PDFHandler.generatePdfFromPages(pages);
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bento_export_${Date.now()}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            alert('Erro ao exportar PDF: ' + e.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f1115] text-[#1c1f26] dark:text-[#e1e4e8] transition-colors duration-500 selection:bg-orange-500/30">
            
            {/* Premium Header */}
            <header className="w-full border-b border-gray-200/60 dark:border-gray-800/60 bg-white/70 dark:bg-[#0f1115]/70 backdrop-blur-xl sticky top-0 z-40">
                <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <motion.div 
                            whileHover={{ rotate: 5, scale: 1.05 }}
                            className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20"
                        >
                            <FileIcon className="text-white" size={20} />
                        </motion.div>
                        <div>
                            <h1 className="text-lg font-black uppercase tracking-widest leading-none">Bento<span className="text-orange-500">PDF</span></h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Professional Suite Integration</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-gray-800/50 p-1 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                        {['dashboard', 'multi', 'compress'].map(t => (
                            <button
                                key={t}
                                onClick={() => setActiveTool(t)}
                                className={clsx(
                                    "px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                                    activeTool === t 
                                        ? "bg-white dark:bg-gray-700 text-orange-500 shadow-sm" 
                                        : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {pages.length > 0 && (
                            <motion.button 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={handleExport}
                                disabled={isProcessing}
                                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-xl shadow-orange-500/20 text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
                            >
                                {isProcessing ? <Loader2Icon size={16} className="animate-spin" /> : <DownloadIcon size={16} />}
                                <span>Exportar</span>
                            </motion.button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 py-10">
                <AnimatePresence mode="wait">
                    {activeTool === 'dashboard' ? (
                        <motion.div 
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* Hero Intro */}
                            <div className="max-w-3xl">
                                <h2 className="text-5xl font-black tracking-tight mb-4">Manipule PDFs com <span className="text-orange-500">Privacidade Total.</span></h2>
                                <p className="text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                    Baseado no BentoPDF Engine, processamos tudo diretamente no seu navegador. 
                                    Sem uploads, sem servidores, apenas velocidade e segurança.
                                </p>
                            </div>

                            {/* Tool Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {tools.map(tool => (
                                    <motion.div 
                                        key={tool.id}
                                        whileHover={{ y: -8 }}
                                        onClick={() => setActiveTool(tool.id)}
                                        className="group cursor-pointer bg-white dark:bg-gray-800/40 p-8 rounded-[2rem] border border-gray-200/60 dark:border-gray-800/60 shadow-sm hover:shadow-2xl hover:bg-white dark:hover:bg-gray-800 transition-all duration-500"
                                    >
                                        <div className={clsx("w-16 h-16 rounded-3xl mb-8 flex items-center justify-center transition-transform group-hover:scale-110 duration-500", tool.bg)}>
                                            <tool.icon className={tool.color} size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black mb-3 group-hover:text-orange-500 transition-colors">{tool.label}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{tool.desc}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Dropzone */}
                            <label className="block w-full h-80 border-4 border-dashed border-gray-200 dark:border-gray-800 hover:border-orange-500/50 hover:bg-orange-50/10 dark:hover:bg-orange-500/5 rounded-[3rem] cursor-pointer transition-all duration-500 group relative overflow-hidden">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10 z-10">
                                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800/80 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                        <PlusIcon className="text-gray-400 group-hover:text-orange-500" size={40} />
                                    </div>
                                    <h4 className="text-2xl font-black mb-2 uppercase tracking-wide">Solte seus arquivos aqui</h4>
                                    <p className="text-gray-500 font-bold uppercase tracking-tighter text-sm">Ou clique para procurar documentos</p>
                                </div>
                                <input type="file" className="hidden" multiple accept=".pdf" onChange={handleFileDrop} />
                            </label>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="workspace"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="bg-white dark:bg-gray-800/40 rounded-[3rem] border border-gray-200/60 dark:border-gray-800/60 shadow-xl overflow-hidden flex flex-col min-h-[75vh]"
                        >
                            {/* Workspace Subheading */}
                            <div className="px-10 py-8 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between bg-white/50 dark:bg-gray-900/20 backdrop-blur-md">
                                <div className="flex items-center gap-6">
                                    <button 
                                        onClick={() => setActiveTool('dashboard')}
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                    >
                                        <ChevronLeftIcon size={24} />
                                    </button>
                                    <div>
                                        <h3 className="text-2xl font-black leading-none">{pages.length > 0 ? "Gerenciador de Páginas" : "Workspace Vazio"}</h3>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">BentoPDF Logic Engine v2.7</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-3 px-6 py-3 bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 text-xs font-black uppercase tracking-widest rounded-2xl cursor-pointer transition-all border border-transparent hover:border-gray-300 dark:hover:border-gray-600">
                                        <PlusIcon size={18} />
                                        <span>Adicionar Mais</span>
                                        <input type="file" className="hidden" multiple accept=".pdf" onChange={handleFileDrop} />
                                    </label>
                                </div>
                            </div>

                            {/* Grid Area */}
                            <div className="flex-grow p-10 overflow-y-auto max-h-[65vh] custom-scrollbar">
                                {pages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                                        <ScanIcon size={120} strokeWidth={1} />
                                        <p className="text-3xl font-black mt-8">Nenhuma página carregada</p>
                                    </div>
                                ) : (
                                    <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                                        {pages.map((page) => (
                                            <PageThumbnail 
                                                key={page.id} 
                                                page={page} 
                                                onRotate={handleRotate}
                                                onDelete={handleDelete}
                                            />
                                        ))}
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer Info Hub */}
                            <div className="px-10 py-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-900/50 flex items-center justify-between">
                                <div className="flex items-center gap-8">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Documento</span>
                                        <span className="text-sm font-black">{pages.length} Páginas Selecionadas</span>
                                    </div>
                                    <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                                    <button 
                                        onClick={() => setPages([])}
                                        className="text-xs font-bold uppercase tracking-widest text-[#ff4444] hover:text-[#ff0000] transition-colors"
                                    >
                                        Limpar Workspace
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 py-2 px-4 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-500">
                                    <InfoIcon size={16} />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Arraste as páginas para reordenar (Coming Soon)</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.05);
                    border-radius: 20px;
                }
                .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.05);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(234, 88, 12, 0.2);
                }
            `}</style>

        </div>
    );
}
