import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useFFmpeg } from '../../hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';

const TRACK_HEIGHT = 80;
const PIXELS_PER_SECOND = 20;
const TRACK_COLORS = ['blue', 'purple', 'emerald', 'amber', 'rose', 'cyan'];

const colorClasses = {
    blue: "bg-blue-600 border-blue-400 opacity-90 hover:opacity-100",
    purple: "bg-purple-600 border-purple-400 opacity-90 hover:opacity-100",
    emerald: "bg-emerald-600 border-emerald-400 opacity-90 hover:opacity-100",
    amber: "bg-amber-600 border-amber-400 opacity-90 hover:opacity-100",
    rose: "bg-rose-600 border-rose-400 opacity-90 hover:opacity-100",
    cyan: "bg-cyan-600 border-cyan-400 opacity-90 hover:opacity-100",
    green: "bg-green-600 border-green-400 opacity-90 hover:opacity-100"
};

export default function VideoEditor() {
    // --- State & Refs ---
    const { ffmpegRef, load: loadFFmpeg, loaded: ffmpegLoaded } = useFFmpeg();
    const [status, setStatus] = useState('');
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    
    // Timeline State
    const [duration, setDuration] = useState(600); // 10 minutes default for "infinite" feel
    const [currentTime, setCurrentTime] = useState(0);
    const [zoom, setZoom] = useState(PIXELS_PER_SECOND);
    
    // Tracks State
    const [tracks, setTracks] = useState([
        { id: 'v1', type: 'video', name: 'Vídeo 1', clips: [], muted: false, hidden: false, color: 'blue' },
        { id: 'a1', type: 'audio', name: 'Áudio 1', clips: [], muted: false, hidden: false, color: 'green' }
    ]);
    
    // Interaction State
    const [draggingClip, setDraggingClip] = useState(null); 
    const [resizingClip, setResizingClip] = useState(null); 
    
    const timelineRef = useRef(null);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Initial Load
    useEffect(() => { ensureFFmpeg(); }, []);

    // Helpers
    const formatTime = (seconds) => {
        const date = new Date(0);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    };

    const ensureFFmpeg = async () => { 
        if (!ffmpegLoaded) { 
            setStatus('Carregando motor...'); 
            await loadFFmpeg(); 
        } 
    };

    // --- Track Management ---
    const getTrackColor = (index, type) => {
        if (type === 'audio') return 'green'; 
        return TRACK_COLORS[index % TRACK_COLORS.length];
    };

    const addTrack = (type) => {
        const currentTypeCount = tracks.filter(t => t.type === type).length;
        // Increased limit for "infinite" feel
        const limit = 10; 
        if (currentTypeCount >= limit) return alert(`Máximo de ${limit} faixas permitidas.`);

        const newId = `${type === 'video' ? 'v' : 'a'}${Date.now()}`;
        const index = tracks.filter(t => t.type === 'video').length;
        
        setTracks([...tracks, { 
            id: newId, 
            type, 
            name: `${type === 'video' ? 'Vídeo' : 'Áudio'} ${currentTypeCount + 1}`, 
            clips: [],
            muted: false,
            hidden: false,
            color: type === 'video' ? getTrackColor(index, 'video') : 'green'
        }]);
    };

    const removeTrack = (id) => setTracks(tracks.filter(t => t.id !== id));
    
    const toggleTrackMute = (trackId) => {
        setTracks(tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t));
    };
    const toggleTrackHidden = (trackId) => {
        setTracks(tracks.map(t => t.id === trackId ? { ...t, hidden: !t.hidden } : t));
    };

    // --- Clip Management ---
    const addClipToTrack = (trackId, file, specificTime = null) => {
        if (!file) return;
        const src = URL.createObjectURL(file);
        
        const commitClip = (clipDuration) => {
             const newClip = {
                id: Date.now() + Math.random(),
                file,
                name: file.name,
                src,
                startTime: specificTime !== null ? specificTime : currentTime,
                duration: clipDuration || 10,
                type: file.type.startsWith('video') ? 'video' : 'audio',
            };
    
            setTracks(prev => prev.map(t => {
                if (t.id === trackId) {
                    return { ...t, clips: [...t.clips, newClip] };
                }
                return t;
            }));
            
            const end = (specificTime !== null ? specificTime : currentTime) + (clipDuration || 10);
            if (end > duration) setDuration(end + 60);
            
            // Auto preview first video
            if (file.type.startsWith('video') && videoRef.current && !videoRef.current.src) {
                videoRef.current.src = src;
            }
        };

        const media = document.createElement(file.type.startsWith('video') ? 'video' : 'audio');
        media.preload = 'metadata';
        media.onloadedmetadata = () => commitClip(media.duration);
        media.onerror = () => commitClip(10);
        media.src = src;
    };

    const removeClip = (trackId, clipId) => {
        setTracks(prev => prev.map(t => {
            if (t.id === trackId) {
                return { ...t, clips: t.clips.filter(c => c.id !== clipId) };
            }
            return t;
        }));
    };

    // --- Drag & Drop (External) ---
    const handleTrackDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; };
    const handleTrackDrop = (e, trackId) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const dropTime = Math.max(0, e.nativeEvent.offsetX / zoom);
            files.forEach(file => {
                const isVideo = file.type.startsWith('video');
                const track = tracks.find(t => t.id === trackId);
                // Strict type check
                if ((isVideo && track.type === 'video') || (!isVideo && track.type === 'audio')) {
                    addClipToTrack(trackId, file, dropTime);
                } else {
                    alert(`Arquivo incompatível com a trilha.`);
                }
            });
        }
    };

    // --- Interaction (Move & Resize) ---
    const handleDragStart = (e, trackId, clip) => {
        if (e.target.classList.contains('resize-handle') || e.target.closest('button')) return; 
        e.stopPropagation();
        setDraggingClip({ trackId, clipId: clip.id, startX: e.clientX, originalStartTime: clip.startTime });
    };

    const handleResizeStart = (e, trackId, clip, edge) => {
        e.stopPropagation();
        setResizingClip({ 
            trackId, 
            clipId: clip.id, 
            edge, 
            startX: e.clientX, 
            originalStart: clip.startTime, 
            originalDuration: clip.duration 
        });
    };

    const handleMouseMove = useCallback((e) => {
        if (draggingClip) {
            const deltaX = e.clientX - draggingClip.startX;
            let newStartTime = Math.max(0, draggingClip.originalStartTime + (deltaX / zoom));
            setTracks(prev => prev.map(t => {
                if (t.id === draggingClip.trackId) {
                    return { ...t, clips: t.clips.map(c => c.id === draggingClip.clipId ? { ...c, startTime: newStartTime } : c) };
                }
                return t;
            }));
        }
        if (resizingClip) {
            const deltaX = e.clientX - resizingClip.startX;
            const deltaSeconds = deltaX / zoom;
            setTracks(prev => prev.map(t => {
                if (t.id === resizingClip.trackId) {
                    return {
                        ...t,
                        clips: t.clips.map(c => {
                            if (c.id === resizingClip.clipId) {
                                let newStart = c.startTime;
                                let newDuration = c.duration;
                                if (resizingClip.edge === 'end') {
                                    newDuration = Math.max(0.5, resizingClip.originalDuration + deltaSeconds);
                                } else {
                                    const maxShift = resizingClip.originalDuration - 0.5;
                                    const shift = Math.min(Math.max(deltaSeconds, -resizingClip.originalStart), maxShift);
                                    newStart = resizingClip.originalStart + shift;
                                    newDuration = resizingClip.originalDuration - shift;
                                }
                                return { ...c, startTime: newStart, duration: newDuration };
                            }
                            return c;
                        })
                    };
                }
                return t;
            }));
        }
    }, [draggingClip, resizingClip, zoom]);

    const handleMouseUp = useCallback(() => {
        setDraggingClip(null);
        setResizingClip(null);
    }, []);

    useEffect(() => {
        if (draggingClip || resizingClip) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
             window.removeEventListener('mousemove', handleMouseMove);
             window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingClip, resizingClip, handleMouseMove, handleMouseUp]);

    // --- Playback Sync & Multi-track Preview ---
    useEffect(() => {
        let interval;
        if (isPlaying) {
             // Infinite timeline expansion while playing
            interval = setInterval(() => {
                setCurrentTime(t => {
                    if (t >= duration - 5) {
                        setDuration(prev => prev + 10);
                    }
                    return t + 0.1;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, duration]);

    // Sync Player Logic (The Fix for Multi-track)
    useEffect(() => {
        if (videoRef.current && tracks.length > 0) {
            // Find ALL visible video tracks
            const visibleVideos = tracks.filter(t => t.type === 'video' && !t.hidden);
            
            // Priority: Last in list = Top Z-Index = "Top Layer".
            // So we iterate backwards to find the one that should show.
            let activeClip = null;
            let topTrack = null;

            for (let i = visibleVideos.length - 1; i >= 0; i--) {
                const track = visibleVideos[i];
                const clip = track.clips.find(c => currentTime >= c.startTime && currentTime < c.startTime + c.duration);
                if (clip) {
                    activeClip = clip;
                    topTrack = track;
                    break; // Found the top-most clip at this second
                }
            }

            if (activeClip) {
                // Only change src if different clip
                if (videoRef.current.currentSrc !== activeClip.src && videoRef.current.src !== activeClip.src) {
                    videoRef.current.src = activeClip.src;
                }
                
                // Sync time
                const offset = currentTime - activeClip.startTime;
                if (Math.abs(videoRef.current.currentTime - offset) > 0.5) {
                    videoRef.current.currentTime = offset;
                }
                
                // Apply Mute/Hidden status
                videoRef.current.muted = topTrack.muted; 
                videoRef.current.style.opacity = 1;

                if (isPlaying) {
                    const playPromise = videoRef.current.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => { console.log("Play interrupted"); });
                    }
                } else {
                    videoRef.current.pause();
                }
            } else {
                // No video at this second
                videoRef.current.pause();
                videoRef.current.style.opacity = 0; // Hide player if no clip
            }
        }
    }, [currentTime, isPlaying, tracks]);

    const handleTimelineClick = (e) => setCurrentTime(Math.max(0, e.nativeEvent.offsetX / zoom));

    // Stub Render
    const handleRender = async () => {
        setProcessing(true);
        setStatus("Exportando (Simulação)...");
        let p=0; const i = setInterval(()=>{ p+=10; if(p>100){ clearInterval(i); setProcessing(false); setStatus("Concluído!"); } setProgress(p); }, 300);
    };

    // --- Track Media Upload Helpers ---
    const fileInputRef = useRef(null);
    const activeTrackUploadRef = useRef(null);

    const triggerTrackUpload = (trackId) => {
        activeTrackUploadRef.current = trackId;
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const trackId = activeTrackUploadRef.current;
        if (!trackId || files.length === 0) return;

        const track = tracks.find(t => t.id === trackId);
        if(!track) return;
        
        files.forEach(file => {
             const isVideo = file.type.startsWith('video');
             if ((isVideo && track.type === 'video') || (!isVideo && track.type === 'audio')) {
                  addClipToTrack(trackId, file, currentTime);
             } else {
                 alert(`Tipo de arquivo inválido para a faixa ${track.name}`);
             }
        });
        e.target.value = ''; 
        activeTrackUploadRef.current = null;
    };

    return (
        <div className="flex flex-col h-full bg-[var(--bg-card)] text-[var(--text-main)] overflow-hidden font-sans transition-colors">
             <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />

             {/* Top Preview Section */}
             <div className="flex-1 flex min-h-0 bg-black">
                {/* Left Panel: Media Library Placeholder */}
                <div className="w-64 bg-gray-50 dark:bg-[#151515] border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col z-20">
                    <h3 className="font-bold mb-4 text-xs uppercase tracking-wider text-gray-500">Mídia</h3>
                    <div className="flex-1 overflow-y-auto space-y-2">
                         <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center text-sm text-gray-500">
                             <p>Arraste para as faixas</p>
                             <small className="opacity-50 block mt-1">Ou use o botão (+) na faixa</small>
                         </div>
                    </div>
                </div>

                {/* Center: Video Player & Controls */}
                <div className="flex-1 flex flex-col relative group overflow-hidden">
                     <div className="flex-1 flex items-center justify-center overflow-hidden bg-black relative">
                        {/* Video Element */}
                        <video ref={videoRef} className="max-h-full max-w-full shadow-lg transition-opacity duration-200" controls={false} />
                     </div>
                     
                     {/* FIXED CONTROLS BAR (REQUESTED TO BE VISIBLE) */}
                     <div className="h-16 bg-[#111] border-t border-gray-800 flex items-center justify-center gap-6 shrink-0 z-30 shadow-md">
                         <button onClick={() => setCurrentTime(0)} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800" title="Início">
                            <i className="fas fa-step-backward text-lg"></i>
                         </button>
                         <button onClick={() => setIsPlaying(!isPlaying)} className={`text-white transition-all transform hover:scale-110 flex items-center justify-center w-12 h-12 rounded-full shadow-lg ${isPlaying ? 'bg-blue-600 shadow-blue-900/50' : 'bg-gray-700 hover:bg-gray-600'}`}>
                             <i className={`fas fa-${isPlaying?'pause':'play'} text-xl translate-x-0.5`}></i>
                         </button>
                         <button onClick={() => setCurrentTime(duration)} className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-800" title="Fim">
                            <i className="fas fa-step-forward text-lg"></i>
                         </button>
                     </div>
                </div>
                
                {/* Right Panel: Properties */}
                <div className="w-72 bg-gray-50 dark:bg-[#151515] border-l border-gray-200 dark:border-gray-700 p-3 flex flex-col z-20">
                     <div className="flex-1 flex flex-col gap-3">
                         {/* Time Display - Compact Grid */}
                         <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-white rounded border border-gray-300 shadow-sm">
                                <label className="text-[10px] text-gray-600 uppercase font-bold tracking-wider block">Duração</label>
                                <div className="font-mono text-lg text-black font-black leading-tight">{formatTime(Math.max(duration, currentTime))}</div>
                            </div>
                            <div className="p-2 bg-white rounded border border-gray-300 shadow-sm">
                                <label className="text-[10px] text-gray-600 uppercase font-bold tracking-wider block">Atual</label>
                                <div className="font-mono text-lg text-black font-black leading-tight">{formatTime(currentTime)}</div>
                            </div>
                         </div>

                         {/* Export Options */}
                         <div className="pt-2 border-t border-gray-300 dark:border-gray-700 flex flex-col gap-2">
                            <div>
                                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider block mb-1">Formato</label>
                                <select 
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-1.5 text-xs text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                    onChange={(e) => console.log('Format:', e.target.value)} 
                                >
                                    <option value="mp4">MP4 (Padrão)</option>
                                    <option value="mp3">MP3 (Apenas Áudio)</option>
                                    <option value="webm">WebM (Web)</option>
                                    <option value="gif">GIF Animado</option>
                                    <option value="avi">AVI</option>
                                    <option value="mov">MOV</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider block mb-1">Qualidade</label>
                                <select 
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded p-1.5 text-xs text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-blue-500 outline-none transition-colors"
                                    onChange={(e) => console.log('Quality:', e.target.value)} 
                                >
                                    <option value="high">Alta (Original)</option>
                                    <option value="medium">Média (Balanceada)</option>
                                    <option value="low">Baixa (Menor arquivo)</option>
                                </select>
                            </div>
                         </div>

                         {/* Spacer to push button down if needed, or just keep it tight */}
                         <div className="flex-1"></div>

                         {/* Action Button */}
                         <button onClick={handleRender} disabled={processing} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 uppercase tracking-wide text-xs transition-transform transform active:scale-95">
                            {processing ? `Exportando ${progress}%` : 'Exportar Projeto'}
                         </button>
                     </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="h-[45vh] flex flex-col border-t border-gray-300 dark:border-gray-700 bg-[#e5e7eb] dark:bg-[#0f0f0f]">
                 {/* TOOLBAR: Contains 'TIMELINE' label AND Add Track Buttons (AS REQUESTED) */}
                 <div className="h-12 bg-gray-100 dark:bg-[#181818] border-b border-gray-300 dark:border-gray-700 flex items-center px-4 justify-between z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-xs text-gray-500 uppercase tracking-wider">Timeline</span>
                        
                        {/* RESTORED ADD TRACK BUTTONS NEXT TO TIMELINE LABEL */}
                        <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
                        <div className="flex gap-2">
                             <button onClick={() => addTrack('video')} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs font-semibold border border-blue-200 dark:border-blue-800 flex items-center gap-2 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">
                                <i className="fas fa-video"></i> + Vídeo
                            </button>
                            <button onClick={() => addTrack('audio')} className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded text-xs font-semibold border border-green-200 dark:border-green-800 flex items-center gap-2 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                <i className="fas fa-music"></i> + Áudio
                            </button>
                        </div>
                    </div>

                     <div className="flex items-center gap-2">
                        <i className="fas fa-search-minus text-gray-500 text-xs"></i>
                        <input type="range" min="5" max="100" value={zoom} onChange={e=>setZoom(Number(e.target.value))} className="w-32 h-1 bg-gray-400 rounded-lg cursor-pointer accent-blue-500"/>
                        <i className="fas fa-search-plus text-gray-500 text-xs"></i>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Track Headers */}
                    <div className="w-40 flex-shrink-0 bg-gray-50 dark:bg-[#1a1a1a] border-r border-gray-300 dark:border-gray-700 relative z-20 flex flex-col shadow-lg">
                        <div className="h-8 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-[#202020] flex items-center justify-center text-[10px] text-gray-500 font-bold tracking-wider">FAIXAS</div> 
                        <div className="flex-1 overflow-hidden overflow-y-auto">
                            {tracks.map((track) => (
                                <div key={track.id} className="border-b border-gray-300 dark:border-gray-700 p-2 flex flex-col justify-center relative group bg-gray-50 dark:bg-[#1a1a1a] transition-colors hover:bg-gray-100 dark:hover:bg-[#252525]" style={{ height: TRACK_HEIGHT }}>
                                    <div className={`font-bold text-xs text-gray-700 dark:text-gray-200 truncate border-l-4 pl-2 mb-2 ${track.muted ? 'border-gray-500' : 'border-'+(track.color || 'blue')+'-500'}`}>
                                        {track.name}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {/* (+) Button ON THE LAYER to upload media directly */}
                                        <button 
                                            onClick={() => triggerTrackUpload(track.id)}
                                            className="w-6 h-6 flex items-center justify-center rounded bg-blue-600 hover:bg-blue-500 text-white text-[10px] shadow transition-transform hover:scale-110"
                                            title="Adicionar mídia a esta faixa"
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>

                                        <div className="flex gap-2">
                                            <button onClick={() => toggleTrackHidden(track.id)} className={`text-xs w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${track.hidden?'text-red-500':'text-gray-400'}`}><i className={`fas fa-${track.hidden?'eye-slash':'eye'}`}></i></button>
                                            <button onClick={() => toggleTrackMute(track.id)} className={`text-xs w-6 h-6 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${track.muted?'text-red-500':'text-gray-400'}`}><i className={`fas fa-${track.muted?'volume-mute':'volume-up'}`}></i></button>
                                            <button onClick={() => removeTrack(track.id)} className="text-xs w-6 h-6 rounded hover:bg-red-900/30 text-gray-400 hover:text-red-500"><i className="fas fa-trash"></i></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Infinite Timeline Area */}
                    <div className="flex-1 overflow-auto relative bg-[#e0e0e0] dark:bg-[#121212] custom-scrollbar" ref={timelineRef}>
                         {/* Ruler: Width calculated to be huge (Infinite feel) */}
                         <div style={{ width: `${Math.max(duration * zoom + 5000, 20000)}px`, minWidth: '100%' }}>
                             <div className="h-8 bg-gray-200 dark:bg-[#202020] border-b border-gray-300 dark:border-gray-600 sticky top-0 z-10 cursor-pointer select-none flex items-end shadow-sm" onClick={handleTimelineClick}>
                                {/* Render ticks efficiently - only render roughly what's needed or use a background image for simple ticks if optimized, 
                                    but for now we map. 20000px / zoom(20) = 1000 ticks. React can handle 1000 divs fine. */}
                                {Array.from({ length: Math.ceil(Math.max(duration + 300, 2000)) }).map((_, i) => (
                                    <div key={i} className="absolute bottom-0 border-l border-gray-400 dark:border-gray-600 pl-1 text-[9px] text-gray-500 select-none pointer-events-none" style={{ left: i * zoom, height: i % 5 === 0 ? '100%' : '30%' }}>
                                        {i % 5 === 0 ? formatTime(i) : ''}
                                    </div>
                                ))}
                             </div>

                             {/* Tracks Content */}
                             <div className="relative">
                                {tracks.map((track) => (
                                    <div key={track.id} className="relative border-b border-gray-300 dark:border-gray-800 bg-opacity-50" style={{ height: TRACK_HEIGHT }} 
                                         onDragOver={handleTrackDragOver} onDrop={(e) => handleTrackDrop(e, track.id)}>
                                        {/* Grid lines helper */}
                                        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: `linear-gradient(90deg, #888 1px, transparent 1px)`, backgroundSize: `${zoom}px 100%` }}></div>
                                        
                                        {track.clips.map((clip) => (
                                            <div
                                                key={clip.id}
                                                className={`absolute top-2 bottom-2 rounded-md overflow-hidden cursor-move select-none shadow-lg flex items-center px-2 group ${colorClasses[track.color || (track.type==='audio'?'green':'blue')] || 'bg-blue-600'} text- white border border-white/20 ring-1 ring-black/10`}
                                                style={{ left: clip.startTime * zoom, width: clip.duration * zoom }}
                                                onMouseDown={(e) => handleDragStart(e, track.id, clip)}
                                            >
                                                {/* Resize Handles */}
                                                <div className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize bg-black/20 hover:bg-white/50 z-10 resize-handle" onMouseDown={(e) => handleResizeStart(e, track.id, clip, 'start')}></div>
                                                <div className="absolute right-0 top-0 bottom-0 w-3 cursor-ew-resize bg-black/20 hover:bg-white/50 z-10 resize-handle" onMouseDown={(e) => handleResizeStart(e, track.id, clip, 'end')}></div>
                                                
                                                {/* Clip Content */}
                                                <div className="flex-1 min-w-0 pr-2 pointer-events-none">
                                                    <div className="text-xs font-bold truncate text-white drop-shadow-md">{clip.name}</div>
                                                    <div className="text-[10px] opacity-80 text-white drop-shadow-md">{clip.duration.toFixed(1)}s</div>
                                                </div>

                                                {/* Delete Button (Hover) */}
                                                <button 
                                                    className="w-5 h-5 bg-black/50 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-auto"
                                                    onClick={(e) => { e.stopPropagation(); removeClip(track.id, clip.id); }}
                                                    title="Remover clip"
                                                >
                                                    <i className="fas fa-times text-xs"></i>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                
                                {/* Playhead */}
                                <div 
                                    className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none"
                                    style={{ left: currentTime * zoom, height: tracks.length * TRACK_HEIGHT + 32 }}
                                >
                                    <div className="w-3 h-3 bg-red-500 -ml-1.5 transform rotate-45 -mt-1.5 shadow-sm"></div>
                                </div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
