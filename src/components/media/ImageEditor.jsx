import React, { useState, useRef, useEffect } from 'react';

const TOOLS = {
  SELECT: 'select',
  CROP: 'crop',
  DRAW: 'draw',
  TEXT: 'text',
  SHAPES: 'shapes',
  FILTERS: 'filters'
};

const FILTERS = [
  { name: 'Normal', class: '' },
  { name: 'P&B', class: 'grayscale(100%)' },
  { name: 'Sepia', class: 'sepia(100%)' },
  { name: 'Invert', class: 'invert(100%)' },
  { name: 'Blur', class: 'blur(4px)' },
  { name: 'Brightness', class: 'brightness(150%)' },
  { name: 'Contrast', class: 'contrast(150%)' },
];

export default function ImageEditor() {
    const [image, setImage] = useState(null);
    const [activeTool, setActiveTool] = useState(TOOLS.SELECT);
    const [filter, setFilter] = useState('');
    const [zoom, setZoom] = useState(100);
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState('#000000');
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    // Load Image
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    initCanvas(img);
                    setImage(img);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const initCanvas = (img) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    };

    const applyFilter = (filterClass) => {
        setFilter(filterClass);
    };
    
    // Stub for saving
    const handleSave = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className={`${isFullScreen ? 'fixed inset-0 z-[100] h-screen w-screen' : 'flex flex-col h-full w-full'} bg-[#1e1e1e] text-gray-200 overflow-hidden font-sans transition-all duration-300`}>
            {/* Top Bar: Menu */}
            <div className="h-10 bg-[#2d2d2d] border-b border-gray-700 flex items-center px-4 justify-between shrink-0">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                    <span className="hover:text-white cursor-pointer">Arquivo</span>
                    <span className="hover:text-white cursor-pointer">Editar</span>
                    <span className="hover:text-white cursor-pointer">Imagem</span>
                    <span className="hover:text-white cursor-pointer">Camada</span>
                    <span className="hover:text-white cursor-pointer">Filtro</span>
                    <span className="hover:text-white cursor-pointer">Janela</span>
                </div>
                <div className="flex items-center gap-2">
                     <button 
                        className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white mr-2" 
                        onClick={() => setIsFullScreen(!isFullScreen)}
                     >
                        <i className={`fas fa-${isFullScreen ? 'compress' : 'expand'} mr-1`}></i>
                        {isFullScreen ? 'Sair' : 'Tela Cheia'}
                     </button>
                     <button className="text-xs bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 text-white" onClick={handleSave}>Salvar</button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Toolbar */}
                <div className="w-12 bg-[#252525] border-r border-gray-700 flex flex-col items-center py-4 gap-4 z-10">
                    <ToolButton icon="mouse-pointer" active={activeTool === TOOLS.SELECT} onClick={() => setActiveTool(TOOLS.SELECT)} title="Mover (V)" />
                    <ToolButton icon="crop" active={activeTool === TOOLS.CROP} onClick={() => setActiveTool(TOOLS.CROP)} title="Cortar (C)" />
                    <ToolButton icon="paint-brush" active={activeTool === TOOLS.DRAW} onClick={() => setActiveTool(TOOLS.DRAW)} title="Pincel (B)" />
                    <ToolButton icon="font" active={activeTool === TOOLS.TEXT} onClick={() => setActiveTool(TOOLS.TEXT)} title="Texto (T)" />
                    <ToolButton icon="shapes" active={activeTool === TOOLS.SHAPES} onClick={() => setActiveTool(TOOLS.SHAPES)} title="Formas (U)" />
                    <ToolButton icon="magic" active={activeTool === TOOLS.FILTERS} onClick={() => setActiveTool(TOOLS.FILTERS)} title="Filtros/Efeitos" />
                    
                    <div className="flex-1"></div>
                    
                    {/* Color Picker Stub */}
                    <div className="w-8 h-8 rounded-full border-2 border-white cursor-pointer" style={{ backgroundColor: brushColor }}>
                         <input type="color" className="opacity-0 w-full h-full cursor-pointer" onChange={(e) => setBrushColor(e.target.value)} />
                    </div>
                </div>

                {/* Center Canvas Area */}
                <div className="flex-1 bg-[#121212] overflow-auto flex items-center justify-center relative p-8 shadow-inner" ref={containerRef}>
                    {!image && (
                         <div className="text-center p-10 border-2 border-dashed border-gray-600 rounded-xl">
                             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                             <i className="fas fa-image text-4xl text-gray-500 mb-4"></i>
                             <p className="text-gray-400 mb-4">Arraste uma imagem ou clique para abrir</p>
                             <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm text-white">Abrir Imagem</button>
                         </div>
                    )}
                    <div className={`relative shadow-2xl transition-all duration-300 ${!image ? 'hidden' : ''}`} style={{ transform: `scale(${zoom / 100})`, filter: filter }}>
                        <canvas ref={canvasRef} className="bg-[url('https://t3.ftcdn.net/jpg/03/35/35/62/360_F_335356238_M6c0Z6A0000000000000000000000000.jpg')] bg-repeat" />
                    </div>
                </div>

                {/* Right Panels (Layers/Properties) */}
                <div className="w-64 bg-[#252525] border-l border-gray-700 flex flex-col z-10">
                    {/* Histogram / Navigator Stub */}
                    <div className="h-32 border-b border-gray-700 p-2">
                        <div className="text-[10px] text-gray-500 font-bold mb-1 uppercase">Navegador</div>
                        <div className="w-full h-20 bg-gray-800 rounded"></div>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                             <button onClick={() => setZoom(z => Math.max(10, z - 10))}>-</button>
                             <span>{zoom}%</span>
                             <button onClick={() => setZoom(z => Math.min(300, z + 10))}>+</button>
                        </div>
                    </div>

                    {/* Properties Panel based on Active Tool */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="text-[10px] text-gray-500 font-bold mb-3 uppercase">Propriedades</div>
                        
                        {activeTool === TOOLS.DRAW && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Tamanho do Pincel</label>
                                    <input type="range" min="1" max="50" value={brushSize} onChange={(e) => setBrushSize(e.target.value)} className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 block mb-1">Opacidade</label>
                                    <input type="range" min="0" max="100" defaultValue="100" className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>
                        )}

                        {activeTool === TOOLS.FILTERS && (
                            <div className="grid grid-cols-2 gap-2">
                                {FILTERS.map(f => (
                                    <button 
                                        key={f.name}
                                        onClick={() => applyFilter(f.class)}
                                        className={`p-2 text-xs rounded border ${filter === f.class ? 'border-blue-500 bg-blue-500/20 text-white' : 'border-gray-600 text-gray-400 hover:bg-gray-700'}`}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {activeTool === TOOLS.SELECT && (
                           <div className="text-xs text-gray-500 italic">Selecione uma ferramenta p/ editar.</div> 
                        )}
                    </div>

                    {/* Layers Stub */}
                    <div className="h-1/3 border-t border-gray-700 flex flex-col">
                        <div className="p-2 bg-[#2d2d2d] border-b border-gray-700 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Camadas</span>
                            <i className="fas fa-plus text-xs text-gray-400 hover:text-white cursor-pointer"></i>
                        </div>
                        <div className="flex-1 overflow-y-auto p-1 space-y-1">
                             <div className="flex items-center gap-2 p-2 bg-blue-900/30 rounded border border-blue-500/50 cursor-pointer">
                                 <i className="fas fa-eye text-xs text-gray-400"></i>
                                 <div className="w-8 h-8 bg-white rounded-sm"></div>
                                 <span className="text-xs text-white">Camada 1</span>
                             </div>
                             <div className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer opacity-50">
                                 <i className="fas fa-eye text-xs text-gray-400"></i>
                                 <div className="w-8 h-8 bg-black border border-gray-600 rounded-sm"></div>
                                 <span className="text-xs text-gray-400">Fundo</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const ToolButton = ({ icon, active, onClick, title }) => (
    <button 
        className={`w-8 h-8 flex items-center justify-center rounded transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
        onClick={onClick}
        title={title}
    >
        <i className={`fas fa-${icon}`}></i>
    </button>
);
