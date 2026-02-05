import React, { useState, useRef, useEffect, useCallback } from 'react';

const TOOLS = {
  SELECT: 'select',
  CROP: 'crop',
  DRAW: 'draw',
  TEXT: 'text',
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

export default function ImageEditor() {
    // Global State
    const [projects, setProjects] = useState([]); 
    const [activeProjectId, setActiveProjectId] = useState(null);
    
    // Tools State
    const [activeTool, setActiveTool] = useState(TOOLS.SELECT);
    const [brushSize, setBrushSize] = useState(5);
    const [brushColor, setBrushColor] = useState('#000000');
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    // UI State
    const [activeMenu, setActiveMenu] = useState(null); 
    const [newProjModal, setNewProjModal] = useState(null); 
    const [saveModal, setSaveModal] = useState(null); 

    const fileInputRef = useRef(null);
    const activeProject = projects.find(p => p.id === activeProjectId);

    const createProject = (w, h, name, initialImage = null) => {
        const id = 'proj-' + Date.now() + Math.random();
        const firstLayerId = 'layer-bg-' + Date.now();
        
        const newProject = {
            id,
            name: name || `Projeto ${projects.length + 1}`,
            dims: { w, h },
            zoom: 100, 
            filter: '',
            layers: [{ 
                id: firstLayerId, 
                name: 'Fundo', 
                visible: true, 
                initialImage: initialImage 
            }],
            activeLayerId: firstLayerId
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

    const updateProjectState = useCallback((id, updates) => {
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }, []);

    return (
        <div className={`${isFullScreen ? 'fixed inset-0 z-[100] h-screen w-screen' : 'flex flex-col h-full w-full'} bg-[#1e1e1e] text-gray-200 overflow-hidden font-sans transition-all duration-300 relative`} onClick={() => setActiveMenu(null)}>
            
            <div className="h-10 bg-[#2d2d2d] border-b border-gray-700 flex items-center px-4 justify-between shrink-0 relative z-50">
                <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
                    <div className="relative">
                        <span 
                            className={`hover:text-white cursor-pointer px-2 py-1 rounded ${activeMenu === 'file' ? 'bg-gray-700 text-white' : ''}`}
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === 'file' ? null : 'file'); }}
                        >
                            Arquivo <i className="fas fa-chevron-down ml-1 text-[10px]"></i>
                        </span>
                        
                        {activeMenu === 'file' && (
                            <div className="absolute top-full left-0 mt-1 w-48 bg-[#2d2d2d] border border-gray-600 rounded shadow-xl py-1 text-gray-200 flex flex-col">
                                <button 
                                    className="text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center justify-between group"
                                    onClick={() => { setNewProjModal({}); setActiveMenu(null); }}
                                >
                                    <span><i className="fas fa-file w-5 mr-2"></i> Novo</span>
                                </button>
                                <button 
                                    className="text-left px-4 py-2 hover:bg-blue-600 hover:text-white flex items-center justify-between"
                                    onClick={() => { fileInputRef.current.click(); setActiveMenu(null); }}
                                >
                                    <span><i className="fas fa-folder-open w-5 mr-2"></i> Abrir</span>
                                </button>
                                <div className="h-px bg-gray-700 my-1"></div>
                                <button 
                                    className="text-left px-4 py-2 hover:bg-blue-600 hover:text-white disabled:opacity-50"
                                    disabled={!activeProject}
                                    onClick={() => { setSaveModal({ projectId: activeProjectId }); setActiveMenu(null); }}
                                >
                                    <i className="fas fa-save w-5 mr-2"></i> Salvar como...
                                </button>
                                <div className="h-px bg-gray-700 my-1"></div>
                                <button 
                                    className="text-left px-4 py-2 hover:bg-red-600 hover:text-white"
                                    onClick={() => closeAll()}
                                >
                                    <i className="fas fa-times-circle w-5 mr-2"></i> Fechar Tudo
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                     <button className="text-xs bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-white" onClick={() => setIsFullScreen(!isFullScreen)}>
                        <i className={`fas fa-${isFullScreen ? 'compress' : 'expand'} mr-1`}></i>
                        {isFullScreen ? 'Sair' : 'Tela Cheia'}
                     </button>
                </div>
            </div>
            
            <input type="file" ref={fileInputRef} hidden multiple accept="image/*" onChange={handleFileOpen} />

            <div className="bg-[#252525] flex items-center px-2 pt-2 gap-1 overflow-x-auto border-b border-gray-700 shrink-0 h-10 scrollbar-hide">
                {projects.map(p => (
                    <div 
                        key={p.id}
                        onClick={() => setActiveProjectId(p.id)}
                        className={`
                            group flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer select-none min-w-[120px] max-w-[200px] border-t border-x border-transparent relative
                            ${activeProjectId === p.id 
                                ? 'bg-[#1e1e1e] border-gray-700 text-white font-medium border-b-[#1e1e1e] -mb-px z-10' 
                                : 'bg-[#333] text-gray-400 hover:bg-[#3d3d3d] hover:text-gray-200'}
                        `}
                    >
                        <i className="fas fa-image text-blue-500"></i>
                        <span className="truncate flex-1">{p.name}</span>
                        <button 
                            onClick={(e) => closeProject(e, p.id)}
                            className="w-4 h-4 rounded-full hover:bg-red-500/20 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                
                <div className="w-12 bg-[#252525] border-r border-gray-700 flex flex-col items-center py-4 gap-4 z-20 shrink-0">
                    <ToolButton icon="mouse-pointer" active={activeTool === TOOLS.SELECT} onClick={() => setActiveTool(TOOLS.SELECT)} title="Mover (V)" />
                    <ToolButton icon="paint-brush" active={activeTool === TOOLS.DRAW} onClick={() => setActiveTool(TOOLS.DRAW)} title="Pincel (B)" />
                    <ToolButton icon="font" active={activeTool === TOOLS.TEXT} onClick={() => setActiveTool(TOOLS.TEXT)} title="Texto (T)" />
                    <ToolButton icon="magic" active={activeTool === TOOLS.FILTERS} onClick={() => setActiveTool(TOOLS.FILTERS)} title="Filtros/Efeitos" />
                    <div className="flex-1"></div>
                    <div className="relative group">
                         <div className="w-8 h-8 rounded-full border-2 border-white cursor-pointer overflow-hidden" style={{ backgroundColor: brushColor }}></div>
                         <input type="color" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" value={brushColor} onChange={(e) => setBrushColor(e.target.value)} title="Cor do Pincel" />
                    </div>
                </div>

                <div className="flex-1 bg-[#121212] overflow-hidden relative">
                    {projects.map(p => (
                        <ProjectWorkspace 
                            key={p.id} 
                            project={p}
                            isActive={activeProjectId === p.id}
                            toolsState={{ activeTool, brushSize, brushColor }}
                            onUpdate={(updates) => updateProjectState(p.id, updates)}
                        />
                    ))}
                    
                    {projects.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                             <div className="mb-6 opacity-20"><i className="fas fa-layer-group text-6xl"></i></div>
                             <p className="mb-4 text-xs uppercase tracking-widest opacity-50">Comece algo criativo</p>
                             <div className="flex gap-4">
                                 <button onClick={() => setNewProjModal({})} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-xl text-sm font-medium transition-transform active:scale-95 flex items-center">
                                     <i className="fas fa-plus mr-2"></i> Novo Arquivo
                                 </button>
                                 <button onClick={() => fileInputRef.current.click()} className="px-6 py-3 bg-[#333] hover:bg-[#444] text-white rounded-lg shadow-xl text-sm font-medium transition-transform active:scale-95 flex items-center">
                                     <i className="fas fa-folder-open mr-2"></i> Abrir Imagem
                                 </button>
                             </div>
                        </div>
                    )}
                </div>

                {activeProject && (
                    <PropertiesPanel 
                        project={activeProject}
                        toolsState={{ activeTool, brushSize, brushColor }}
                        setBrushSize={setBrushSize}
                        setBrushColor={setBrushColor}
                        onUpdateProject={(u) => updateProjectState(activeProject.id, u)}
                    />
                )}
            </div>

            {newProjModal && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#2d2d2d] w-full max-w-md rounded-xl shadow-2xl border border-gray-700 p-6">
                        <h3 className="text-xl font-bold text-white mb-6">Novo Projeto</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Nome</label>
                                <input id="new_proj_name" type="text" className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-white outline-none" placeholder="Sem título" defaultValue={newProjModal.name || ''} />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-500 font-bold mb-1">Predefinições</label>
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                    {CANVAS_PRESETS.map(p => (
                                        <button key={p.name} className="text-xs p-2 bg-[#333] hover:bg-blue-600 hover:text-white rounded border border-gray-600 text-left transition-colors"
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
                                    <div className="flex-1"><label className="text-[10px] text-gray-500">Largura (px)</label><input id="new_proj_w" type="number" defaultValue={1280} className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-white" /></div>
                                    <div className="flex-1"><label className="text-[10px] text-gray-500">Altura (px)</label><input id="new_proj_h" type="number" defaultValue={720} className="w-full bg-[#1e1e1e] border border-gray-600 rounded p-2 text-white" /></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-8">
                            <button onClick={() => setNewProjModal(null)} className="px-4 py-2 text-gray-400 hover:text-white rounded">Cancelar</button>
                            <button 
                                onClick={() => {
                                    const name = document.getElementById('new_proj_name').value;
                                    const w = Number(document.getElementById('new_proj_w').value);
                                    const h = Number(document.getElementById('new_proj_h').value);
                                    createProject(w, h, name);
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
        </div>
    );
}

function ProjectWorkspace({ project, isActive, toolsState, onUpdate }) {
    const containerRef = useRef(null);
    const layerRefs = useRef({});
    const [isDrawing, setIsDrawing] = useState(false);
    const [lastPos, setLastPos] = useState(null);

    useEffect(() => {
        project.layers.forEach(l => {
            if (l.initialImage && !l.initialized) {
                 setTimeout(() => {
                     const cvs = layerRefs.current[l.id];
                     if(cvs) {
                        const ctx = cvs.getContext('2d');
                        ctx.drawImage(l.initialImage, 0, 0, project.dims.w, project.dims.h);
                        l.initialized = true; 
                     }
                 }, 50);
            }
        });
    }, [project.layers]);

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
                    ctx.drawImage(layerRefs.current[l.id], 0, 0);
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
        const scaleX = project.dims.w / rect.width;
        const scaleY = project.dims.h / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e) => {
        if (!isActive || !project.activeLayerId) return;
        const layer = project.layers.find(l => l.id === project.activeLayerId);
        if(!layer?.visible) return;

        if (toolsState.activeTool === TOOLS.DRAW) {
            setIsDrawing(true);
            const pos = getCoords(e);
            setLastPos(pos);
            draw(pos);
        } else if (toolsState.activeTool === TOOLS.TEXT) {
            const pos = getCoords(e);
            const text = prompt("Texto:");
            if(text) {
                const ctx = layerRefs.current[project.activeLayerId].getContext('2d');
                ctx.fillStyle = toolsState.brushColor;
                ctx.font = `${toolsState.brushSize * 5}px sans-serif`;
                ctx.fillText(text, pos.x, pos.y);
            }
        }
    };

    const draw = (pos) => {
        const ctx = layerRefs.current[project.activeLayerId].getContext('2d');
        ctx.beginPath();
        ctx.moveTo(lastPos.x, lastPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = toolsState.brushColor;
        ctx.lineWidth = toolsState.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        setLastPos(pos);
    };

    const handleMouseMove = (e) => {
        if(!isDrawing) return;
        const pos = getCoords(e);
        draw(pos);
    };

    return (
        <div 
            className={`absolute inset-0 overflow-auto flex items-center justify-center p-8 bg-[#121212] ${isActive ? 'z-10' : 'z-0 invisible pointer-events-none'}`}
            ref={containerRef}
        >
            <div 
                className={`relative shadow-2xl transition-transform duration-200 bg-white
                    ${toolsState.activeTool === TOOLS.DRAW ? 'cursor-crosshair' : toolsState.activeTool === TOOLS.TEXT ? 'cursor-text' : 'cursor-default'}
                `}
                style={{
                    width: project.dims.w,
                    height: project.dims.h,
                    transform: `scale(${project.zoom / 100})`,
                    transformOrigin: 'center center',
                    filter: project.filter
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
            >
                <div className="absolute inset-0 bg-[url('https://t3.ftcdn.net/jpg/03/35/35/62/360_F_335356238_M6c0Z6A0000000000000000000000000.jpg')] bg-repeat opacity-20 pointer-events-none"></div>

                {[...project.layers].reverse().map((layer, idx) => (
                    <canvas 
                        key={layer.id}
                        ref={el => layerRefs.current[layer.id] = el}
                        width={project.dims.w}
                        height={project.dims.h}
                        className="absolute top-0 left-0 w-full h-full object-contain"
                        style={{ zIndex: idx, opacity: layer.visible ? 1 : 0, pointerEvents: 'none' }} 
                    />
                ))}
            </div>
        </div>
    );
}

function PropertiesPanel({ project, toolsState, setBrushSize, setBrushColor, onUpdateProject }) {
    const { activeTool, brushSize, brushColor } = toolsState;
    const { layers, activeLayerId, zoom, filter } = project;

    const addLayer = () => {
        const newId = 'layer-' + Date.now() + Math.random();
        onUpdateProject({ 
            layers: [{ id: newId, name: `Layer ${layers.length + 1}`, visible: true }, ...layers],
            activeLayerId: newId
        });
    };

    const toggleLayer = (id) => {
        onUpdateProject({
            layers: layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
        });
    };
    
    const removeLayer = (e, id) => {
        e.stopPropagation();
        if(layers.length <= 1) return;
        const newLayers = layers.filter(l => l.id !== id);
        onUpdateProject({
            layers: newLayers,
            activeLayerId: activeLayerId === id ? newLayers[0].id : activeLayerId
        });
    };
    
    const renameLayer = (e, id) => {
        e.stopPropagation();
        const l = layers.find(lay => lay.id === id);
        const name = prompt("Novo nome:", l.name);
        if(name) {
            onUpdateProject({
                layers: layers.map(lay => lay.id === id ? { ...lay, name } : lay)
            });
        }
    };

    return (
        <div className="w-72 bg-[#252525] border-l border-gray-700 flex flex-col shrink-0 z-20">
            <div className="border-b border-gray-700 p-4">
                <div className="text-[10px] text-gray-500 font-bold mb-3 uppercase flex justify-between">
                    <span>Cores</span>
                    <span className="font-mono">{brushColor}</span>
                </div>
                <div className="grid grid-cols-6 gap-2 mb-3">
                    {PRESET_COLORS.map(c => (
                        <button key={c} style={{backgroundColor:c}} onClick={()=>setBrushColor(c)} className={`w-6 h-6 rounded-full border border-gray-600 ${brushColor===c?'ring-2 ring-white':''}`}></button>
                    ))}
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 border-b border-gray-700 max-h-60">
                 <div className="mb-4">
                     <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Zoom {zoom}%</label>
                     <input type="range" min="10" max="200" value={zoom} onChange={e=>onUpdateProject({zoom: Number(e.target.value)})} className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer accent-blue-500" />
                 </div>
                 {activeTool === TOOLS.DRAW && (
                     <div className="mb-4">
                        <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Pincel {brushSize}px</label>
                        <input type="range" min="1" max="100" value={brushSize} onChange={e=>setBrushSize(Number(e.target.value))} className="w-full h-1 bg-gray-600 rounded-lg cursor-pointer accent-blue-500" />
                     </div>
                 )}
                 <div className="gap-2 grid grid-cols-2">
                     <button onClick={()=>onUpdateProject({filter: ''})} className={`text-xs border rounded p-1 ${filter===''?'bg-blue-900 border-blue-500 text-white':'border-gray-600 text-gray-400'}`}>Normal</button>
                    {FILTERS.map(f => (
                        f.class && <button key={f.name} onClick={()=>onUpdateProject({filter: f.class})} className={`text-xs border rounded p-1 ${filter===f.class?'bg-blue-900 border-blue-500 text-white':'border-gray-600 text-gray-400'}`}>{f.name}</button>
                    ))}
                 </div>
            </div>

            <div className="flex-1 flex flex-col min-h-0 bg-[#1e1e1e]">
                <div className="p-3 bg-[#2d2d2d] border-b border-gray-700 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Camadas</span>
                    <button onClick={addLayer} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500">+ Nova</button>
                </div>
                <div className="flex-1 overflow-y-auto p-1 space-y-1">
                    {layers.map((layer, idx) => (
                        <div key={layer.id} onClick={()=>onUpdateProject({activeLayerId: layer.id})} className={`flex items-center gap-2 p-2 rounded cursor-pointer border ${activeLayerId===layer.id?'bg-blue-900/30 border-blue-500 text-white':'border-transparent hover:bg-gray-700 text-gray-400'}`}>
                            <button onClick={(e) => { e.stopPropagation(); toggleLayer(layer.id); }} className="w-5"><i className={`fas fa-${layer.visible?'eye':'eye-slash'}`}></i></button>
                            <span className="text-xs truncate flex-1" onDoubleClick={(e) => renameLayer(e, layer.id)}>{layer.name}</span>
                            {activeLayerId === layer.id && (
                                <button onClick={(e)=>removeLayer(e, layer.id)} className="hover:text-red-500"><i className="fas fa-trash"></i></button>
                            )}
                        </div>
                    ))}
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
    <button className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${active?'bg-blue-600 text-white shadow-lg shadow-blue-900/50':'text-gray-400 hover:bg-gray-700 hover:text-white'}`} onClick={onClick} title={title}>
        <i className={`fas fa-${icon} text-lg`}></i>
    </button>
);
