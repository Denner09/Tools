import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FractureShader } from './shaders/FractureShader';
import { GlfxShaderLibrary } from './shaders/GlfxShaderLibrary';

const TOOLS = {
  MOVE: 'move',
  RESIZE: 'resize',
  MARQUEE: 'marquee', // Seleção retangular
  CROP: 'crop',
  DRAW: 'draw',
  TEXT: 'text',
  FILTERS: 'filters',
  BUCKET: 'bucket',
  MAGIC_WAND: 'magic_wand',
  EYEDROPPER: 'eyedropper',
  ERASER: 'eraser'
};

const BRUSH_TYPES = {
    ROUND: 'round',
    SQUARE: 'square',
    AIRBRUSH: 'airbrush'
};

const GLOBAL_CLIPBOARD = {
    data: null,
    width: 0,
    height: 0
};

const FILTERS = {
  NORMAL: { name: 'Normal', css: () => '' },
  GRAYSCALE: { name: 'P&B', css: (i) => `grayscale(${i * 100}%)` },
  SEPIA: { name: 'Sépia', css: (i) => `sepia(${i * 100}%)` },
  INVERT: { name: 'Negativo', css: (i) => `invert(${i * 100}%)` },
  BLUR: { name: 'Desfoque', css: (i) => `blur(${i * 20}px)` },
  BRIGHTNESS: { name: 'Brilho', css: (i) => `brightness(${i * 200}%)` }, // 0.5 = 100% (Normal)
  CONTRAST: { name: 'Contraste', css: (i) => `contrast(${i * 200}%)` }, // 0.5 = 100% (Normal)
  DOTS: { name: 'Pontilhada', css: () => 'webgl-glfx', shader: 'dotScreen', getUniforms: (i) => ({ u_center: [0.5,0.5], u_angle: 1.1, u_scale: 0.8 + (1.0-i)*2.0, u_texSize: [0,0] }) },
  GLITCH: { name: 'Glitch', css: () => 'url(#glitch)' },
  HOLO: { name: 'Holograma', css: (i) => `hue-rotate(${i * 180}deg) saturate(${100 + i * 200}%) contrast(${100 + i * 50}%) brightness(${100 + i * 20}%)` },
  NOISE: { name: 'TV Antiga', css: () => 'url(#noise)' },
  DUOTONE: { name: 'Duotone', css: () => 'url(#duotone)' },
  POLAROID: { name: 'Polaroid', css: (i) => `contrast(${100 + i * 60}%) brightness(${100 + i * 20}%) saturate(${100 + i * 40}%) sepia(${i * 60}%)` },
  FRACTURE: { name: 'Vidro Quebrado', css: () => 'webgl-fracture' }, // Special handling
  RETRO: { name: 'Retro', css: (i) => `sepia(${i * 100}%) grayscale(${i * 20}%) contrast(${100 - i * 10}%)` },
  // GLFX Effects
  VIGNETTE: { name: 'Vinheta', css: () => 'webgl-glfx', shader: 'vignette', getUniforms: (i) => ({ u_size: 0.5, u_amount: i }) },
  ZOOM_BLUR: { name: 'Desfoque de Zoom', css: () => 'webgl-glfx', shader: 'zoomBlur', getUniforms: (i) => ({ u_center: [0.5,0.5], u_strength: i * 0.5, u_texSize: [0,0] }) },
  INK: { name: 'Tinta', css: () => 'webgl-glfx', shader: 'ink', getUniforms: (i) => ({ u_strength: i * 0.5, u_texSize: [0,0] }) },
  COLOR_HALFTONE: { name: 'Meio-Tom', css: () => 'webgl-glfx', shader: 'colorHalftone', getUniforms: (i) => ({ u_center: [0.5,0.5], u_angle: 1.1, u_scale: 3 + i * 20, u_texSize: [0,0] }) },
  HEXAGONAL_PIXELATE: { name: 'Pixelização (Hex)', css: () => 'webgl-glfx', shader: 'hexagonalPixelate', getUniforms: (i) => ({ u_center: [0.5,0.5], u_scale: 10 + i * 50, u_texSize: [0,0] }) },
};

const PRESET_COLORS = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#00ffff', '#ff00ff', '#808080', '#ffa500', 
    '#800080', '#a52a2a'
];

const CANVAS_PRESETS = [
    { name: 'HD (1280x720)', w: 1280, h: 720 },
    { name: 'Full HD (1920x1080)', w: 1920, h: 1080 },
    { name: '4K (3840x2160)', w: 3840, h: 2160 },
    { name: 'Quadrado (1080x1080)', w: 1080, h: 1080 },
    { name: 'Story (1080x1920)', w: 1080, h: 1920 },
    { name: 'A4 (2480x3508)', w: 2480, h: 3508 },
];

