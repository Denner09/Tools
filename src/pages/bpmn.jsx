import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import BpmnModelerLib from 'bpmn-js/dist/bpmn-modeler.production.min.js';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import CustomPaletteProvider from '../components/bpmn/modules/CustomPaletteProvider';
import Navbar from '../components/layout/Navbar';
import { applyBpmnTheme } from '../components/bpmn/BpmnTheme';

const initialDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn:process id="Process_1" isExecutable="false">
    </bpmn:process>
    <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
    </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn:definitions>`;

const BPMNPage = () => {
    const containerRef = useRef(null);
    const modelerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [notification, setNotification] = useState('');
    const { theme } = useTheme();

    // State hoisted for Auto-Save access
    const [filename, setFilename] = useState('diagrama');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hasChangesRef = useRef(false);

    useEffect(() => {
        if (!modelerRef.current && containerRef.current) {
            // Intialize BPMN Modeler
            modelerRef.current = new BpmnModelerLib({
                container: containerRef.current,
                additionalModules: [{
                    // Disable default zoom scroll to prevent accidental zooming while scrolling page
                    zoomScroll: ['value', {
                        toggle: function() {}, 
                        scroll: function() {}  
                    }]
                },
                {
                    __init__: ['customPaletteProvider'],
                    customPaletteProvider: ['type', CustomPaletteProvider]
                }]
            });

            const modeler = modelerRef.current;

            // Hook for applying custom CSS classes (Legacy Dark Mode Support)
            applyBpmnTheme(modeler);

            // Auto-Save: Detect Changes
            modeler.on('commandStack.changed', () => {
                hasChangesRef.current = true;
            });

            // Load Draft or Default
            const savedDraft = localStorage.getItem('bpmnDraft');
            const savedFilename = localStorage.getItem('bpmnFilename');
            if (savedDraft) {
                openDiagram(savedDraft);
                if (savedFilename) setFilename(savedFilename);
                showNotify('Rascunho automático recuperado.');
            } else {
                openDiagram(initialDiagram);
            }
        }

        return () => {
            if (modelerRef.current) {
                modelerRef.current.destroy();
                modelerRef.current = null;
            }
        };
    }, []);

    // Auto-Save Interval (Every 60s)
    useEffect(() => {
        const interval = setInterval(async () => {
            if (modelerRef.current && hasChangesRef.current) {
                try {
                    const { xml } = await modelerRef.current.saveXML({ format: true });
                    localStorage.setItem('bpmnDraft', xml);
                    localStorage.setItem('bpmnFilename', filename);
                    hasChangesRef.current = false;
                    showNotify('Rascunho salvo automaticamente.');
                } catch (e) {
                    console.error(e);
                }
            }
        }, 60000);
        return () => clearInterval(interval);
    }, [filename]);

    const openDiagram = async (xml) => {
        try {
            await modelerRef.current.importXML(xml);
            const canvas = modelerRef.current.get('canvas');
            canvas.zoom('fit-viewport');
        } catch (err) {
            console.error(err);
            showNotify('Erro ao carregar diagrama.');
        }
    };

    const showNotify = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 3000);
    };

    const createNewDiagram = () => {
        if(confirm('Tem certeza que deseja criar um novo diagrama? O rascunho atual será apagado.')) {
            // Clear Cache
            localStorage.removeItem('bpmnDraft');
            localStorage.removeItem('bpmnFilename');
            hasChangesRef.current = false;
            
            openDiagram(initialDiagram);
            setFilename('diagrama');
            showNotify('Novo diagrama criado (Cache limpo).');
        }
    };



    // State for Dropdown and Filename (Moved to top)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

    const handleAction = (action) => {
        setDropdownOpen(false);
        action();
    };

    const handleFileLoad = (e) => {
        const file = e.target.files[0];
        if (file) {
            const name = file.name.replace(/\.[^/.]+$/, "");
            setFilename(name);
            
            const reader = new FileReader();
            reader.onload = (e) => {
                openDiagram(e.target.result);
                showNotify('Diagrama carregado com sucesso!');
            };
            reader.readAsText(file);
        }
    };

    const saveXML = async () => {
        try {
            const { xml } = await modelerRef.current.saveXML({ format: true });
            const blob = new Blob([xml], { type: 'application/xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.bpmn`;
            a.click();
            window.URL.revokeObjectURL(url);
            showNotify('Diagrama salvo (XML)!');
        } catch (err) {
            console.error(err);
            showNotify('Erro ao salvar XML.');
        }
    };

    const saveSVG = async () => {
        try {
            const { svg } = await modelerRef.current.saveSVG();
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${filename}.svg`;
            a.click();
            window.URL.revokeObjectURL(url);
            showNotify('Imagem salva (SVG)!');
        } catch (err) {
            console.error(err);
            showNotify('Erro ao salvar SVG.');
        }
    };

    const savePNG = async () => {
        try {
            const { svg } = await modelerRef.current.saveSVG();
            
            const image = new Image();
            const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            image.onload = () => {
                const canvas = document.createElement('canvas');
                // Set canvas size to image size
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                
                // Draw image (transparent background)
                ctx.drawImage(image, 0, 0);
                
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = `${filename}.png`;
                a.click();
                
                URL.revokeObjectURL(url);
                showNotify('Imagem salva (PNG)!');
            };
            image.src = url;
            
        } catch (err) {
            console.error(err);
            showNotify('Erro ao salvar PNG.');
        }
    };

    const savePDF = async () => {
        try {
            const { jsPDF } = await import('jspdf');
            const { svg } = await modelerRef.current.saveSVG();
            
            const image = new Image();
            const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);
            
            image.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                
                // PDF usually looks better with a white background than transparent black
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.drawImage(image, 0, 0);
                const imgData = canvas.toDataURL('image/png');
                
                const pdf = new jsPDF({
                    orientation: image.width > image.height ? 'landscape' : 'portrait',
                });
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (image.height * pdfWidth) / image.width;
                
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${filename}.pdf`);
                
                URL.revokeObjectURL(url);
                showNotify('Documento salvo (PDF)!');
            };
            image.src = url;

        } catch (err) {
            console.error(err);
            showNotify('Erro ao salvar PDF.');
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-[#121212]">
            {/* Custom Navbar for BPMN Page - Matching AppNavbar Layout exactly */}
            {/* Custom Navbar using Layout Component */}
            <Navbar 
                centerContent={
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-[#333] hover:border-gray-200 dark:hover:border-gray-600 transition-all group">
                        <i className="fas fa-pen text-gray-400 text-xs group-hover:text-orange-500 transition-colors"></i>
                        <input 
                            type="text" 
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            className="bg-transparent border-none outline-none text-center font-medium text-gray-700 dark:text-gray-200 placeholder-gray-400 w-48 focus:w-64 transition-all"
                            placeholder="Nome do arquivo"
                        />
                        <span className="text-gray-400 text-sm font-medium select-none">.bpmn</span>
                    </div>
                }
                rightContent={
                    <>
                        {/* Menu Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button 
                                onClick={toggleDropdown}
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors py-2"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Menu
                                <i className={`fas fa-chevron-down text-[10px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {isDropdownOpen && (
                                <div 
                                    className="absolute right-0 top-full mt-2 w-64 bg-menu-light bg-menu-dark rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in-up origin-top-right"
                                >
                                    <div className="p-2">
                                        <Link href="/" className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors group mb-1 !no-underline text-decoration-none">
                                            <div className="w-8 h-8 rounded-full icon-bg-back flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <i className="fas fa-arrow-left"></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">Voltar</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Menu principal</div>
                                            </div>
                                        </Link>
                                        <div className="h-px bg-gray-100 dark:bg-[#333] my-2"></div>

                                        <button onClick={() => handleAction(createNewDiagram)} className="w-full text-left px-4 py-3 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors group">
                                            <div className="w-8 h-8 rounded-full icon-bg-orange flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                                <i className="fas fa-file"></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">Novo</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Começar do zero</div>
                                            </div>
                                        </button>
                                        
                                        <button onClick={() => { setDropdownOpen(false); fileInputRef.current.click(); }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors group">
                                                <div className="w-8 h-8 rounded-full icon-bg-blue flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                                <i className="fas fa-folder-open"></i>
                                            </div>
                                            <div>
                                                <div className="font-semibold text-gray-900 dark:text-gray-100">Abrir</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">Importar arquivo local</div>
                                            </div>
                                        </button>
                                        
                                        <div className="h-px bg-gray-100 dark:bg-[#333] my-2"></div>
                                        
                                        <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Exportar como</div>
                                        
                                        <button onClick={() => handleAction(saveXML)} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors text-sm">
                                            <i className="fas fa-code w-5 text-center text-gray-400"></i> XML (BPMN 2.0)
                                        </button>
                                        <button onClick={() => handleAction(saveSVG)} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors text-sm">
                                            <i className="fas fa-image w-5 text-center text-gray-400"></i> Imagem (SVG)
                                        </button>
                                        <button onClick={() => handleAction(savePNG)} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors text-sm">
                                            <i className="fas fa-file-image w-5 text-center text-gray-400"></i> Imagem (PNG)
                                        </button>
                                        <button onClick={() => handleAction(savePDF)} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm flex items-center gap-3 transition-colors text-sm">
                                            <i className="fas fa-file-pdf w-5 text-center text-gray-400"></i> Documento (PDF)
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <input type="file" ref={fileInputRef} accept=".bpmn,.xml" onChange={handleFileLoad} className="hidden" />
                    </>
                }
            />

            {/* Modeler Container */}
            <div className="flex-grow relative w-full h-full overflow-hidden" style={{ marginTop: '80px' }}>
                 <div ref={containerRef} className="w-full h-full canvas-container"></div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
                    <div className="bg-[#1e1e1e] text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-[#333]">
                        <i className="fas fa-info-circle text-orange-500"></i>
                        <span className="font-medium">{notification}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BPMNPage;