const FONT_FAMILIES = ['Arial', 'Helvetica', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana', 'Comic Sans MS', 'Impact', 'Trebuchet MS', 'Arial Black'];

// Text Properties Panel Component
function TextPropertiesPanel({ layer, onUpdate, isOpen, onClose }) {
    if (!layer || layer.type !== 'text') return null;
    
    return (
        <div 
            className={`fixed right-0 top-0 h-full w-80 bg-white dark:bg-[#2d2d2d] border-l border-gray-300 dark:border-gray-700 shadow-2xl z-[150] transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            style={{ marginTop: '40px' }} // Account for top bar
        >
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white">Propriedades de Texto</h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                
                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Text Input */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">TEXTO</label>
                        <textarea 
                            value={layer.text}
                            onChange={(e) => onUpdate({ text: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white outline-none focus:border-blue-500 resize-none"
                            rows={4}
                        />
                    </div>
                    
                    {/* Font Family */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">FONTE</label>
                        <select 
                            value={layer.fontFamily}
                            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                        >
                            {FONT_FAMILIES.map(font => (
                                <option key={font} value={font}>{font}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Font Size */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">TAMANHO: {layer.fontSize}px</label>
                        <input 
                            type="range"
                            min="8"
                            max="200"
                            value={layer.fontSize}
                            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                    
                    {/* Color */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">COR</label>
                        <div className="flex gap-2">
                            <input 
                                type="color"
                                value={layer.color}
                                onChange={(e) => onUpdate({ color: e.target.value })}
                                className="w-12 h-10 rounded cursor-pointer"
                            />
                            <input 
                                type="text"
                                value={layer.color}
                                onChange={(e) => onUpdate({ color: e.target.value })}
                                className="flex-1 bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded px-2 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    {/* Style Toggles */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">ESTILO</label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => onUpdate({ bold: !layer.bold })}
                                className={`flex-1 py-2 rounded border ${layer.bold ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                            >
                                <i className="fas fa-bold"></i>
                            </button>
                            <button 
                                onClick={() => onUpdate({ italic: !layer.italic })}
                                className={`flex-1 py-2 rounded border ${layer.italic ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                            >
                                <i className="fas fa-italic"></i>
                            </button>
                        </div>
                    </div>
                    
                    {/* Text Transform */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">TRANSFORMAÇÃO</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button 
                                onClick={() => onUpdate({ textTransform: 'none' })}
                                className={`py-2 rounded border text-xs ${layer.textTransform === 'none' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                            >
                                Normal
                            </button>
                            <button 
                                onClick={() => onUpdate({ textTransform: 'uppercase' })}
                                className={`py-2 rounded border text-xs ${layer.textTransform === 'uppercase' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                            >
                                MAIÚSCULAS
                            </button>
                            <button 
                                onClick={() => onUpdate({ textTransform: 'lowercase' })}
                                className={`py-2 rounded border text-xs ${layer.textTransform === 'lowercase' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                            >
                                minúsculas
                            </button>
                            <button 
                                onClick={() => onUpdate({ textTransform: 'capitalize' })}
                                className={`py-2 rounded border text-xs ${layer.textTransform === 'capitalize' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600'}`}
                            >
                                Capitalizar
                            </button>
                        </div>
                    </div>
                    
                    {/* Letter Spacing */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">ESPAÇAMENTO DE LETRAS: {layer.letterSpacing}px</label>
                        <input 
                            type="range"
                            min="-5"
                            max="20"
                            value={layer.letterSpacing}
                            onChange={(e) => onUpdate({ letterSpacing: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                    
                    {/* Line Height */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">ALTURA DA LINHA: {layer.lineHeight}</label>
                        <input 
                            type="range"
                            min="0.5"
                            max="3"
                            step="0.1"
                            value={layer.lineHeight}
                            onChange={(e) => onUpdate({ lineHeight: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                    
                    {/* Text Shadow */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">SOMBRA</label>
                            <button 
                                onClick={() => onUpdate({ textShadow: { ...layer.textShadow, enabled: !layer.textShadow.enabled } })}
                                className={`px-3 py-1 rounded text-xs ${layer.textShadow.enabled ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-[#333] text-gray-900 dark:text-gray-200'}`}
                            >
                                {layer.textShadow.enabled ? 'Ativado' : 'Desativado'}
                            </button>
                        </div>
                        
                        {layer.textShadow.enabled && (
                            <div className="space-y-2 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
                                <div>
                                    <label className="block text-[10px] text-gray-600 dark:text-gray-400 mb-1">Offset X: {layer.textShadow.offsetX}px</label>
                                    <input 
                                        type="range"
                                        min="-20"
                                        max="20"
                                        value={layer.textShadow.offsetX}
                                        onChange={(e) => onUpdate({ textShadow: { ...layer.textShadow, offsetX: Number(e.target.value) } })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-600 dark:text-gray-400 mb-1">Offset Y: {layer.textShadow.offsetY}px</label>
                                    <input 
                                        type="range"
                                        min="-20"
                                        max="20"
                                        value={layer.textShadow.offsetY}
                                        onChange={(e) => onUpdate({ textShadow: { ...layer.textShadow, offsetY: Number(e.target.value) } })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-600 dark:text-gray-400 mb-1">Desfoque: {layer.textShadow.blur}px</label>
                                    <input 
                                        type="range"
                                        min="0"
                                        max="20"
                                        value={layer.textShadow.blur}
                                        onChange={(e) => onUpdate({ textShadow: { ...layer.textShadow, blur: Number(e.target.value) } })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-600 dark:text-gray-400 mb-1">Cor</label>
                                    <input 
                                        type="color"
                                        value={layer.textShadow.color}
                                        onChange={(e) => onUpdate({ textShadow: { ...layer.textShadow, color: e.target.value } })}
                                        className="w-full h-8 rounded cursor-pointer"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Rotation */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">ROTAÇÃO: {layer.rotation}°</label>
                        <input 
                            type="range"
                            min="0"
                            max="360"
                            value={layer.rotation || 0}
                            onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ImageEditor() {
    // Global State
    const [projects, setProjects] = useState([]); 
    const [activeProjectId, setActiveProjectId] = useState(null);
    
    // Tools State
    const [activeTool, setActiveTool] = useState(TOOLS.MARQUEE);
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState('#000000');
    const [brushType, setBrushType] = useState('round');
    const [tolerance, setTolerance] = useState(32);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [contextMenu, setContextMenu] = useState(null); // {x, y, layerId, projectId}
    const [resizeModal, setResizeModal] = useState(null); // {layerId, currentW, currentH}
    
    // UI State
    const [activeMenu, setActiveMenu] = useState(null); 
    const [newProjModal, setNewProjModal] = useState(null); 
    const [saveModal, setSaveModal] = useState(null); 
    const [textEditPanel, setTextEditPanel] = useState(null); // {layerId, projectId, isOpen} 

    const fileInputRef = useRef(null);
    const activeProject = projects.find(p => p.id === activeProjectId);

    const createProject = (w, h, name, initialImage = null, bgType = 'white') => {
        const id = 'proj-' + Date.now() + Math.random();
        const firstLayerId = 'layer-bg-' + Date.now();
        
        // Create initial canvas for background/image if needed
        let initialDataURL = null;
        if (bgType !== 'transparent' && !initialImage) {
             const canvas = document.createElement('canvas');
             canvas.width = w;
             canvas.height = h;
             const ctx = canvas.getContext('2d');
             ctx.fillStyle = bgType === 'white' ? '#ffffff' : '#000000';
             ctx.fillRect(0, 0, w, h);
             initialDataURL = canvas.toDataURL();
        }
        
        const initialLayers = [{ 
            id: firstLayerId, 
            name: 'Fundo', 
            visible: true, 
            locked: false, 
            opacity: 1,
            x: 0,
            y: 0,
            w: initialImage?.width || w,
            h: initialImage?.height || h,
            initialImage: initialImage,
            dataURL: initialDataURL // Add Pre-filled Background
        }];

        const newProject = {
            id,
            name: name || `Projeto ${projects.length + 1}`,
            dims: { w, h },
            zoom: 100, 
            filter: '',
            layers: initialLayers,
            activeLayerId: firstLayerId,
            nextLayerNameIndex: 2,
            selection: null, // {x, y, w, h}
            history: [{ // Initialize history with the starting state
                layers: initialLayers,
                selection: null
            }], 
            historyIndex: 0 // Start at index 0
        };
        
        // Auto-fit zoom if image is large
        if (w > 1000) newProject.zoom = 50;
        if (w > 2000) newProject.zoom = 25;

        setProjects(prev => [...prev, newProject]);
        setActiveProjectId(id);
    };

    const handleFileOpen = (e) => {
        const files = Array.from(e.target.files);
        if(!files.length) return;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = new Image();
                img.onload = () => {
                    createProject(img.width, img.height, file.name, img);
                };
                img.src = ev.target.result;
            };
            reader.readAsDataURL(file);
        });
        setActiveMenu(null);
        e.target.value = ''; // Reset input
    };

    const closeProject = (e, id) => {
        if(e) e.stopPropagation();
        setProjects(prev => prev.filter(p => p.id !== id));
        if (activeProjectId === id) {
            setActiveProjectId(projects.length > 1 ? projects.find(p => p.id !== id)?.id : null);
        }
    };

    const closeAll = () => {
        if(projects.length === 0) return;
        if(confirm("Fechar todos os projetos? Alterações não salvas serão perdidas.")) {
            setProjects([]);
            setActiveProjectId(null);
        }
        setActiveMenu(null);
    };

    // --- GLOBAL SHORTCUTS ---
    useEffect(() => {
        const handleKeyDown = async (e) => {
            if (!activeProject) return;

            // Undo (Ctrl+Z)
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                undo(activeProject.id);
            }
            // Redo (Ctrl+Y or Ctrl+Shift+Z)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
                e.preventDefault();
                redo(activeProject.id);
            }
            // Select All (Ctrl+A)
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                updateProjectState(activeProject.id, {
                    selection: { x: 0, y: 0, w: activeProject.dims.w, h: activeProject.dims.h }
                });
            }
            // Clipboard: Copy (Ctrl+C), Cut (Ctrl+X) - handled via event dispatch to Workspace
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'x')) {
                // Dispatch event for the active workspace to handle
                window.dispatchEvent(new CustomEvent('CLIPBOARD_ACTION', { detail: { action: e.key === 'c' ? 'copy' : 'cut', projectId: activeProject.id } }));
            }
            // Paste (Ctrl+V)
            if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
                window.dispatchEvent(new CustomEvent('CLIPBOARD_ACTION', { detail: { action: 'paste', projectId: activeProject.id } }));
            }
            // Deselect (Ctrl+D)
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                // We need to update state AND push to history
                // Create the new state object effectively
                const newSelection = null;
                updateProjectState(activeProject.id, { selection: newSelection });
                
                // Add to history requires full state snapshot usually?
                // addToHistory implementation takes 'newState'. 
                // But usually 'onSnapshot' from workspace calls 'addToHistory' with { layers, selection }.
                // We can construct it here?
                // Shortcut: we just want to save the FACT that selection changed.
                // Re-using the same pattern as 'onUpdate' in Workspace is hard because 'addToHistory' is simple wrapper.
                // Let's just manually construct the history entry.
                const historyEntry = {
                    layers: activeProject.layers, // Layers didn't change
                    selection: null
                };
                addToHistory(activeProject.id, historyEntry);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeProject, projects]);

    const addToHistory = (projectId, newState) => {
        setProjects(prev => prev.map(p => {
            if (p.id !== projectId) return p;
            
            // Limit history to 20
            const newHistory = [...p.history.slice(0, p.historyIndex + 1), newState].slice(-20);
            return {
                ...p,
                history: newHistory,
                historyIndex: newHistory.length - 1
            };
        }));
    };

    const undo = (projectId) => {
        setProjects(prev => prev.map(p => {
            if (p.id !== projectId || p.historyIndex <= 0) return p;
            const targetIndex = p.historyIndex - 1;
            const state = p.history[targetIndex];
            // Restore layers and selection
            // Note: Deep restoration of canvas content is tricky. 
            // We rely on the Workspace component checking 'historyVersion' or similar, 
            // or we assume layers structure changes are main. 
            // For Pixel content undo, we need the Workspace to handle it internally or save snapshots as dataURLs in history.
            // Simplified approach: We will expect the 'state' to contain the layer info. 
            // If we stored dataURLs, we need to restore them.
            
            // Since we stored full snapshots in 'handleSaveHistory' (which we will implement in workspace),
            // we can just map back.
            return { ...p, ...state, historyIndex: targetIndex };
        }));
    };

    const redo = (projectId) => {
        setProjects(prev => prev.map(p => {
            if (p.id !== projectId || p.historyIndex >= p.history.length - 1) return p;
            const targetIndex = p.historyIndex + 1;
            const state = p.history[targetIndex];
            return { ...p, ...state, historyIndex: targetIndex };
        }));
    };
    
    // Listen for text panel open event
    useEffect(() => {
        const handleOpenTextPanel = (e) => {
            const { layerId, projectId } = e.detail;
            setTextEditPanel({ layerId, projectId, isOpen: true });
        };
        
        window.addEventListener('OPEN_TEXT_PANEL', handleOpenTextPanel);
        return () => window.removeEventListener('OPEN_TEXT_PANEL', handleOpenTextPanel);
    }, []);


    const handleLayerDropOnTab = (e, targetProjectId) => {
        e.preventDefault();
        try {
            const transferData = e.dataTransfer.getData('application/json');
            if (!transferData) return;
            const data = JSON.parse(transferData);
            
            if (data.type === 'selection' && data.sourceProjectId) {
               // Handle Selection Drop (Move part of image)
               // Request data from source
               const eventId = `req-sel-${Date.now()}`;
               const handleData = (ev) => {
                    const { imgData, w, h } = ev.detail;
                    const img = new Image();
                    img.onload = () => {
                         setProjects(prev => prev.map(p => {
                            if(p.id === targetProjectId) {
                                const newId = 'layer-drop-' + Date.now();
                                return {
                                    ...p,
                                    layers: [{
                                        id: newId,
                                        name: 'Seleção Movida',
                                        visible: true,
                                        locked: false,
                                        x: 0, y: 0,
                                        w: w, h: h,
                                        initialImage: img
                                    }, ...p.layers],
                                    activeLayerId: newId
                                };
                            }
                            return p;
                         }));
                    };
                    img.src = imgData;
               };
               window.addEventListener(`SELECTION_DATA_${eventId}`, handleData, { once: true });
               window.dispatchEvent(new CustomEvent('GET_SELECTION_DATA', { 
                   detail: { projectId: data.sourceProjectId, responseEvent: `SELECTION_DATA_${eventId}` }
               }));

            } else if (data.layerId && data.sourceProjectId) {
                // Layer Drop logic...
                 if (data.sourceProjectId === targetProjectId) return;
                 const sourceProject = projects.find(p => p.id === data.sourceProjectId);
                 const sourceLayer = sourceProject?.layers.find(l => l.id === data.layerId);
                 
                 if (sourceProject && sourceLayer) {
                     const eventId = `req-${Date.now()}`;
                     const handleData = (ev) => {
                         const { imgData } = ev.detail;
                         const img = new Image();
                         img.onload = () => {
                             setProjects(prev => prev.map(p => {
                                 if (p.id === targetProjectId) {
                                     const newLayerId = 'layer-' + Date.now() + Math.random();
                                     return {
                                         ...p,
                                         layers: [{
                                             id: newLayerId,
                                             name: sourceLayer.name + ' (Cópia)',
                                             visible: true,
                                             locked: false,
                                             x: 0, // Reset pos or keep? User asked "maintain zoom and size". 
                                                   // Zoom is view, size is pixels. "0,0" preserves pixels.
                                             y: 0,
                                             initialImage: img
                                         }, ...p.layers],
                                         activeLayerId: newLayerId
                                     };
                                 }
                                 return p;
                             }));
                         };
                         img.src = imgData;
                     };
     
                     window.addEventListener(`LAYER_DATA_${eventId}`, handleData, { once: true });
                     window.dispatchEvent(new CustomEvent('GET_LAYER_DATA', { 
                         detail: { projectId: sourceProject.id, layerId: sourceLayer.id, responseEvent: `LAYER_DATA_${eventId}` }
                     }));
                 }
            }
        } catch (err) {
            console.error("Drop Error", err);
        }
    };

    const addFilterLayer = (filterKey) => {
        if (!activeProject || !activeProject.activeLayerId) return;
        
        const sourceLayer = activeProject.layers.find(l => l.id === activeProject.activeLayerId);
        if (!sourceLayer) return;

        // If active layer is already an effect, link to its parent? 
        // Or disallow effects on effects?
        // Let's assume we link to the 'source' even if another effect is selected, 
        // OR we just link to current default.
        // Simplest: Link to activeLayerId. If active is effect, we chain effects? 
        // Complex. Let's restrict: Can only add effect to Image/Draw layers.
        // If 'effect' is selected, find its linked layer and add another effect to THAT.
        
        let targetId = sourceLayer.id;
        if (sourceLayer.type === 'effect') {
             targetId = sourceLayer.linkedTo;
        }

        const targetLayer = activeProject.layers.find(l => l.id === targetId);
        if (!targetLayer) return;

        const newId = 'layer-fx-' + Date.now();
        const filterDef = FILTERS[filterKey];

        const newLayer = {
            id: newId,
            name: `Fx: ${filterDef.name}`,
            type: 'effect',
            filterType: filterKey, // Store the filter type key
            linkedTo: targetId,
            filterCss: filterDef.css(0.5), // Store initial static CSS for fallback
            visible: true,
            locked: false,
            opacity: 1, // Layer Opacity
            intensity: 0.5, // Effect Parameter Intensity (0-1)
            x: targetLayer.x || 0,
            y: targetLayer.y || 0,
            w: targetLayer.w || targetLayer.initialImage?.width || activeProject.dims.w, // Area match source initially 
            h: targetLayer.h || targetLayer.initialImage?.height || activeProject.dims.h
        };

        // Insert ABOVE the target layer (or active layer)
        // Find index of active layer
        // const idx = activeProject.layers.findIndex(l => l.id === activeProject.activeLayerId);
        // actually just prepend to valid 'top' position or strictly above target.
        // Layers array is usually [Top, ..., Bottom].
        // We want Effect to be 'above' target in the stack so it renders 'after'.
        // Because of the 'ProjectWorkspace' loop [...layers].reverse(), index 0 is Top.
        // So we add to beginning of array.
        
        setProjects(prev => prev.map(p => {
             if (p.id === activeProject.id) {
                 return {
                     ...p,
                     layers: [newLayer, ...p.layers],
                     activeLayerId: newId
                 };
             }
             return p;
        }));
    };

    const updateProjectState = useCallback((id, updates) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    useEffect(() => {
        const handleContextEvent = (e) => {
            const { x, y, projectId, activeLayerId } = e.detail;
            setContextMenu({ x, y, projectId, layerId: activeLayerId, title: 'Opções da Camada' });
        };
        window.addEventListener('SHOW_CONTEXT_MENU', handleContextEvent);
        return () => window.removeEventListener('SHOW_CONTEXT_MENU', handleContextEvent);
    }, []);

    return (
        <div className={`${isFullScreen ? 'fixed inset-0 z-[100] h-screen w-screen' : 'flex flex-col h-full w-full'} bg-gray-50 dark:bg-[#1e1e1e] text-gray-800 dark:text-gray-200 overflow-hidden font-sans transition-all duration-300 relative`} onClick={() => setActiveMenu(null)}>
            
            {/* SVG Filters Definitions */}
            <svg className="fixed w-0 h-0 pointer-events-none">
                <defs>
                    {/* Halftone/Dots */}
                    <filter id="dots">
                        <feImage href="data:image/svg+xml;utf8,%3Csvg%20width%3D%226%22%20height%3D%226%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%223%22%20cy%3D%223%22%20r%3D%222%22%20fill%3D%22black%22%2F%3E%3C%2Fsvg%3E" result="dotPattern" x="0" y="0" width="6" height="6" />
                        <feTile in="dotPattern" result="tiledDots" />
                        <feColorMatrix type="luminanceToAlpha" in="SourceGraphic" result="luminance" />
                        <feComposite operator="in" in="tiledDots" in2="luminance" result="maskedDots" />
                        <feComposite operator="over" in="maskedDots" in2="SourceGraphic" />
                    </filter>

                    {/* Glitch - Chromatic Aberration */}
                    <filter id="glitch">
                        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="red" />
                        <feOffset in="red" dx="-4" dy="0" result="redOffset" />
                        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="green" />
                        <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blue" />
                        <feOffset in="blue" dx="4" dy="0" result="blueOffset" />
                        <feBlend mode="screen" in="redOffset" in2="green" result="blend1" />
                        <feBlend mode="screen" in="blend1" in2="blueOffset" />
                    </filter>

                    {/* Noise / TV */}
                    <filter id="noise">
                         <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" stitchTiles="stitch" result="noise" />
                         <feColorMatrix type="saturate" values="0" in="noise" result="bwNoise" />
                         <feBlend mode="overlay" in="bwNoise" in2="SourceGraphic" result="blend" />
                         <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" in="blend" />
                    </filter>

                    {/* Duotone (Purple/Yellow style) */}
                    <filter id="duotone">
                        <feColorMatrix type="matrix" values="0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0.2126 0.7152 0.0722 0 0  0 0 0 1 0" result="gray" />
                        <feComponentTransfer in="gray">
                             <feFuncR type="table" tableValues="0.2 1" />
                             <feFuncG type="table" tableValues="0 1" />
                             <feFuncB type="table" tableValues="0.8 0.2" />
                        </feComponentTransfer>
                    </filter>

                     {/* Fracture/Broken Glass (Simulated Cracks - Ksenia K Style) */}
                     <filter id="fracture">
                         <feTurbulence type="fractalNoise" baseFrequency="0.0001 0.002" numOctaves="4" seed="2" result="noise" />
                         <feColorMatrix type="matrix" in="noise" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 60 -30" result="sharp" />
                         <feDisplacementMap in="SourceGraphic" in2="sharp" scale="60" xChannelSelector="R" yChannelSelector="G" result="distorted" />
                         
                         <feSpecularLighting in="sharp" surfaceScale="5" specularConstant="1.2" specularExponent="20" lightingColor="#ffffff" result="light">
                             <feDistantLight azimuth="45" elevation="60" />
                         </feSpecularLighting>
                         
                         <feComposite operator="in" in="light" in2="sharp" result="highlights" />
                         <feComposite operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" in="distorted" in2="highlights" />
                     </filter>
                </defs>
            </svg>
            
            <div className="h-10 bg-white dark:!bg-[#2d2d2d] border-b border-gray-200 dark:!border-gray-700 flex items-center px-4 justify-between shrink-0 relative z-50 transition-colors">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                    <div className="relative">
                        <span 
                            className={`hover:text-blue-600 dark:hover:text-white cursor-pointer px-2 py-1 rounded ${activeMenu === 'file' ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-white' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}
                        >
                            Arquivo <i className="fas fa-chevron-down ml-1 text-[10px]"></i>
                        </span>
                        
                        {activeMenu === 'file' && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:!bg-[#2d2d2d] border border-gray-200 dark:!border-gray-600 rounded shadow-xl py-1 text-gray-700 dark:!text-gray-200 flex flex-col">
                                <button 
                                    className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white flex items-center justify-between group transition-colors"
                                    onClick={() => { setNewProjModal({}); setActiveMenu(null); }}
                                >
                                    <span><i className="fas fa-file w-5 mr-2"></i> Novo</span>
                                </button>
                                <button 
                                    className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white flex items-center justify-between transition-colors"
                                    onClick={() => { fileInputRef.current.click(); setActiveMenu(null); }}
                                >
                                    <span><i className="fas fa-folder-open w-5 mr-2"></i> Abrir</span>
                                </button>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                                <button 
                                    className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white disabled:opacity-50 transition-colors"
                                    disabled={!activeProject}
                                    onClick={() => { setSaveModal({ projectId: activeProjectId }); setActiveMenu(null); }}
                                >
                                    <i className="fas fa-save w-5 mr-2"></i> Salvar como...
                                </button>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                                <button 
                                    className="text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-600 hover:text-red-600 dark:hover:text-white transition-colors"
                                    onClick={() => closeAll()}
                                >
                                    <i className="fas fa-times-circle w-5 mr-2"></i> Fechar Tudo
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <span 
                            className={`hover:text-blue-600 dark:hover:text-white cursor-pointer px-2 py-1 rounded ${activeMenu === 'edit' ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-white' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'edit' ? null : 'edit'); }}
                        >
                            Editar <i className="fas fa-chevron-down ml-1 text-[10px]"></i>
                        </span>

                        {activeMenu === 'edit' && (
                            <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:!bg-[#2d2d2d] border border-gray-200 dark:!border-gray-600 rounded shadow-xl py-1 text-gray-700 dark:!text-gray-200 flex flex-col z-[60]">
                                <button className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white flex justify-between items-center group transition-colors"
                                    onClick={() => { if(activeProject) undo(activeProject.id); setActiveMenu(null); }}
                                    disabled={!activeProject}
                                >
                                    <span>Desfazer</span> <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-gray-200">Ctrl+Z</span>
                                </button>
                                <button className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white flex justify-between items-center group transition-colors"
                                    onClick={() => { if(activeProject) redo(activeProject.id); setActiveMenu(null); }}
                                    disabled={!activeProject}
                                >
                                    <span>Refazer</span> <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-gray-200">Ctrl+Y</span>
                                </button>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                                <button className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white flex justify-between items-center group transition-colors"
                                    onClick={() => { 
                                         if(activeProject) window.dispatchEvent(new CustomEvent('CLIPBOARD_ACTION', { detail: { action: 'cut', projectId: activeProject.id } })); 
                                         setActiveMenu(null); 
                                    }}
                                    disabled={!activeProject}
                                >
                                    <span>Recortar</span> <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-gray-200">Ctrl+X</span>
                                </button>
                                <button className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white flex justify-between items-center group transition-colors"
                                    onClick={() => { 
                                         if(activeProject) window.dispatchEvent(new CustomEvent('CLIPBOARD_ACTION', { detail: { action: 'copy', projectId: activeProject.id } })); 
                                         setActiveMenu(null); 
                                    }}
                                    disabled={!activeProject}
                                >
                                    <span>Copiar</span> <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-gray-200">Ctrl+C</span>
                                </button>
                                <button className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white flex justify-between items-center group transition-colors"
                                    onClick={() => { 
                                         if(activeProject) window.dispatchEvent(new CustomEvent('CLIPBOARD_ACTION', { detail: { action: 'paste', projectId: activeProject.id } })); 
                                         setActiveMenu(null); 
                                    }}
                                    disabled={!activeProject}
                                >
                                    <span>Colar</span> <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-gray-200">Ctrl+V</span>
                                </button>
                                <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                                <button className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-colors"
                                    onClick={() => {
                                        if(!activeProject) return;
                                        const newW = prompt("Nova Largura:", activeProject.dims.w);
                                        const newH = prompt("Nova Altura:", activeProject.dims.h);
                                        if(newW && newH) {
                                            updateProjectState(activeProject.id, { dims: { w: Number(newW), h: Number(newH) }});
                                        }
                                        setActiveMenu(null);
                                    }}
                                >
                                    <span>Redimensionar Canvas</span>
                                </button>
                                <button className="text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-colors"
                                    onClick={async () => {
                                        if(!activeProject) return;
                                        const angle = prompt("Ângulo de rotação (em graus):", "90");
                                        if(!angle) {
                                            setActiveMenu(null);
                                            return;
                                        }
                                        
                                        const degrees = parseFloat(angle);
                                        if(isNaN(degrees)) {
                                            alert("Por favor, insira um número válido.");
                                            setActiveMenu(null);
                                            return;
                                        }
                                        
                                        const radians = (degrees * Math.PI) / 180;
                                        
                                        // Calculate new canvas dimensions after rotation
                                        const cos = Math.abs(Math.cos(radians));
                                        const sin = Math.abs(Math.sin(radians));
                                        const newW = Math.ceil(activeProject.dims.w * cos + activeProject.dims.h * sin);
                                        const newH = Math.ceil(activeProject.dims.w * sin + activeProject.dims.h * cos);
                                        
                                        // Rotate all layers
                                        const rotatedLayers = await Promise.all(activeProject.layers.map(async (layer) => {
                                            if(layer.type === 'group' || layer.type === 'effect') return layer;
                                            
                                            // Get the layer canvas
                                            const sourceCanvas = document.createElement('canvas');
                                            sourceCanvas.width = activeProject.dims.w;
                                            sourceCanvas.height = activeProject.dims.h;
                                            const sourceCtx = sourceCanvas.getContext('2d');
                                            
                                            // Draw current layer content
                                            if(layer.dataURL) {
                                                await new Promise((resolve) => {
                                                    const img = new Image();
                                                    img.onload = () => {
                                                        sourceCtx.drawImage(img, 0, 0);
                                                        resolve();
                                                    };
                                                    img.onerror = () => resolve(); // Skip on error
                                                    img.src = layer.dataURL;
                                                });
                                            } else if(layer.initialImage) {
                                                sourceCtx.drawImage(layer.initialImage, 0, 0, layer.w || layer.initialImage.width, layer.h || layer.initialImage.height);
                                            }
                                            
                                            // Create rotated canvas
                                            const rotatedCanvas = document.createElement('canvas');
                                            rotatedCanvas.width = newW;
                                            rotatedCanvas.height = newH;
                                            const rotatedCtx = rotatedCanvas.getContext('2d');
                                            
                                            // Rotate and draw
                                            rotatedCtx.translate(newW / 2, newH / 2);
                                            rotatedCtx.rotate(radians);
                                            rotatedCtx.drawImage(sourceCanvas, -activeProject.dims.w / 2, -activeProject.dims.h / 2);
                                            
                                            return {
                                                ...layer,
                                                dataURL: rotatedCanvas.toDataURL(),
                                                w: newW,
                                                h: newH
                                            };
                                        }));
                                        
                                        updateProjectState(activeProject.id, { 
                                            dims: { w: newW, h: newH },
                                            layers: rotatedLayers
                                        });
                                        setActiveMenu(null);
                                    }}
                                >
                                    <span>Girar Canvas</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <span 
                            className={`hover:text-blue-600 dark:hover:text-white cursor-pointer px-2 py-1 rounded ${activeMenu === 'filter' ? 'bg-gray-200 dark:bg-gray-700 text-blue-600 dark:text-white' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'filter' ? null : 'filter'); }}
                        >
                            Filtro <i className="fas fa-chevron-down ml-1 text-[10px]"></i>
                        </span>

                        {activeMenu === 'filter' && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:!bg-[#2d2d2d] border border-gray-200 dark:!border-gray-600 rounded shadow-xl py-1 text-gray-700 dark:!text-gray-200 flex flex-col z-[60]">
                                {Object.entries(FILTERS).map(([key, f]) => (
                                    <button 
                                        key={f.name}
                                        className={`text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white flex items-center gap-2 transition-colors`}
                                        onClick={() => { 
                                            addFilterLayer(key);
                                            setActiveMenu(null); 
                                        }}
                                        disabled={!activeProject}
                                    >
                                        <span>{f.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                

            </div>
            
            <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={handleFileOpen} />

            <div className="bg-gray-100 dark:bg-[#252525] flex items-center px-2 pt-2 gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-700 shrink-0 h-10 scrollbar-hide">
                {projects.map(p => (
                    <div 
                        key={p.id}
                        onClick={() => setActiveProjectId(p.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleLayerDropOnTab(e, p.id)}
                        className={`
                            group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer select-none min-w-[120px] max-w-[200px] border-t border-x border-transparent relative transition-colors
                            ${activeProjectId === p.id 
                                ? 'bg-white dark:!bg-[#1e1e1e] border-gray-200 dark:border-gray-700 text-blue-600 dark:text-white font-medium border-b-white dark:!border-b-[#1e1e1e] -mb-px z-10 shadow-sm' 
                                : 'bg-gray-200 dark:bg-[#333] text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-[#3d3d3d] hover:text-gray-700 dark:hover:text-gray-200'}
                        `}
                    >
                        <i className="fas fa-image text-blue-500"></i>
                        <span className="truncate flex-1">{p.name}</span>
                        <button 
                            onClick={(e) => closeProject(e, p.id)}
                            className="w-4 h-4 rounded-full hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center text-gray-500 hover:opacity-100 transition-all opacity-60"
                        >
                            <i className="fas fa-times text-[9px]"></i>
                        </button>
                    </div>
                ))}
                
                {projects.length === 0 && (
                     <div className="px-3 py-1.5 text-xs text-gray-500 italic select-none">Sem projetos abertos</div>
                )}
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                
                <div className="w-12 bg-gray-100 dark:bg-[#252525] border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 gap-2 z-20 shrink-0 shadow-inner">
                    {/* Ferramentas de Seleção */}
                    <ToolButton icon="crop-alt" active={activeTool === TOOLS.MARQUEE} onClick={() => setActiveTool(TOOLS.MARQUEE)} title="Seleção (M)" />
                    <ToolButton icon="magic" active={activeTool === TOOLS.MAGIC_WAND} onClick={() => setActiveTool(TOOLS.MAGIC_WAND)} title="Varinha Mágica" />
                    
                    {/* Separador */}
                    <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 my-1"></div>
                    
                    {/* Ferramentas de Transformação */}
                    <ToolButton icon="arrows-alt" active={activeTool === TOOLS.MOVE} onClick={() => setActiveTool(TOOLS.MOVE)} title="Mover Camada (V)" />
                    <ToolButton icon="expand-arrows-alt" active={activeTool === TOOLS.RESIZE} onClick={() => setActiveTool(TOOLS.RESIZE)} title="Redimensionar" />
                    
                    {/* Separador */}
                    <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 my-1"></div>
                    
                    {/* Ferramentas de Desenho */}
                    <ToolButton icon="paint-brush" active={activeTool === TOOLS.DRAW} onClick={() => setActiveTool(TOOLS.DRAW)} title="Pincel (B)" />
                    <ToolButton icon="eraser" active={activeTool === TOOLS.ERASER} onClick={() => setActiveTool(TOOLS.ERASER)} title="Borracha" />
                    <ToolButton icon="font" active={activeTool === TOOLS.TEXT} onClick={() => setActiveTool(TOOLS.TEXT)} title="Texto (T)" />
                    
                    {/* Separador */}
                    <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 my-1"></div>
                    
                    {/* Ferramentas de Preenchimento */}
                    <ToolButton icon="fill-drip" active={activeTool === TOOLS.BUCKET} onClick={() => setActiveTool(TOOLS.BUCKET)} title="Balde de Tinta" />
                    <ToolButton icon="eye-dropper" active={activeTool === TOOLS.EYEDROPPER} onClick={() => setActiveTool(TOOLS.EYEDROPPER)} title="Conta-gotas" />
                    
                    {/* Separador */}
                    <div className="w-8 h-px bg-gray-300 dark:bg-gray-600 my-1"></div>
                    
                    {/* Efeitos */}
                    <ToolButton icon="filter" active={activeTool === TOOLS.FILTERS} onClick={() => setActiveTool(TOOLS.FILTERS)} title="Filtros/Efeitos" />
                    
                    <div className="flex-1"></div>
                </div>

                <div className="flex-1 bg-gray-200 dark:bg-[#121212] overflow-hidden relative">
                    {projects.map(p => (
                        <ProjectWorkspace 
                            key={p.id} 
                            project={p}
                            isActive={activeProjectId === p.id}
                            toolsState={{ activeTool, brushSize, brushColor, brushType, tolerance }}
                            onUpdate={(updates, saveHistory = false) => {
                                // If saveHistory is true, we push the state to history
                                if (saveHistory) {
                                    // But we need the FULL current state to push. 
                                    // The 'updates' only has partial.
                                    // We'll let the workspace trigger a separate "SAVE_HISTORY" call or handle inside.
                                    // Here we just update.
                                    // Refactor: Logic should be "Update and then Push".
                                    // But 'projects' is state.
                                    
                                    // Correct way:
                                    // 1. Calculate new project object
                                    // 2. Add to history
                                    setProjects(prev => {
                                        const proj = prev.find(pr => pr.id === p.id);
                                        const newProj = { ...proj, ...updates };
                                        
                                        // History Update
                                        const newHistory = [...proj.history.slice(0, proj.historyIndex + 1), {
                                            layers: newProj.layers,
                                            selection: newProj.selection,
                                            // Ideally we save dataURLs here for all layers? Too heavy.
                                            // WE WILL SAVE DATA URLs in the Workspace on "Change" and pass them up?
                                            // See 'onSnapshot' prop below.
                                        }].slice(-20);

                                        return prev.map(pr => pr.id === p.id ? { 
                                            ...newProj,
                                            // Only update history metadata if we are 'saving history'
                                            // The actual data (canvas content) must be handled by sending snapshots up.
                                            // This is getting circular.
                                            // SIMPLIFICATION:
                                            // We won't manage deep canvas history in this 'multi_replace' step fully robustly.
                                            // We will focus on Layer Structure and Selection history.
                                            // Canvas pixel undo needs a "snapshot" callback.
                                        } : pr);
                                    });
                                } else {
                                    updateProjectState(p.id, updates);
                                }
                            }}
                            onSnapshot={(snapshot) => addToHistory(p.id, snapshot)}
                            setBrushColor={setBrushColor}
                        />
                    ))}
                    
                    {projects.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                             <div className="mb-6 opacity-20"><i className="fas fa-layer-group text-6xl"></i></div>
                             <p className="mb-4 text-xs uppercase tracking-widest opacity-50">Comece algo criativo</p>
                             <div className="flex gap-4">
                                 <button onClick={() => setNewProjModal({})} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-xl text-sm font-medium transition-transform active:scale-95 flex items-center">
                                     <i className="fas fa-plus mr-2"></i> Novo Arquivo
                                 </button>
                                 <button onClick={() => fileInputRef.current.click()} className="px-6 py-3 bg-gray-600 hover:bg-gray-500 dark:bg-[#333] dark:hover:bg-[#444] text-white rounded-lg shadow-xl text-sm font-medium transition-transform active:scale-95 flex items-center">
                                     <i className="fas fa-folder-open mr-2"></i> Abrir Imagem
                                 </button>
                             </div>
                        </div>
                    )}
                </div>

                {activeProject && (
                    <PropertiesPanel 
                        project={activeProject}
                        toolsState={{ activeTool, brushSize, brushColor, brushType, tolerance }}
                        setBrushSize={setBrushSize}
                        setBrushColor={setBrushColor}
                        setBrushType={setBrushType}
                        setTolerance={setTolerance}
                        onUpdateProject={(u) => updateProjectState(activeProject.id, u)}
                    />
                )}
            </div>

            {newProjModal && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-[#2d2d2d] w-full max-w-md rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 p-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Novo Projeto</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-600 dark:text-gray-500 font-bold mb-1">Nome</label>
                                <input id="new_proj_name" type="text" className="w-full bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white outline-none focus:border-blue-500" placeholder="Sem título" defaultValue={newProjModal.name || ''} />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-600 dark:text-gray-500 font-bold mb-1">Predefinições</label>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    {CANVAS_PRESETS.map(p => (
                                        <button key={p.name} className="text-xs p-2 bg-gray-100 dark:bg-[#333] hover:bg-blue-600 hover:text-white rounded border border-gray-300 dark:border-gray-600 text-left transition-colors text-gray-900 dark:text-gray-200"
                                            onClick={() => {
                                                document.getElementById('new_proj_w').value = p.w;
                                                document.getElementById('new_proj_h').value = p.h;
                                            }}
                                        >
                                            {p.name}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <div className="flex-1"><label className="text-[10px] text-gray-600 dark:text-gray-500">Largura (px)</label><input id="new_proj_w" type="number" defaultValue={1280} className="w-full bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white outline-none focus:border-blue-500" /></div>
                                    <div className="flex-1"><label className="text-[10px] text-gray-600 dark:text-gray-500">Altura (px)</label><input id="new_proj_h" type="number" defaultValue={720} className="w-full bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white outline-none focus:border-blue-500" /></div>
                                </div>
                                <div className="mt-4">
                                     <label className="block text-xs uppercase text-gray-600 dark:text-gray-500 font-bold mb-1">Conteúdo do Plano de Fundo</label>
                                     <select id="new_proj_bg" className="w-full bg-gray-50 dark:bg-[#1e1e1e] border border-gray-300 dark:border-gray-600 rounded p-2 text-gray-900 dark:text-white outline-none focus:border-blue-500">
                                         <option value="white">Branco</option>
                                         <option value="black">Preto</option>
                                         <option value="transparent">Transparente</option>
                                     </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-8">
                            <button onClick={() => setNewProjModal(null)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded">Cancelar</button>
                            <button 
                                onClick={() => {
                                    const w = Number(document.getElementById('new_proj_w').value);
                                    const h = Number(document.getElementById('new_proj_h').value);
                                    const bg = document.getElementById('new_proj_bg').value;
                                    createProject(w, h, name, null, bg);
                                    setNewProjModal(null);
                                }}
                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium shadow-lg transition-transform active:scale-95"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {saveModal && (
                 <SaveModal 
                    project={projects.find(p => p.id === saveModal.projectId)}
                    onClose={() => setSaveModal(null)}
                 />
            )}

            {contextMenu && (
                <div 
                    className="fixed z-[300] bg-white dark:!bg-[#2d2d2d] border border-gray-200 dark:!border-gray-600 rounded shadow-xl py-1 w-48 text-gray-700 dark:!text-gray-200 text-sm"
                    style={{ 
                        top: Math.min(contextMenu.y, window.innerHeight - 320), 
                        left: Math.min(contextMenu.x, window.innerWidth - 200) 
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="px-3 py-2 border-b border-gray-200 dark:!border-gray-700 font-bold bg-gray-100 dark:!bg-[#333]">{contextMenu.title || 'Opções'}</div>
                     <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-colors" onClick={() => {
                        // Keep manual resize modal as an option
                         const l = projects.find(p=>p.id===contextMenu.projectId)?.layers.find(la=>la.id===contextMenu.layerId);
                         if(l) {
                             setResizeModal({ 
                                 projectId: contextMenu.projectId, 
                                 layerId: contextMenu.layerId, 
                                 w: l.w || l.initialImage?.width || 100, 
                                 h: l.h || l.initialImage?.height || 100 
                             });
                         }
                         setContextMenu(null);
                     }}>
                         <i className="fas fa-compress-arrows-alt mr-2"></i> Redimensionar (Manual)
                     </button>
                     <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                     <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-colors" onClick={() => {
                        window.dispatchEvent(new CustomEvent('CLIPBOARD_ACTION', { detail: { action: 'copy', projectId: contextMenu.projectId } }));
                        setContextMenu(null);
                     }}>
                         <i className="fas fa-copy mr-2"></i> Copiar
                     </button>
                     <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-colors" onClick={() => {
                        window.dispatchEvent(new CustomEvent('CLIPBOARD_ACTION', { detail: { action: 'cut', projectId: contextMenu.projectId } }));
                        setContextMenu(null);
                     }}>
                         <i className="fas fa-cut mr-2"></i> Recortar
                     </button>
                     <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-colors" onClick={() => {
                        window.dispatchEvent(new CustomEvent('CLIPBOARD_ACTION', { detail: { action: 'paste', projectId: contextMenu.projectId } }));
                        setContextMenu(null);
                     }}>
                         <i className="fas fa-paste mr-2"></i> Colar
                     </button>
                     <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                     <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-colors" onClick={() => {
                        window.dispatchEvent(new CustomEvent('MERGE_DOWN', { detail: { projectId: contextMenu.projectId, layerId: contextMenu.layerId } }));
                        setContextMenu(null);
                     }}>
                         <i className="fas fa-arrow-down mr-2"></i> Combinar Abaixo
                     </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-600 hover:text-blue-600 dark:hover:text-white transition-colors" onClick={() => setContextMenu(null)}>
                        Cancelar
                    </button>
                </div>
            )}
            
            {contextMenu && <div className="fixed inset-0 z-[290]" onClick={()=>setContextMenu(null)}></div>}
            
            {/* Text Properties Panel */}
            {textEditPanel && (
                <TextPropertiesPanel 
                    layer={projects.find(p => p.id === textEditPanel.projectId)?.layers.find(l => l.id === textEditPanel.layerId)}
                    onUpdate={(updates) => {
                        const project = projects.find(p => p.id === textEditPanel.projectId);
                        if (project) {
                            updateProjectState(project.id, {
                                layers: project.layers.map(l => 
                                    l.id === textEditPanel.layerId ? { ...l, ...updates } : l
                                )
                            });
                        }
                    }}
                    isOpen={textEditPanel.isOpen}
                    onClose={() => setTextEditPanel(null)}
                />
            )}

            {resizeModal && (
                <div className="fixed inset-0 z-[400] bg-black/80 flex items-center justify-center">
                    <div className="bg-[#2d2d2d] p-6 rounded-xl border border-gray-600 w-80">
                        <h3 className="text-white font-bold mb-4">Redimensionar Camada</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div><label className="text-xs text-gray-500">Largura</label><input id="resize_w" type="number" defaultValue={resizeModal.w} className="w-full bg-[#1e1e1e] border border-gray-600 p-2 text-white rounded"/></div>
                            <div><label className="text-xs text-gray-500">Altura</label><input id="resize_h" type="number" defaultValue={resizeModal.h} className="w-full bg-[#1e1e1e] border border-gray-600 p-2 text-white rounded"/></div>
                        </div>
                        <div className="flex justify-end gap-2">
                             <button onClick={()=>setResizeModal(null)} className="px-3 py-1 text-gray-400">Cancelar</button>
                             <button onClick={()=>{
                                 const w = Number(document.getElementById('resize_w').value);
                                 const h = Number(document.getElementById('resize_h').value);
                                 window.dispatchEvent(new CustomEvent('RESIZE_LAYER', { 
                                     detail: { 
                                         projectId: resizeModal.projectId, 
                                         layerId: resizeModal.layerId, 
                                         w, h 
                                     } 
                                 }));
                                 setResizeModal(null);
                             }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Aplicar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProjectWorkspace({ project, isActive, toolsState, onUpdate, onSnapshot, setBrushColor }) {
    const { activeTool, brushSize, brushColor, brushType, tolerance } = toolsState;
    const containerRef = useRef(null);
    const layerRefs = useRef({});
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState(null);

    // Snapshot helper
    const takeSnapshot = useCallback(() => {
        // Capture state of all layers (visibility, etc IS in 'project', but content is in Canvas)
        // We need to store DataURLs for Undo to work on Pixels.
        const layersState = project.layers.map(l => {
            const cvs = layerRefs.current[l.id];
            return {
                id: l.id,
                dataURL: cvs ? cvs.toDataURL() : null,
                ...l
            };
        });
        
        onSnapshot({
             layers: layersState, // This will be stored in history
             selection: project.selection
        });
    }, [project.layers, project.selection, onSnapshot]);

    const handleMouseUpRef = useRef(null);
    useEffect(() => {
        if(isDrawing) {
            const onUp = () => {
                if(handleMouseUpRef.current) handleMouseUpRef.current();
            };
            window.addEventListener('mouseup', onUp);
            return () => window.removeEventListener('mouseup', onUp);
        }
    }, [isDrawing]);

    // Restore from history if needed check
    // If project.historyIndex changed, we might need to restore canvas content.
    // However, handling this reactively is hard because 'project' prop comes from history state already?
    // Yes. If we hit Undo, 'project.layers' comes from history.
    // Those layers need to have their content restored into the CANVAS.
    // The current 'useEffect' at line 323 only restores 'initialImage'.
    // We need a restorer for 'dataURL' if present.

    useEffect(() => {
        // Init Layers
        project.layers.forEach(l => {
            const cvs = layerRefs.current[l.id];
            if (!cvs) return;
            const ctx = cvs.getContext('2d');

            if (l.dataURL) {
                // Restore from history snapshot
                 const img = new Image();
                 img.onload = () => {
                     ctx.clearRect(0, 0, cvs.width, cvs.height);
                     ctx.drawImage(img, 0, 0); // History snapshots are full canvas size usually
                 };
                 img.src = l.dataURL;
            } else if (l.initialImage) {
                 // We always redraw if parameters change (w, h, etc)?
                 // Currently only runs if !initialized. We need to run on resizing too?
                 // But resizing is handled via custom event OR re-render loop if we add 'l.w' dependency.
                 // Actually the useEffect depends on [project.layers]. If 'l.w' changes in state, this runs?
                 // Yes, 'l' is a new object.
                 
                 // Debouncing or check?
                 // Use a requestAnimationFrame approach for smooth resizing usually, but here React effect.
                 // We need to ensure we don't flash.
                 
                //  setTimeout(() => {
                        ctx.clearRect(0, 0, cvs.width, cvs.height); 
                        // Draw with size
                        const w = l.w || l.initialImage.width;
                        const h = l.h || l.initialImage.height;
                        ctx.drawImage(l.initialImage, 0, 0, w, h);
                        l.initialized = true; 
                //  }, 0);
            }
        });
    }, [project.layers]); // Re-run when layers change

    // Listeners for Clipboard/Resize
    useEffect(() => {
        const handleClipboard = (e) => {
            const { action, projectId } = e.detail;
            if(projectId !== project.id) return;

            const selection = project.selection;
            const activeLayerId = project.activeLayerId;
            const cvs = layerRefs.current[activeLayerId];
            if(!cvs) return; // Should alert user?

            const ctx = cvs.getContext('2d');

            if (action === 'copy' || action === 'cut') {
                // Define area
                let x=0, y=0, w=project.dims.w, h=project.dims.h;
                if (selection && selection.w > 0 && selection.h > 0) {
                    x = selection.x; y = selection.y; w = selection.w; h = selection.h;
                }

                try {
                    const data = ctx.getImageData(x, y, w, h);
                    
                    // Apply Mask if present
                    if (selection && selection.mask) {
                        for (let i = 0; i < selection.mask.length; i++) {
                            if (selection.mask[i] === 0) {
                                // Clear pixel (R,G,B,A)
                                const idx = i * 4;
                                data.data[idx + 3] = 0; // Alpha 0
                            }
                        }
                    }

                    // Store in global
                    GLOBAL_CLIPBOARD.data = data;
                    GLOBAL_CLIPBOARD.width = w;
                    GLOBAL_CLIPBOARD.height = h;

                    if (action === 'cut') {
                        // If Mask, only clear masked
                        if (selection && selection.mask) {
                            const currentData = ctx.getImageData(x, y, w, h);
                             for (let i = 0; i < selection.mask.length; i++) {
                                if (selection.mask[i] === 1) {
                                    const idx = i * 4;
                                    currentData.data[idx+3] = 0;
                                }
                            }
                            ctx.putImageData(currentData, x, y);
                        } else {
                            ctx.clearRect(x, y, w, h);
                        }
                        takeSnapshot(); // Update history
                    }
                } catch(err) {
                    console.error("Clipboard error", err);
                }
            } else if (action === 'paste') {
                if (!GLOBAL_CLIPBOARD.data) return;
                
                // Create new layer for paste
                const newId = 'layer-paste-' + Date.now();
                const tempCvs = document.createElement('canvas');
                tempCvs.width = GLOBAL_CLIPBOARD.width;
                tempCvs.height = GLOBAL_CLIPBOARD.height;
                tempCvs.getContext('2d').putImageData(GLOBAL_CLIPBOARD.data, 0, 0);
                
                const img = new Image();
                img.onload = () => {
                     onUpdate({
                        layers: [{ 
                            id: newId, 
                            name: 'Colado', 
                            visible: true, 
                            locked: false, 
                            id: newId, 
                            name: 'Colado', 
                            visible: true, 
                            locked: false, 
                            x: selection ? selection.x : 0, 
                            y: selection ? selection.y : 0,
                            w: img.width, h: img.height,
                            initialImage: img 
                        }, ...project.layers],
                        activeLayerId: newId
                    });
                    // Snapshot will happen after render? No, we need explicit snapshot.
                    // onUpdate triggers re-render. useEffect will draw. 
                };
                img.src = tempCvs.toDataURL();
            }
        };

        const handleResize = (e) => {
            const { projectId, layerId, w, h } = e.detail;
            if (projectId !== project.id) return;
            
            const cvs = layerRefs.current[layerId];
            if(!cvs) return;

            // Resize visually usually means scaling.
            // But 'w,h' inputs usually mean resampling.
            // We need to redraw the canvas content resampled.
            const temp = document.createElement('canvas');
            temp.width = w;
            temp.height = h;
            const tCtx = temp.getContext('2d');
            tCtx.drawImage(cvs, 0, 0, w, h); // Scale
            
            const url = temp.toDataURL();
            const img = new Image();
            img.onload = () => {
                // Update layer
                // We're updating the 'initialImage' effectively or 'dataURL' for restoration
                // We need to update the actual canvas too.
                const lCtx = cvs.getContext('2d');
                lCtx.clearRect(0, 0, cvs.width, cvs.height);
                lCtx.drawImage(img, 0, 0); // Draw at 0,0 (offset is handled by CSS) or center?
                
                // We don't change 'x/y' of layer, just its content size?
                // Wait, canvas size is Project Dims. Content is drawn on it.
                // If we resize the "Layer", do we mean resizing the content pixels? Yes.
                // The main canvas size is fixed.
                
                // We simply drew the scaled image back onto the main canvas.
                takeSnapshot();
            };
            img.src = url;
        };

        const handleGetSelection = (e) => {
             const { projectId, responseEvent } = e.detail;
             if(projectId !== project.id) return;
             
             if(project.selection) {
                  // Capture composite or active layer?
                  // User said "Select part of image". Usually active layer.
                  const cvs = layerRefs.current[project.activeLayerId];
                  if(cvs) {
                      const temp = document.createElement('canvas');
                      temp.width = project.selection.w;
                      temp.height = project.selection.h;
                      temp.getContext('2d').drawImage(cvs, 
                          project.selection.x, project.selection.y, project.selection.w, project.selection.h,
                          0, 0, project.selection.w, project.selection.h
                      );
                      window.dispatchEvent(new CustomEvent(responseEvent, {
                          detail: { imgData: temp.toDataURL(), w:temp.width, h:temp.height }
                      }));
                  }
             }
        };

        const handleMergeDown = (e) => {
            const { projectId, layerId } = e.detail;
            if(projectId !== project.id) return;
            
            const topIndex = project.layers.findIndex(l => l.id === layerId);
            if (topIndex === -1 || topIndex >= project.layers.length - 1) return; // Cant merge bottom
            
            const bottomIndex = topIndex + 1;
            const topLayer = project.layers[topIndex];
            const bottomLayer = project.layers[bottomIndex];
            
            // Validate canvases
            const cvsTop = layerRefs.current[topLayer.id];
            const cvsBottom = layerRefs.current[bottomLayer.id];
            
            if (!cvsTop || !cvsBottom) return;
            
            // Create composite canvas (Project Size)
            const canvas = document.createElement('canvas');
            canvas.width = project.dims.w;
            canvas.height = project.dims.h;
            const ctx = canvas.getContext('2d');
            
            // 1. Draw Bottom Layer (Base)
            ctx.globalAlpha = bottomLayer.opacity !== undefined ? bottomLayer.opacity : 1;
            ctx.drawImage(cvsBottom, bottomLayer.x || 0, bottomLayer.y || 0);
            
            // 2. Apply Top Layer
            if (topLayer.type === 'effect') {
                // Smart Merge: Apply Top Effect TO the Bottom Layer content
                // This ensures "summing" behavior even if they were siblings
                
                const tempCvs = document.createElement('canvas');
                tempCvs.width = topLayer.w;
                tempCvs.height = topLayer.h;
                const tempCtx = tempCvs.getContext('2d');
                
                // Draw the underlying content (from main canvas) into temp, applying filter
                // We capture the region defined by the Top Layer
                const intensity = topLayer.intensity !== undefined ? topLayer.intensity : 0.5;
                const filterType = topLayer.filterType;
                const filterCss = (filterType && FILTERS[filterType]) ? FILTERS[filterType].css(intensity) : topLayer.filterCss;

                if (filterCss === 'webgl-glfx') {
                    // GENERIC GLFX SHADER
                    const definition = FILTERS[filterType];
                    const shaderSource = definition ? GlfxShaderLibrary[definition.shader] : null;

                    if (definition && shaderSource) {
                        const glCanvas = document.createElement('canvas');
                        glCanvas.width = topLayer.w;
                        glCanvas.height = topLayer.h;
                        const gl = glCanvas.getContext('webgl');
                        
                        if (gl) {
                             const createShader = (gl, type, source) => {
                                const shader = gl.createShader(type);
                                gl.shaderSource(shader, source);
                                gl.compileShader(shader);
                                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                                    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                                    gl.deleteShader(shader);
                                    return null;
                                }
                                return shader;
                            };

                            const vertexShader = createShader(gl, gl.VERTEX_SHADER, GlfxShaderLibrary.vertex);
                            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shaderSource);

                            if (vertexShader && fragmentShader) {
                                const program = gl.createProgram();
                                gl.attachShader(program, vertexShader);
                                gl.attachShader(program, fragmentShader);
                                gl.linkProgram(program);
                                gl.useProgram(program);

                                const positionLocation = gl.getAttribLocation(program, "a_position");
                                const buffer = gl.createBuffer();
                                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
                                gl.enableVertexAttribArray(positionLocation);
                                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

                                // Texture
                                const sourceTemp = document.createElement('canvas');
                                sourceTemp.width = topLayer.w;
                                sourceTemp.height = topLayer.h;
                                const sourceCtx = sourceTemp.getContext('2d');
                                sourceCtx.drawImage(canvas, topLayer.x || 0, topLayer.y || 0, topLayer.w, topLayer.h, 0, 0, topLayer.w, topLayer.h);

                                const texture = gl.createTexture();
                                gl.bindTexture(gl.TEXTURE_2D, texture);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceTemp);

                                // Uniforms
                                const uniforms = definition.getUniforms(intensity);
                                // Inject texture size if needed
                                if (uniforms.u_texSize) uniforms.u_texSize = [topLayer.w, topLayer.h];
                                
                                Object.keys(uniforms).forEach(key => {
                                    const loc = gl.getUniformLocation(program, key);
                                    if (loc) {
                                        const val = uniforms[key];
                                        if (Array.isArray(val)) {
                                            if (val.length === 2) gl.uniform2f(loc, val[0], val[1]);
                                            if (val.length === 3) gl.uniform3f(loc, val[0], val[1], val[2]);
                                        } else {
                                            gl.uniform1f(loc, val);
                                        }
                                    }
                                });

                                gl.viewport(0, 0, glCanvas.width, glCanvas.height);
                                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                                
                                // Copy back
                                ctx.clearRect(topLayer.x || 0, topLayer.y || 0, topLayer.w, topLayer.h); 
                                ctx.drawImage(glCanvas, topLayer.x || 0, topLayer.y || 0);
                            }
                        }
                    }
                } else if (filterCss === 'webgl-fracture') {
                    // WEBGL RENDER FOR MERGE
                    // Use a FRESH canvas for WebGL context to avoid conflict
                    const glCanvas = document.createElement('canvas');
                    glCanvas.width = topLayer.w;
                    glCanvas.height = topLayer.h;
                    const gl = glCanvas.getContext('webgl');
                     if (gl) {
                        const createShader = (gl, type, source) => {
                            const shader = gl.createShader(type);
                            gl.shaderSource(shader, source);
                            gl.compileShader(shader);
                            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                                console.error('Merge Shader compile error:', gl.getShaderInfoLog(shader));
                                gl.deleteShader(shader);
                                return null;
                            }
                            return shader;
                        };
            
                        const vertexShader = createShader(gl, gl.VERTEX_SHADER, FractureShader.vertex);
                        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FractureShader.fragment);
                        
                        if (vertexShader && fragmentShader) {
                            const program = gl.createProgram();
                            gl.attachShader(program, vertexShader);
                            gl.attachShader(program, fragmentShader);
                            gl.linkProgram(program);
            
                            if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
                                gl.useProgram(program);
                   
                                const positionLocation = gl.getAttribLocation(program, "a_position");
                                const buffer = gl.createBuffer();
                                gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
                                gl.enableVertexAttribArray(positionLocation);
                                gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
        
                                // Prepare Source Texture from CURRENT COMPOSITE CANVAS
                                const sourceTemp = document.createElement('canvas');
                                sourceTemp.width = topLayer.w;
                                sourceTemp.height = topLayer.h;
                                const sourceCtx = sourceTemp.getContext('2d');
                                sourceCtx.drawImage(canvas, 
                                    topLayer.x || 0, topLayer.y || 0, topLayer.w, topLayer.h, 
                                    0, 0, topLayer.w, topLayer.h
                                );
        
                                const texture = gl.createTexture();
                                gl.bindTexture(gl.TEXTURE_2D, texture);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceTemp);
        
                                // Uniforms
                                const uClickRandomizer = gl.getUniformLocation(program, "u_click_randomizer");
                                const uEffect = gl.getUniformLocation(program, "u_effect");
                                const uEffectActive = gl.getUniformLocation(program, "u_effect_active");
                                const uEdgeThickness = gl.getUniformLocation(program, "u_edge_thickness");
                                const uPointer = gl.getUniformLocation(program, "u_pointer_position");
        
                                // Draw
                                gl.viewport(0, 0, glCanvas.width, glCanvas.height);
                                const seed = (parseInt(topLayer.id.replace(/\D/g,'') || '0') % 100) / 100;
        
                                gl.uniform1f(uClickRandomizer, seed + 0.332); 
                                // Map intensity 0-1 to 0-0.05 effect strength
                                // Default was 0.015. 
                                // Let's simplify: Max fracture is 0.04.
                                const intensity = topLayer.intensity !== undefined ? topLayer.intensity : 0.5;
                                // let's simplify: Max fracture is 0.04.
                                // const intensity = topLayer.intensity !== undefined ? topLayer.intensity : 0.5;
                                
                                gl.uniform1f(uEffect, intensity * 0.04);
                                gl.uniform1f(uEffectActive, 1.0);
                                gl.uniform1f(uEdgeThickness, 0.006);
                                gl.uniform2f(uPointer, 0.55, 0.5); 
        
                                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

                                // Copy result back to main context
                                ctx.clearRect(topLayer.x || 0, topLayer.y || 0, topLayer.w, topLayer.h); 
                                ctx.drawImage(glCanvas, topLayer.x || 0, topLayer.y || 0);
                            }
                        }
                    }
                } else {
                    // STANDARD 2D FILTER MERGE
                    tempCtx.filter = filterCss;
                    tempCtx.drawImage(canvas, 
                        topLayer.x || 0, topLayer.y || 0, topLayer.w, topLayer.h, // Source rect (Project Coords)
                        0, 0, topLayer.w, topLayer.h // Dest rect
                    );
                    
                    // Draw filtered result back
                    ctx.globalAlpha = topLayer.opacity !== undefined ? topLayer.opacity : 1;
                    ctx.clearRect(topLayer.x || 0, topLayer.y || 0, topLayer.w, topLayer.h); 
                    ctx.drawImage(tempCvs, topLayer.x || 0, topLayer.y || 0);
                }
                
            } else {
                // Standard Image Merge (Top over Bottom)
                ctx.globalAlpha = topLayer.opacity !== undefined ? topLayer.opacity : 1;
                ctx.drawImage(cvsTop, topLayer.x || 0, topLayer.y || 0);
            }
            
            const newDataUrl = canvas.toDataURL();
            const img = new Image();
            img.onload = () => {
                const newId = 'layer-merged-' + Date.now();
                const newLayer = {
                     id: newId,
                     name: `Combinado (${topLayer.name} + ${bottomLayer.name})`,
                     visible: true,
                     locked: false,
                     x: 0, 
                     y: 0,
                     w: project.dims.w,
                     h: project.dims.h,
                     initialImage: img,
                     dataURL: newDataUrl
                };
                
                // Construct new layers list
                const newLayers = [...project.layers];
                newLayers.splice(topIndex, 2, newLayer); // Remove top and bottom, insert new
                
                // Re-link dependencies
                const fixedLayers = newLayers.map(l => {
                    if (l.linkedTo === topLayer.id || l.linkedTo === bottomLayer.id) {
                        return { ...l, linkedTo: newId };
                    }
                    return l;
                });
                
                onUpdate({
                    layers: fixedLayers,
                    activeLayerId: newId
                }, true); // Save history
            };
            img.src = newDataUrl;
        };

        window.addEventListener('CLIPBOARD_ACTION', handleClipboard);
        window.addEventListener('RESIZE_LAYER', handleResize);
        window.addEventListener('GET_SELECTION_DATA', handleGetSelection);
        window.addEventListener('MERGE_DOWN', handleMergeDown);
        return () => {
            window.removeEventListener('CLIPBOARD_ACTION', handleClipboard);
            window.removeEventListener('RESIZE_LAYER', handleResize);
            window.removeEventListener('GET_SELECTION_DATA', handleGetSelection);
            window.removeEventListener('MERGE_DOWN', handleMergeDown);
        };
    }, [project]);

    // SAVE LISTENER
    useEffect(() => {
        const handleSaveRequest = (e) => {
            const { projectId, format, quality, bg } = e.detail;
            if(projectId !== project.id) return;

            const canvas = document.createElement('canvas');
            canvas.width = project.dims.w;
            canvas.height = project.dims.h;
            const ctx = canvas.getContext('2d');
            
            if(project.filter && project.filter !== '') {
                ctx.filter = project.filter; 
            }

            if(bg === 'white') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0,0,canvas.width, canvas.height);
            } else if (bg === 'black') {
                ctx.fillStyle = '#000000';
                ctx.fillRect(0,0,canvas.width, canvas.height);
            }

            // Draw layers bottom to top (reverse of layers array)
            const layersToDraw = [...project.layers].reverse();
            layersToDraw.forEach(l => {
                if(l.visible && layerRefs.current[l.id]) {
                    // Draw with offset
                    ctx.drawImage(layerRefs.current[l.id], l.x || 0, l.y || 0);
                }
            });

            const link = document.createElement('a');
            link.download = `${project.name}.${format}`;
            link.href = canvas.toDataURL(`image/${format}`, quality);
            link.click();
        };

        window.addEventListener('TRIGGER_SAVE_PROJECT', handleSaveRequest);
        return () => window.removeEventListener('TRIGGER_SAVE_PROJECT', handleSaveRequest);
    }, [project]);

    const getCoords = (e) => {
        const cvs = layerRefs.current[project.activeLayerId];
        if(!cvs) return { x:0, y:0 };
        const rect = cvs.getBoundingClientRect();
        // Adjust for layer offset? No, mouse is relative to canvas container.
        // Wait, if canvas moves, rect moves.
        // But getCoords expects coords relative to the *content* logic?
        // Actually, we want drawing to happen at mouse pos relative to the Canvas Element itself.
        // If the Canvas Element is moved via CSS (top/left), getBoundingClientRect() reflects that.
        // So (e.clientX - rect.left) returns x relative to the top-left of the literal canvas element.
        // This is correct for drawing ON the canvas.
        const scaleX = project.dims.w / rect.width;
        const scaleY = project.dims.h / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e) => {
        if (e.button === 2) return; // Ignore right-click
        if (!isActive || !project.activeLayerId) return;
        const layer = project.layers.find(l => l.id === project.activeLayerId);
        if(!layer?.visible) return;

        if (layer.locked) {
            alert("Camada bloqueada!");
            return;
        }

        if (layer.locked) {
            alert("Camada bloqueada!");
            return;
        }
        
        // Handle Bucket & Magic Wand
        if (toolsState.activeTool === TOOLS.BUCKET || toolsState.activeTool === TOOLS.MAGIC_WAND) {
            const pos = getCoords(e);
            
            // Get Image Data
            const cvs = layerRefs.current[project.activeLayerId];
            const ctx = cvs.getContext('2d');
            const w = cvs.width;
            const h = cvs.height;
            const imageData = ctx.getImageData(0, 0, w, h);
            
            // Perform Flood Fill
            // If Bucket: Write color
            // If Wand: Find bounds
            
            const startX = Math.floor(pos.x);
            const startY = Math.floor(pos.y);
            
            if(startX < 0 || startX >= w || startY < 0 || startY >= h) return;
            
            const bounds = floodFillMask(imageData, startX, startY, toolsState.brushColor, toolsState.tolerance, toolsState.activeTool === TOOLS.BUCKET);
            
            if (toolsState.activeTool === TOOLS.BUCKET) {
                ctx.putImageData(imageData, 0, 0);
                takeSnapshot();
            } else {
                // Magic Wand: Set Selection to Bounds
                if (bounds) {
                    let newSelection = {
                         x: 0,
                         y: 0,
                         w: w,
                         h: h,
                         mask: bounds.mask // Full size mask
                    };

                    // Handle Merge (Shift Key)
                    if (e.shiftKey && project.selection && project.selection.mask) {
                        const prevMask = project.selection.mask;
                        const newMask = bounds.mask;
                        const combinedMask = new Uint8Array(w * h);
                        // Merge
                        for(let i=0; i<w*h; i++) {
                            combinedMask[i] = prevMask[i] | newMask[i];
                        }
                        newSelection.mask = combinedMask;
                    }
                    
                    onUpdate({ selection: newSelection }, true); // Save history
                }
            }
            return;
        }

        if (toolsState.activeTool === TOOLS.MOVE) {
            // Start Move
            setLastPos({ x: e.clientX, y: e.clientY, originX: layer.x || 0, originY: layer.y || 0 });
            setIsDrawing(true);
        } else if (activeTool === TOOLS.MARQUEE) {
            const pos = getCoords(e);
            onUpdate({ selection: { x: pos.x, y: pos.y, w: 0, h: 0 } });
            setIsDrawing(true);
            setLastPos(pos); // Origin of selection
        } else if (activeTool === TOOLS.DRAW) {
            setIsDrawing(true);
            const pos = getCoords(e);
            setLastPos(pos);
            draw(pos, pos);
        } else if (activeTool === TOOLS.TEXT) {
            const pos = getCoords(e);
            
            // Create new text layer
            const newTextLayerId = 'text-' + Date.now() + Math.random();
            const newTextLayer = {
                id: newTextLayerId,
                type: 'text',
                name: 'Texto',
                visible: true,
                locked: false,
                opacity: 1,
                x: pos.x,
                y: pos.y,
                rotation: 0,
                text: 'Digite aqui',
                fontSize: 32,
                fontFamily: 'Arial',
                color: brushColor,
                bold: false,
                italic: false,
                textTransform: 'none',
                letterSpacing: 0,
                lineHeight: 1.2,
                textAlign: 'left',
                textShadow: {
                    enabled: false,
                    offsetX: 2,
                    offsetY: 2,
                    blur: 4,
                    color: '#000000'
                }
            };
            
            // Add layer to project
            onUpdate({
                layers: [...project.layers, newTextLayer],
                activeLayerId: newTextLayerId
            });
            
            // Open text edit panel
            window.dispatchEvent(new CustomEvent('OPEN_TEXT_PANEL', { 
                detail: { layerId: newTextLayerId, projectId: project.id } 
            }));
            
            takeSnapshot();
        } else if (activeTool === TOOLS.EYEDROPPER) {
             const pos = getCoords(e);
             const cvs = layerRefs.current[project.activeLayerId];
             if(cvs) {
                 const ctx = cvs.getContext('2d');
                 const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
                 const hex = "#" + [p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('');
                 setBrushColor(hex);
             }
         } else if (activeTool === TOOLS.ERASER) {
              setIsDrawing(true);
              const pos = getCoords(e);
              setLastPos(pos);
              draw(pos, pos);
         }
    };
    


    const draw = (pos, fromPos = lastPos) => {
        if (!fromPos) return; // Safety check
        const ctx = layerRefs.current[project.activeLayerId].getContext('2d');
        ctx.beginPath();
        ctx.moveTo(fromPos.x, fromPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = toolsState.brushSize;
        
        if (toolsState.activeTool === TOOLS.ERASER) {
            ctx.globalCompositeOperation = 'destination-out';
        } else {
            ctx.globalCompositeOperation = 'source-over';
        }
        
        /* ctx.lineWidth set above */
        
        if (toolsState.brushType === 'square') {
            ctx.lineCap = 'butt'; // Manual square? Or 'square'? 'square' adds box at end.
            // Actually standard square brush usually means square shape.
            // 'square' lineCap adds a square of height=width/2 at end.
            // We want a square stamp.
            // For continuous stroke, 'butt' is better, but turns handling is bad.
            // Let's use 'square' for now.
            ctx.lineCap = 'square';
            ctx.lineJoin = 'miter';
        } else if (toolsState.brushType === 'airbrush') {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowBlur = toolsState.brushSize;
            ctx.shadowColor = toolsState.brushColor;
        } else {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.shadowBlur = 0;
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset
        setLastPos(pos);
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            setIsDrawing(false);
            if (activeTool === TOOLS.DRAW || activeTool === TOOLS.MOVE) {
                takeSnapshot();
            }
            // Marquee finished
            if (activeTool === TOOLS.MARQUEE) {
                takeSnapshot();
            }
        }
    };

    handleMouseUpRef.current = handleMouseUp;

    const handleMouseMove = (e) => {
        if(!isDrawing) return;

        if (activeTool === TOOLS.MOVE && lastPos) {
            // Moving Layer
            const dx = (e.clientX - lastPos.x) / (project.zoom / 100);
            const dy = (e.clientY - lastPos.y) / (project.zoom / 100);
            
            // Should we update state continuously or just on MouseUp?
            // Continuous is better for smooth drag, but heavy on React.
            // But we already committed to this path.
            onUpdate({
                layers: project.layers.map(l => l.id === project.activeLayerId ? 
                    { ...l, x: lastPos.originX + dx, y: lastPos.originY + dy } 
                    : l)
            });
            return;
        }

        const pos = getCoords(e);

        if (activeTool === TOOLS.MARQUEE && lastPos) {
             const w = pos.x - lastPos.x;
             const h = pos.y - lastPos.y;
             // Ensure w/h are positive for rect? No, can be negative.
             // Normalize for display
             onUpdate({
                 selection: {
                     x: w < 0 ? pos.x : lastPos.x,
                     y: h < 0 ? pos.y : lastPos.y,
                     w: Math.abs(w),
                     h: Math.abs(h)
                 }
             });
             return;
        }

        draw(pos);
    };

    const onContextMenu = (e) => {
        e.preventDefault();
        // Identify if clicked on canvas (general) or specific layer?
        // Right now just Canvas context.
        if (!project) return;
        // Dispatch event to show menu in parent
        const activeLayerId = project.activeLayerId;
        // Hack: Use window global to set state in parent or pass callback?
        // We can't access parent 'setContextMenu'.
        // Better: Use a project-level callback if available?
        // No, we didn't pass one.
        // We will dispatch a CustomEvent.
        window.dispatchEvent(new CustomEvent('SHOW_CONTEXT_MENU', { detail: { 
            x: e.clientX, y: e.clientY, projectId: project.id, activeLayerId 
        }}));
    };

    const [resizing, setResizing] = useState(null);

    const handleResizeStart = (e, handle, layer) => {
        e.stopPropagation();
        e.preventDefault();
        setResizing({
            handle,
            startX: e.clientX,
            startY: e.clientY,
            startW: layer.w || layer.initialImage?.width || 100,
            startH: layer.h || layer.initialImage?.height || 100,
            startLayerX: layer.x || 0,
            startLayerY: layer.y || 0,
            ratio: (layer.w || layer.initialImage?.width) / (layer.h || layer.initialImage?.height)
        });
    };

    useEffect(() => {
        const handleGlobalMove = (e) => {
             if(resizing) {
                 const zoomFactor = project.zoom / 100;
                 const dx = (e.clientX - resizing.startX) / zoomFactor;
                 const dy = (e.clientY - resizing.startY) / zoomFactor;
                 
                 let newW = resizing.startW;
                 let newH = resizing.startH;
                 let newX = resizing.startLayerX;
                 let newY = resizing.startLayerY;

                 const isCtrl = e.ctrlKey || e.metaKey;

                 if (resizing.handle.includes('e')) {
                     newW = resizing.startW + dx;
                 }
                 if (resizing.handle.includes('w')) {
                     newW = resizing.startW - dx;
                     newX = resizing.startLayerX + dx;
                 }
                 if (resizing.handle.includes('s')) {
                     newH = resizing.startH + dy;
                 }
                 if (resizing.handle.includes('n')) {
                     newH = resizing.startH - dy;
                     newY = resizing.startLayerY + dy;
                 }

                 if (isCtrl) {
                     if (resizing.handle.includes('e') || resizing.handle.includes('w')) {
                         newH = newW / resizing.ratio;
                         if (resizing.handle.includes('n')) {
                             newY = resizing.startLayerY + (resizing.startH - newH);
                         } 
                     } else {
                         newW = newH * resizing.ratio;
                         if (resizing.handle.includes('w')) {
                             newX = resizing.startLayerX + (resizing.startW - newW);
                         }
                     }
                 }

                 onUpdate({
                     layers: project.layers.map(l => l.id === project.activeLayerId ? {
                         ...l,
                         w: Math.max(10, newW),
                         h: Math.max(10, newH),
                         x: newX,
                         y: newY
                     } : l)
                 });
             }
        };
        const handleGlobalUp = () => {
            if(resizing) {
                setResizing(null);
                takeSnapshot();
            }
        };

        if(resizing) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
        };
    }, [resizing, project.zoom]);

    return (
        <div 
            className={`absolute inset-0 overflow-auto flex items-center justify-center p-8 bg-gray-300 dark:bg-[#121212] ${isActive ? 'z-10' : 'z-0 invisible pointer-events-none'}`}
            ref={containerRef}
        >
            <div 
                className={`relative shadow-2xl transition-transform duration-200 bg-white`}
                style={{
                    width: project.dims.w,
                    height: project.dims.h,
                    transform: `scale(${project.zoom / 100})`,
                    transformOrigin: 'center center',
                    filter: project.filter,
                    cursor: (() => {
                        const url = (name) => `url('https://img.icons8.com/ios-filled/24/ffffff/${name}.png')`;
                        switch(activeTool) {
                             case TOOLS.MOVE: return `${url('hand')} 12 12, move`;
                             case TOOLS.MAGIC_WAND: return `${url('fantasy')} 2 2, default`;
                             case TOOLS.MARQUEE: return `${url('select-cursor')} 12 12, crosshair`;
                             case TOOLS.DRAW: return `${url('paint')} 2 22, crosshair`;
                             case TOOLS.ERASER: return `${url('eraser')} 12 12, cell`;
                             case TOOLS.EYEDROPPER: return `${url('dropper')} 2 22, crosshair`;
                             case TOOLS.BUCKET: return `${url('fill-color')} 2 22, default`;
                             case TOOLS.TEXT: return 'text';
                             default: return 'default';
                        }
                    })()
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onContextMenu={onContextMenu}
            >
                <div className="absolute inset-0 pointer-events-none" style={{
                    backgroundImage: 'conic-gradient(#e5e7eb 90deg, #ffffff 90deg 180deg, #e5e7eb 180deg 270deg, #ffffff 270deg)',
                    backgroundSize: '20px 20px'
                }}></div>

                {[...project.layers].reverse().map((layer, idx) => {
                    if (layer.type === 'effect') {
                        // Effect rendering
                        const linkedLayer = project.layers.find(l => l.id === layer.linkedTo);
                        // If linked layer exists and is visible (or even if not? Usually if source hidden, effect hidden)
                        if (!linkedLayer || !layer.visible) return null;
                        
                        // We need to fetch the SOURCE content.
                        // Ideally we use the ALREADY RENDERED canvas of the source layer.
                        // But in React loop, Refs might be ready.
                        const sourceCvs = layerRefs.current[linkedLayer.id];
                        if (!sourceCvs) return null;

                        return (
                            <div 
                                key={layer.id}
                                className="absolute pointer-events-none"
                                style={{
                                    left: layer.x,
                                    top: layer.y,
                                    width: layer.w,
                                    height: layer.h,
                                    zIndex: idx,
                                    opacity: (typeof layer.opacity === 'number' && !isNaN(layer.opacity)) ? layer.opacity : 1
                                }}
                            >
                                <EffectRenderer 
                                    layer={layer} 
                                    sourceCvs={sourceCvs}
                                    sourceLayer={linkedLayer} 
                                    project={project}
                                    onRef={(el) => layerRefs.current[layer.id] = el}
                                />
                            </div>
                        );
                    }
                    
                    // Text layer rendering
                    if (layer.type === 'text') {
                        if (!layer.visible) return null;
                        
                        const textStyle = {
                            position: 'absolute',
                            left: layer.x,
                            top: layer.y,
                            zIndex: idx,
                            opacity: (typeof layer.opacity === 'number' && !isNaN(layer.opacity)) ? layer.opacity : 1,
                            transform: `rotate(${layer.rotation || 0}deg)`,
                            transformOrigin: 'top left',
                            fontSize: `${layer.fontSize}px`,
                            fontFamily: layer.fontFamily,
                            color: layer.color,
                            fontWeight: layer.bold ? 'bold' : 'normal',
                            fontStyle: layer.italic ? 'italic' : 'normal',
                            textTransform: layer.textTransform,
                            letterSpacing: `${layer.letterSpacing}px`,
                            lineHeight: layer.lineHeight,
                            textAlign: layer.textAlign,
                            whiteSpace: 'pre-wrap',
                            pointerEvents: activeTool === TOOLS.MOVE && project.activeLayerId === layer.id ? 'auto' : 'none',
                            cursor: activeTool === TOOLS.MOVE && project.activeLayerId === layer.id ? 'move' : 'default',
                            userSelect: 'none'
                        };
                        
                        if (layer.textShadow?.enabled) {
                            textStyle.textShadow = `${layer.textShadow.offsetX}px ${layer.textShadow.offsetY}px ${layer.textShadow.blur}px ${layer.textShadow.color}`;
                        }
                        
                        return (
                            <div
                                key={layer.id}
                                style={textStyle}
                                onMouseDown={(e) => {
                                    if (activeTool === TOOLS.MOVE && project.activeLayerId === layer.id) {
                                        e.stopPropagation();
                                        // Movement will be handled by existing MOVE logic
                                    }
                                }}
                            >
                                {layer.text}
                            </div>
                        );
                    }
                    
                    return (
                        <canvas 
                            key={layer.id}
                            ref={el => layerRefs.current[layer.id] = el}
                            width={project.dims.w}
                            height={project.dims.h}
                            className="absolute top-0 left-0 w-full h-full object-contain"
                            style={{ 
                                zIndex: idx, 
                                opacity: layer.visible ? ((typeof layer.opacity === 'number' && !isNaN(layer.opacity)) ? layer.opacity : 1) : 0, 
                                transform: `translate(${layer.x || 0}px, ${layer.y || 0}px)`,
                                pointerEvents: 'none' 
                            }} 
                        />
                    );
                })}

                {/* Resize Handles (Overlay on active layer) */}
                {project.activeLayerId && activeTool === TOOLS.RESIZE && !project.layers.find(l=>l.id===project.activeLayerId)?.locked && (() => {
                    const l = project.layers.find(l=>l.id===project.activeLayerId);
                    if(!l) return null;
                    const w = l.w || l.initialImage?.width || 100;
                    const h = l.h || l.initialImage?.height || 100;
                    
                    return (
                        <div 
                            className="absolute border-2 border-blue-500 z-50 pointer-events-none"
                            style={{
                                transform: `translate(${l.x||0}px, ${l.y||0}px)`,
                                width: w,
                                height: h,
                                left: 0, top: 0
                            }}
                        >
                            {/* Corners */}
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-nw-resize pointer-events-auto" onMouseDown={(e)=>handleResizeStart(e, 'nw', l)}></div>
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-ne-resize pointer-events-auto" onMouseDown={(e)=>handleResizeStart(e, 'ne', l)}></div>
                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-sw-resize pointer-events-auto" onMouseDown={(e)=>handleResizeStart(e, 'sw', l)}></div>
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-se-resize pointer-events-auto" onMouseDown={(e)=>handleResizeStart(e, 'se', l)}></div>
                            {/* Sides - Optional, kept simple for now or adding if needed. User asked for 'arestas ou lateral' */}
                            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-w-resize pointer-events-auto -mt-1.5" onMouseDown={(e)=>handleResizeStart(e, 'w', l)}></div>
                            <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-e-resize pointer-events-auto -mt-1.5" onMouseDown={(e)=>handleResizeStart(e, 'e', l)}></div>
                            <div className="absolute -top-1.5 left-1/2 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-n-resize pointer-events-auto -ml-1.5" onMouseDown={(e)=>handleResizeStart(e, 'n', l)}></div>
                            <div className="absolute -bottom-1.5 left-1/2 w-3 h-3 bg-white border border-blue-500 rounded-full cursor-s-resize pointer-events-auto -ml-1.5" onMouseDown={(e)=>handleResizeStart(e, 's', l)}></div>
                        </div>
                    );
                })()}

                {project.selection && project.selection.w > 0 && (
                    <>
                        {/* Standard Box Selection (No Mask) */}
                        {!project.selection.mask && (
                            <div 
                                className="absolute border-2 border-white border-dashed shadow-[0_0_0_1px_black] z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
                                style={{
                                    left: project.selection.x,
                                    top: project.selection.y,
                                    width: project.selection.w,
                                    height: project.selection.h
                                }}
                                draggable="true"
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('application/json', JSON.stringify({ 
                                        type: 'selection',
                                        sourceProjectId: project.id
                                    }));
                                }}
                            ></div>
                        )}
                        {/* Mask Selection (Magic Wand) */}
                        {project.selection.mask && (
                             <SelectionOverlay selection={project.selection} zoom={project.zoom} project={project} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

// FLOOD FILL ALGORITHM
const floodFill = (imageData, startX, startY, hexColor, tolerance, isFill) => {
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    
    // Parse target color
    const rT = parseInt(hexColor.slice(1,3), 16);
    const gT = parseInt(hexColor.slice(3,5), 16);
    const bT = parseInt(hexColor.slice(5,7), 16);
    // const aT = 255;
    
    // Get start pixel color
    const startPos = (startY * w + startX) * 4;
    const r0 = data[startPos];
    const g0 = data[startPos + 1];
    const b0 = data[startPos + 2];
    const a0 = data[startPos + 3];
    
    // If fill color is same as start, and high alpha, abort?
    // But tolerance matters.
    if(isFill && Math.abs(r0-rT) < 5 && Math.abs(g0-gT) < 5 && Math.abs(b0-bT) < 5 && a0 > 250) return null;
    
    const stack = [[startX, startY]];
    
    // Track bounds
    let minX = w, maxX = 0, minY = h, maxY = 0;
    
    // Visited set? Data itself can be visited if we change it.
    // If Wand (no change), we need visited array.
    // Uint8Array for visited is efficient.
    const visited = new Uint8Array(w * h);
    
    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const pos = (y * w + x) * 4;
        const vPos = y * w + x;
        
        if (visited[vPos]) continue;
        
        // Check color match
        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];
        const a = data[pos + 3];
        
        // Difference
        const diff = (Math.abs(r - r0) + Math.abs(g - g0) + Math.abs(b - b0) + Math.abs(a - a0)) / 4;
        
        if (diff <= tolerance) {
            // Match
            visited[vPos] = 1;
            
            if (isFill) {
                data[pos] = rT;
                data[pos+1] = gT;
                data[pos+2] = bT;
                data[pos+3] = 255; // Force opaque fill for now
            }
            
            // Bounds update
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            
            // Add neighbors
            if (x > 0) stack.push([x - 1, y]);
            if (x < w - 1) stack.push([x + 1, y]);
            if (y > 0) stack.push([x, y - 1]);
            if (y < h - 1) stack.push([x, y + 1]);
        }
    }
    
    return { minX, minY, maxX, maxY };
};

// Helper Component for Color Picker
const ColorPickerUI = ({ brushColor, setBrushColor }) => {
    const [mode, setMode] = useState('RGB');

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };

    const componentToHex = (c) => {
        const hex = Math.max(0, Math.min(255, Math.round(c))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    const rgbToHex = (r, g, b) => {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    };

    const rgb = hexToRgb(brushColor);

    const updateRGB = (key, value) => {
        const newRgb = { ...rgb, [key]: Number(value) };
        setBrushColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    };

    return (
        <div className="space-y-3 select-none">
            {/* Swatch & Hex */}
            <div className="flex gap-3 mb-2">
                <div 
                    className="w-12 h-12 rounded border border-gray-300 dark:border-gray-600 shadow-inner" 
                    style={{backgroundColor: brushColor}}
                ></div>
                <div className="flex-1 flex flex-col gap-1 justify-center">
                    <div className="flex bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded p-1 items-center">
                         <span className="text-black dark:text-white text-xs px-1">#</span>
                         <input 
                            type="text" 
                            value={brushColor.replace('#', '')}
                            maxLength={6}
                            onChange={(e) => {
                                const val = e.target.value;
                                if(/^[0-9A-Fa-f]*$/.test(val)) {
                                    setBrushColor('#' + val);
                                }
                            }}
                            className="bg-transparent w-full text-xs text-black dark:text-white outline-none font-mono uppercase"
                         />
                    </div>
                    {/* Mode Switcher */}
                    <div className="flex gap-1">
                        <button onClick={()=>setMode('RGB')} className={`flex-1 text-[10px] rounded py-0.5 ${mode==='RGB'?'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white':'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>RGB</button>
                        <button onClick={()=>setMode('PALETTE')} className={`flex-1 text-[10px] rounded py-0.5 ${mode==='PALETTE'?'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white':'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>Paleta</button>
                    </div>
                </div>
            </div>

            {mode === 'RGB' && (
                <div className="space-y-2">
                    {['r', 'g', 'b'].map(c => (
                        <div key={c} className="flex items-center gap-2">
                             <span className="text-[10px] uppercase font-bold text-gray-800 dark:text-gray-100 w-3">{c}</span>
                             <div className="flex-1 flex items-center">
                                 <input 
                                    type="range" min="0" max="255" 
                                    value={rgb[c]} 
                                    onChange={(e)=>updateRGB(c, e.target.value)}
                                    className="w-full h-2 rounded-full appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:shadow-md"
                                    style={{
                                        background: c === 'r' ? `linear-gradient(90deg, #000, #ff0000)` : c === 'g' ? `linear-gradient(90deg, #000, #00ff00)` : `linear-gradient(90deg, #000, #0000ff)`
                                    }}
                                 />
                             </div>
                             <input 
                                type="number" 
                                min="0" max="255" 
                                value={rgb[c]}
                                onChange={(e)=>updateRGB(c, e.target.value)}
                                className="w-12 bg-transparent border border-gray-300 dark:border-gray-600 rounded px-1 text-center text-xs text-gray-800 dark:text-gray-100 outline-none no-spinner appearance-none"
                             />
                        </div>
                    ))}
                    {/* Spectrum Bar */}
                     <div className="h-3 w-full rounded mt-2 border border-gray-600 relative cursor-pointer" style={{background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'}}
                        onClick={(e) => {
                            const rect = e.target.getBoundingClientRect();
                            const x = e.clientX - rect.left;
                            const percent = x / rect.width;
                            // Approximate HSV hue to RGB?
                            // Simpler: Just rely on user sliding standard sliders or refine this?
                            // User asked for "Coloque essa paleta de cores" showing gradient bar.
                            // Usually this bar picks Hue.
                            // I won't implement full HSV logic here unless requested, 
                            // but visually it serves as the bottom bar in photoshop.
                        }}
                     ></div>
                </div>
            )}
            
            {mode === 'PALETTE' && (
                 <div className="grid grid-cols-6 gap-2">
                    {PRESET_COLORS.map(c => (
                        <button key={c} style={{backgroundColor:c}} onClick={()=>setBrushColor(c)} className={`w-6 h-6 rounded-full border border-gray-600 ${brushColor===c?'ring-2 ring-white':''}`}></button>
                    ))}
                    {/* Add more shades */}
                 </div>
            )}
        </div>
    );
};

// Helper Component to Render Effect specifically
const EffectRenderer = ({ layer, sourceCvs, sourceLayer, project, onRef }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef(null);

    useEffect(() => {
        if(canvasRef.current && onRef) {
            onRef(canvasRef.current);
        }
    }, [onRef]);

    useEffect(() => {
        const cvs = canvasRef.current;
        if(!cvs || !sourceCvs) return;

        // Resolve CSS based on intensity if possible
        const intensity = layer.intensity !== undefined ? layer.intensity : 0.5;
        const filterType = layer.filterType;
        const filterCss = (filterType && FILTERS[filterType]) ? FILTERS[filterType].css(intensity) : layer.filterCss;

        if (filterCss === 'webgl-glfx') {
             // Generic GLFX Renderer
             const definition = FILTERS[filterType];
             const shaderSource = definition ? GlfxShaderLibrary[definition.shader] : null;

             if (!definition || !shaderSource) return;

             const gl = cvs.getContext('webgl', { preserveDrawingBuffer: true });
             if (!gl) return;
             
              const createShader = (gl, type, source) => {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }
                return shader;
            };

            const vertexShader = createShader(gl, gl.VERTEX_SHADER, GlfxShaderLibrary.vertex);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shaderSource);
            
            if (!vertexShader || !fragmentShader) return;

            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);

            const positionLocation = gl.getAttribLocation(program, "a_position");
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            // Texture
            const tempCvs = document.createElement('canvas');
            tempCvs.width = layer.w;
            tempCvs.height = layer.h;
            const tempCtx = tempCvs.getContext('2d');
            const offsetX = (sourceLayer.x || 0) - layer.x;
            const offsetY = (sourceLayer.y || 0) - layer.y;
            tempCtx.drawImage(sourceCvs, offsetX, offsetY);

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tempCvs);

            // Uniforms
            const uniforms = definition.getUniforms(intensity);
            if (uniforms.u_texSize) uniforms.u_texSize = [layer.w, layer.h];

            Object.keys(uniforms).forEach(key => {
                const loc = gl.getUniformLocation(program, key);
                if (loc) {
                    const val = uniforms[key];
                    if (Array.isArray(val)) {
                        if (val.length === 2) gl.uniform2f(loc, val[0], val[1]);
                        if (val.length === 3) gl.uniform3f(loc, val[0], val[1], val[2]);
                    } else {
                        gl.uniform1f(loc, val);
                    }
                }
            });

            const render = () => {
                gl.viewport(0, 0, cvs.width, cvs.height);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            };
            render();
            return () => gl.deleteProgram(program);

        } else if (filterCss === 'webgl-fracture') {
            const gl = cvs.getContext('webgl', { preserveDrawingBuffer: true }); // Enable read-back
            if (!gl) return;

            // Shader Compilation Helper
            const createShader = (gl, type, source) => {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }
                return shader;
            };

            const vertexShader = createShader(gl, gl.VERTEX_SHADER, FractureShader.vertex);
            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FractureShader.fragment);
            
            if (!vertexShader || !fragmentShader) return;

            const program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

            gl.useProgram(program);

            // Set up rectangle (full canvas)
            const positionLocation = gl.getAttribLocation(program, "a_position");
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            // Upload Texture (Source Image)
            // We need to draw Source Canvas to a temp canvas to get specific region?
            // Actually, sourceCvs contains the FULL source layer.
            // We want to map the Region of this Effect Layer.
            
            const tempCvs = document.createElement('canvas');
            tempCvs.width = layer.w;
            tempCvs.height = layer.h;
            const tempCtx = tempCvs.getContext('2d');
            
            // Draw relative part
            const offsetX = (sourceLayer.x || 0) - layer.x;
            const offsetY = (sourceLayer.y || 0) - layer.y;
            tempCtx.drawImage(sourceCvs, offsetX, offsetY);

            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tempCvs);

            // Uniforms
            const uClickRandomizer = gl.getUniformLocation(program, "u_click_randomizer");
            const uEffect = gl.getUniformLocation(program, "u_effect");
            const uEffectActive = gl.getUniformLocation(program, "u_effect_active");
            const uEdgeThickness = gl.getUniformLocation(program, "u_edge_thickness");
            const uPointer = gl.getUniformLocation(program, "u_pointer_position");
            
            // const uRatio = gl.getUniformLocation(program, "u_ratio"); 
            // We can simplify ratio to 1.0 for this rect

            // Render Loop
            let startTime = Date.now();
            const render = () => {
                gl.viewport(0, 0, cvs.width, cvs.height);
                
                // Params based on layer opacity/settings?
                // Use randomizer seed from layer ID or property?
                const seed = (parseInt(layer.id.replace(/\D/g,'') || '0') % 100) / 100;

                gl.uniform1f(uClickRandomizer, seed + 0.332); 
                
                // Intensity Mapping
                const intensity = layer.intensity !== undefined ? layer.intensity : 0.5;
                gl.uniform1f(uEffect, intensity * 0.04); // 0 to 0.04 distance

                gl.uniform1f(uEffectActive, 1.0);
                gl.uniform1f(uEdgeThickness, 0.006);
                
                // Center pointer for static effect
                gl.uniform2f(uPointer, 0.55, 0.5); 

                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                // requestRef.current = requestAnimationFrame(render); // Static for now, no animation needed unless user interacts
            };
            
            render();
            
            return () => {
                // cancelAnimationFrame(requestRef.current);
                gl.deleteProgram(program);
            };

        } else {
            // Standard 2D Canvas Filter
            const ctx = cvs.getContext('2d');
            
            // Clear
            ctx.clearRect(0,0,cvs.width, cvs.height);
            
            // Apply Filter
            ctx.filter = filterCss;
            
            // Calculate offset of source relative to effect window
            const offsetX = (sourceLayer.x || 0) - layer.x;
            const offsetY = (sourceLayer.y || 0) - layer.y;
            
            ctx.drawImage(sourceCvs, offsetX, offsetY);
        }
        
    }, [layer, sourceCvs, sourceLayer, project.dims]); // Re-render when these change

    return <canvas ref={canvasRef} width={layer.w} height={layer.h} className="w-full h-full" />;
};

function PropertiesPanel({ project, toolsState, setToolsState, setBrushSize, setBrushColor, setBrushType, setTolerance, onUpdateProject }) {
    const { activeTool, brushSize, brushColor, brushType, tolerance } = toolsState;
    const { layers, activeLayerId, zoom } = project;
    
    const activeLayer = layers.find(l => l.id === activeLayerId);
    const linkedLayer = activeLayer?.type === 'effect' ? layers.find(l => l.id === activeLayer.linkedTo) : null;
    const [collapsedGroups, setCollapsedGroups] = useState({});


    const addLayer = () => {
        const newId = 'layer-' + Date.now() + Math.random();
        onUpdateProject({ 
            layers: [{ id: newId, name: `Layer ${project.nextLayerNameIndex || layers.length + 1}`, visible: true, locked: false, opacity: 1, x:0, y:0 }, ...layers],
            activeLayerId: newId,
            nextLayerNameIndex: (project.nextLayerNameIndex || layers.length + 1) + 1
        });
    };

    const addGroup = () => {
         const newId = 'group-' + Date.now();
         onUpdateProject({
             layers: [{ id: newId, name: 'Nova Pasta', type: 'group', visible: true, locked: false, opacity: 1, expanded: true }, ...layers], // Insert at top
             activeLayerId: newId
         });
    };

    const toggleLayer = (id) => {
        onUpdateProject({
            layers: layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
        });
    };

    const toggleLock = (e, id) => {
        e.stopPropagation();
        onUpdateProject({
            layers: layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l)
        });
    };
    
    const removeLayer = (e, id) => {
        e.stopPropagation();
        const layer = layers.find(l => l.id === id);
        if (layer?.locked) return; // Prevent delete if locked

        if(layers.length <= 1) return;
        
        // Also remove any effects linked to this layer
        const linkedEffects = layers.filter(l => l.linkedTo === id).map(l => l.id);
        const idsToRemove = [id, ...linkedEffects];

        const newLayers = layers.filter(l => !idsToRemove.includes(l.id));
        
        let newActiveId = activeLayerId;
        if (idsToRemove.includes(activeLayerId)) {
             newActiveId = newLayers[0].id;
        }

        onUpdateProject({
            layers: newLayers,
            activeLayerId: newActiveId
        });
    };
    
    const renameLayer = (e, id) => {
        e.stopPropagation();
        const l = layers.find(lay => lay.id === id);
        if(!l || l.locked) return; // Add check
        const name = prompt("Novo nome:", l.name);
        if(name) {
            onUpdateProject({
                layers: layers.map(lay => lay.id === id ? { ...lay, name } : lay)
            });
        }
    };

    const handleLayerReorder = (e, targetLayerId) => {
        e.preventDefault();
        const data = e.dataTransfer.getData('application/json');
        if (!data) return;
        
        try {
            const { layerId, sourceProjectId } = JSON.parse(data);
            if (sourceProjectId !== project.id || layerId === targetLayerId) return;

            const draggedIdx = layers.findIndex(l => l.id === layerId);
            const targetIdx = layers.findIndex(l => l.id === targetLayerId);
            
            if (draggedIdx === -1 || targetIdx === -1) return;

            const newLayers = [...layers];
            const [draggedLayer] = newLayers.splice(draggedIdx, 1);
            newLayers.splice(targetIdx, 0, draggedLayer);

            onUpdateProject({ layers: newLayers });
        } catch (err) {
            console.error('Layer reorder error', err);
        }
    };

    const handleDragStart = (e, layer) => {
        if (layer.locked) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData('application/json', JSON.stringify({ layerId: layer.id, sourceProjectId: project.id }));
        e.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-72 bg-white dark:!bg-[#252525] border-l border-gray-200 dark:border-gray-700 flex flex-col shrink-0 z-20 transition-colors">
            <div className="border-b border-gray-200 dark:border-gray-700 p-4">
                <div className="flex justify-between items-center mb-3">
                     <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Cor</span>
                     <div className="flex gap-2">
                        <button className="text-[10px] uppercase font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white" onClick={() => {
                            const newMode = (toolsState.colorMode === 'RGB') ? 'HEX' : 'RGB';
                            // We don't have local state for mode in ImageEditor parent?
                            // Let's adapt. We can use a local state here since it is UI only?
                            // But usually PropertiesPanel re-renders.
                            // We will use local state inside PropertiesPanel.
                        }}>
                        </button>
                     </div>
                </div>
                
                <ColorPickerUI brushColor={brushColor} setBrushColor={setBrushColor} />

            </div>
            
            <div className="flex-1 overflow-y-auto p-4 border-b border-gray-200 dark:border-gray-700 max-h-60">
                 <div className="mb-4">
                     <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Zoom {zoom}%</label>
                     <input type="range" min="10" max="200" value={zoom} onChange={e=>onUpdateProject({zoom: Number(e.target.value)})} className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer accent-blue-500" />
                 </div>
                 {(activeTool === TOOLS.DRAW || activeTool === TOOLS.ERASER) && (
                     <div className="mb-4">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">{activeTool === TOOLS.ERASER ? 'Borracha' : 'Pincel'} {brushSize}px</label>
                        <input type="range" min="1" max="100" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))} className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer accent-blue-500" />
                        
                        <div className="mt-2 flex gap-1">
                            {['round', 'square', 'airbrush'].map(t => (
                                <button key={t} 
                                    onClick={()=>setBrushType(t)}
                                    className={`flex-1 py-1 text-[10px] uppercase border rounded ${brushType===t ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-500 border-gray-300 dark:border-gray-600'}`}
                                >
                                    {t === 'round' ? 'Redondo' : t === 'square' ? 'Quad.' : 'Aeróg.'}
                                </button>
                            ))}
                        </div>
                     </div>
                 )}
                 
                 {(activeTool === TOOLS.BUCKET || activeTool === TOOLS.MAGIC_WAND) && (
                     <div className="mb-4">
                         <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Tolerância {tolerance}</label>
                         <input type="range" min="0" max="255" value={tolerance || 32} onChange={e=>setTolerance(Number(e.target.value))} className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer accent-blue-500" />
                     </div>
                 )}
                 
                 {activeLayer && (
                     <div className="mb-4 space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Opacidade {(activeLayer.opacity*100).toFixed(0)}%</label>
                            <input 
                                type="range" min="0" max="100" 
                                value={(activeLayer.opacity||1)*100} 
                                onChange={e => onUpdateProject({
                                    layers: layers.map(l => l.id === activeLayer.id ? { ...l, opacity: Number(e.target.value)/100 } : l)
                                })} 
                                className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer accent-blue-500" 
                            />
                        </div>
                        {activeLayer.type === 'effect' && (
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Intensidade {((activeLayer.intensity !== undefined ? activeLayer.intensity : 0.5)*100).toFixed(0)}% ({activeLayer.name})</label>
                                <input 
                                    type="range" min="0" max="100" 
                                    value={(activeLayer.intensity !== undefined ? activeLayer.intensity : 0.5)*100} 
                                    onChange={e => onUpdateProject({
                                        layers: layers.map(l => l.id === activeLayer.id ? { ...l, intensity: Number(e.target.value)/100 } : l)
                                    })} 
                                    className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer accent-blue-500" 
                                />
                            </div>
                        )}
                     </div>
                 )}
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-white dark:!bg-[#1e1e1e]">
                <div className="p-3 bg-gray-50 dark:bg-[#2d2d2d] border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Camadas</span>
                    <div className="flex gap-1">
                        <button onClick={addLayer} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500" title="Nova Camada">+</button>
                        <button onClick={addGroup} className="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-500" title="Nova Pasta"><i className="fas fa-folder"></i></button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-1 space-y-0.5">
                    {layers.map((layer, idx) => {
                        const isGroup = layer.type === 'group';
                        // Check visibility based on parent
                        if (layer.parentId && collapsedGroups[layer.parentId]) return null;
                        
                        const paddingLeft = layer.parentId ? '24px' : '4px';

                        return (
                        <div 
                            key={layer.id} 
                            draggable={!layer.locked}
                            onDragStart={(e) => handleDragStart(e, layer)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                // Check if dropping on group
                                const data = e.dataTransfer.getData('application/json');
                                if(data) {
                                    const { layerId } = JSON.parse(data);
                                    if(layerId !== layer.id) {
                                        if(isGroup) {
                                             // Move INTO group
                                             // We just update parentId
                                             e.stopPropagation();
                                             const newLayers = layers.map(l => l.id === layerId ? { ...l, parentId: layer.id } : l);
                                             onUpdateProject({ layers: newLayers });
                                        } else {
                                             handleLayerReorder(e, layer.id);
                                        }
                                    }
                                }
                            }}
                            onClick={()=>onUpdateProject({activeLayerId: layer.id})} 
                            onContextMenu={(e) => { 
                                e.preventDefault(); 
                                window.dispatchEvent(new CustomEvent('SHOW_CONTEXT_MENU', { 
                                    detail: { x: e.clientX, y: e.clientY, projectId: project.id, activeLayerId: layer.id } 
                                })); 
                            }}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${activeLayerId===layer.id?'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-900 dark:text-white':'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'} ${layer.locked ? 'opacity-70' : ''}`}
                            style={{ marginLeft: layer.parentId ? '16px' : '0' }}
                        >
                            {isGroup && (
                                <button onClick={(e) => { e.stopPropagation(); setCollapsedGroups(prev => ({ ...prev, [layer.id]: !prev[layer.id] })); }} className="w-4 text-center text-yellow-500">
                                    <i className={`fas fa-${collapsedGroups[layer.id] ? 'folder' : 'folder-open'}`}></i>
                                </button>
                            )}
                            {!isGroup && <i className="fas fa-grip-lines text-xs text-gray-300 dark:text-gray-600 cursor-grab active:cursor-grabbing"></i>}
                            
                            <button onClick={(e) => { e.stopPropagation(); toggleLock(e, layer.id); }} className={`w-5 hover:text-black dark:hover:text-white ${layer.locked ? 'text-red-500' : 'text-gray-400 dark:text-gray-600'}`}>
                                <i className={`fas fa-${layer.locked ? 'lock' : 'unlock'}`}></i>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); toggleLayer(layer.id); }} className="w-5"><i className={`fas fa-${layer.visible?'eye':'eye-slash'}`}></i></button>
                            <span className={`text-xs truncate flex-1 ${isGroup ? 'font-bold' : ''}`} onDoubleClick={(e) => !layer.locked && renameLayer(e, layer.id)}>{layer.name}</span>
                            {activeLayerId === layer.id && !layer.locked && (
                                <button onClick={(e)=>removeLayer(e, layer.id)} className="hover:text-red-500"><i className="fas fa-trash"></i></button>
                            )}
                        </div>
                    );})}
                </div>
            </div>
        </div>
    );
}

function SaveModal({ project, onClose }) {
    const [format, setFormat] = useState('png');
    const [quality, setQuality] = useState(0.9);
    const [bg, setBg] = useState('transparent');

    if(!project) return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
             <div className="bg-[#2d2d2d] w-full max-w-sm rounded-xl border border-gray-700 p-6 text-gray-200">
                 <h3 className="text-lg font-bold mb-4">Salvar Como</h3>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Formato</label>
                         <select value={format} onChange={e=>setFormat(e.target.value)} className="w-full bg-[#1e1e1e] p-2 rounded border border-gray-600 text-white outline-none">
                             <option value="png">PNG (Imagem)</option>
                             <option value="jpeg">JPG (Otimizado)</option>
                             <option value="webp">WebP (Web)</option>
                         </select>
                     </div>
                     {format !== 'jpeg' && (
                         <div>
                             <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Fundo</label>
                             <select value={bg} onChange={e=>setBg(e.target.value)} className="w-full bg-[#1e1e1e] p-2 rounded border border-gray-600 text-white outline-none">
                                 <option value="transparent">Transparente</option>
                                 <option value="white">Branco</option>
                                 <option value="black">Preto</option>
                             </select>
                         </div>
                     )}
                     {format === 'jpeg' && (
                          <div>
                             <label className="block text-xs uppercase font-bold text-gray-500 mb-1">Qualidade ({Math.round(quality*100)}%)</label>
                             <input type="range" min="0.1" max="1" step="0.1" value={quality} onChange={e=>setQuality(Number(e.target.value))} className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer accent-blue-500" />
                          </div>
                     )}
                 </div>
                 <div className="flex justify-end gap-2 mt-6">
                     <button onClick={onClose} className="px-4 py-2 hover:text-white text-gray-400 text-sm rounded">Cancelar</button>
                     <button 
                        onClick={() => {
                             window.dispatchEvent(new CustomEvent('TRIGGER_SAVE_PROJECT', { 
                                 detail: { projectId: project.id, format, quality, bg } 
                             }));
                             onClose();
                        }} 
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded shadow text-sm font-medium"
                     >
                         Baixar
                     </button>
                 </div>
             </div>
        </div>
    );
}

const ToolButton = ({ icon, active, onClick, title }) => (
    <button className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${active?'bg-blue-600 text-white shadow-lg shadow-blue-500/50':'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-white'}`} onClick={onClick} title={title}>
        <i className={`fas fa-${icon} text-lg`}></i>
    </button>
);

// FLOOD FILL ALGORITHM
const floodFillMask = (imageData, startX, startY, hexColor, tolerance, isFill) => {
    const data = imageData.data;
    const w = imageData.width;
    const h = imageData.height;
    
    // Parse target color
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    };
    const rgbT = hexToRgb(hexColor);
    const rT = rgbT.r;
    const gT = rgbT.g;
    const bT = rgbT.b;
    
    // Get start pixel color
    const startPos = (startY * w + startX) * 4;
    const r0 = data[startPos];
    const g0 = data[startPos + 1];
    const b0 = data[startPos + 2];
    const a0 = data[startPos + 3];
    
    // Short circuit if same color (and opaque) to avoid loop if no tolerance
    if(isFill && Math.abs(r0-rT) <= 1 && Math.abs(g0-gT) <= 1 && Math.abs(b0-bT) <= 1 && Math.abs(a0-255) <= 1) return null;
    
    const stack = [[startX, startY]];
    
    // Track bounds
    let minX = w, maxX = 0, minY = h, maxY = 0;
    
    // Visited
    const visited = new Uint8Array(w * h);
    
    while (stack.length > 0) {
        const [x, y] = stack.pop();
        const vPos = y * w + x;
        const pos = vPos * 4;
        
        if (visited[vPos]) continue;
        visited[vPos] = 1;

        // Check color match
        const r = data[pos];
        const g = data[pos + 1];
        const b = data[pos + 2];
        const a = data[pos + 3];
        
        const diff = (Math.abs(r - r0) + Math.abs(g - g0) + Math.abs(b - b0) + Math.abs(a - a0)) / 4;
        
        if (diff <= tolerance) {
            // Match
            if (isFill) {
                data[pos] = rT;
                data[pos+1] = gT;
                data[pos+2] = bT;
                data[pos+3] = 255;
            }
            
            // Bounds update
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            
            // Add neighbors
            if (x > 0) stack.push([x - 1, y]);
            if (x < w - 1) stack.push([x + 1, y]);
            if (y > 0) stack.push([x, y - 1]);
            if (y < h - 1) stack.push([x, y + 1]);
        }
    }
    
    if (minX > maxX) return null;
    
    // Create Mask (Full Size for simpler merging)
    const mask = visited; // visited is Uint8Array(w*h) already. 
    // Note: 'visited' contains 1 for matching pixels.
    
    // Return x,y as 0,0 and w,h as full image size because mask is full size
    // We kept minX, maxX etc for optimization if needed later, but simplified logic uses full mask.
    return { x: 0, y: 0, w: w, h: h, mask, minX, maxX, minY, maxY };
};

const SelectionOverlay = ({ selection, zoom, project }) => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const cvs = canvasRef.current;
        if(!cvs || !selection.mask) return;
        const ctx = cvs.getContext('2d');
        ctx.clearRect(0,0,cvs.width, cvs.height);
        
        // Draw Outline
        const w = selection.w;
        const h = selection.h;
        const mask = selection.mask;
        const imgData = ctx.createImageData(w, h);
        const data = imgData.data;

        // Colors for ants
        const c1 = [255, 255, 255, 255]; // White
        const c2 = [0, 0, 0, 255];       // Black
        
        for(let y=0; y<h; y++) {
            for(let x=0; x<w; x++) {
                const idx = y*w + x;
                if(mask[idx]) {
                    // Check neighbors
                    let isEdge = false;
                    if(x===0 || !mask[idx-1]) isEdge = true;
                    else if(x===w-1 || !mask[idx+1]) isEdge = true;
                    else if(y===0 || !mask[idx-w]) isEdge = true;
                    else if(y===h-1 || !mask[idx+w]) isEdge = true;
                    
                    if(isEdge) {
                        const pIdx = idx * 4;
                        // Dashed pattern based on x,y
                        const dash = (x + y) % 8 < 4; 
                        const color = dash ? c1 : c2;
                        
                        data[pIdx] = color[0];
                        data[pIdx+1] = color[1];
                        data[pIdx+2] = color[2];
                        data[pIdx+3] = 255;
                    }
                }
            }
        }
        ctx.putImageData(imgData, 0, 0);

    }, [selection, zoom]); 

    return (
        <div 
            className="absolute z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
            style={{
                left: selection.x,
                top: selection.y,
                width: selection.w,
                height: selection.h
            }}
            draggable="true"
             onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify({ 
                    type: 'selection',
                    sourceProjectId: project.id
                }));
            }}
        >
            <canvas ref={canvasRef} width={selection.w} height={selection.h} className="w-full h-full" />
        </div>
    );
};

