
import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js';
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js';
import { useFFmpeg } from '../../hooks/useFFmpeg';
import { fetchFile } from '@ffmpeg/util';

export default function AudioEditor() {
  const { ffmpegRef, load: loadFFmpeg, loaded: ffmpegLoaded, message: ffmpegMessage } = useFFmpeg();
  const containerRef = useRef(null);
  const timelineRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [regions, setRegions] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoom] = useState(10);
  const [activeMenu, setActiveMenu] = useState(null);

  // Initialize WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#fb923c', // Orange-400
      progressColor: '#ea580c', // Orange-600
      cursorColor: '#ea580c',
      barWidth: 2,
      barGap: 3,
      responsive: true,
      height: 150,
      plugins: [
        RegionsPlugin.create({}),
        TimelinePlugin.create({ container: timelineRef.current })
      ],
    });

    const wsRegions = ws.registerPlugin(RegionsPlugin.create());
    
    wsRegions.enableDragSelection({
        color: 'rgba(255, 0, 0, 0.1)',
    });
    
    wsRegions.on('region-updated', (region) => {
        // region.start, region.end
    });

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    ws.on('ready', () => {
        setIsReady(true);
        ws.zoom(zoom);
    });
    ws.on('loading', () => setIsReady(false));
    ws.on('destroy', () => setIsReady(false));

    setRegions(wsRegions);
    setWavesurfer(ws);

    return () => {
      ws.destroy();
    };
  }, []);

  useEffect(() => {
    if (wavesurfer && zoom && isReady) {
        wavesurfer.zoom(zoom);
    }
  }, [zoom, wavesurfer, isReady]);

  // Click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
        if (activeMenu && !event.target.closest('.relative.group')) {
            setActiveMenu(null);
        }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  const toggleMenu = (menu, e) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      const url = URL.createObjectURL(uploadedFile);
      wavesurfer.load(url);
      setStatus('Arquivo carregado.');
    }
  };

  const ensureFFmpeg = async () => {
    if (!ffmpegLoaded || !ffmpegRef.current) {
        setStatus('Carregando núcleo de processamento...');
        await loadFFmpeg();
        setStatus('Núcleo carregado.');
    }
  };

  const handleCut = async () => {
    const activeRegions = regions.getRegions();
    if (activeRegions.length === 0) {
        alert('Selecione uma região para cortar (arraste no áudio).');
        return;
    }
    
    await ensureFFmpeg();
    setProcessing(true);
    setStatus('Processando corte...');

    try {
        const ffmpeg = ffmpegRef.current;
        if (!ffmpeg) throw new Error("FFmpeg not loaded properly");

        const ext = getExt(file.name);
        const inputName = 'input' + ext;
        const outputName = 'output' + ext; 
        
        await ffmpeg.writeFile(inputName, await fetchFile(file));
        
        const region = activeRegions[0];
        const start = region.start;
        const end = region.end;
        
        // Use simpler filter for stability, re-encoding to preserve format integrity
        await ffmpeg.exec([
            '-i', inputName,
            '-filter_complex', `[0:a]atrim=start=0:end=${start},asetpts=PTS-STARTPTS[a1];[0:a]atrim=start=${end},asetpts=PTS-STARTPTS[a2];[a1][a2]concat=n=2:v=0:a=1[out]`,
            '-map', '[out]',
            // Try to match input quality if possible, or high default
            '-b:a', '320k', 
            outputName
        ]);

        const data = await ffmpeg.readFile(outputName);
        const url = URL.createObjectURL(new Blob([data.buffer], { type: file.type || 'audio/mp3' }));
        
        wavesurfer.load(url);
        regions.clearRegions();
        
        const newFile = new File([data.buffer], "edited_" + file.name, { type: file.type || 'audio/mp3' });
        setFile(newFile);
        
        setStatus('Corte concluído.');

    } catch (error) {
        console.error(error);
        setStatus('Erro no processamento. Tente recarregar a página.');
    }
    setProcessing(false);
  };

  const handleConvert = async (format, bitrate = null) => {
      if (!file) return;
      await ensureFFmpeg();
      setProcessing(true);
      setStatus(bitrate ? `Comprimindo para ${bitrate}...` : `Convertendo para ${format}...`);
      
      try {
          const ffmpeg = ffmpegRef.current;
          if (!ffmpeg) throw new Error("FFmpeg not loaded properly");

          const inputName = 'input' + getExt(file.name);
          const outputName = 'output.' + format;
          
          await ffmpeg.writeFile(inputName, await fetchFile(file));
          
          const args = ['-i', inputName];
          if (bitrate) {
              args.push('-b:a', bitrate);
          }
          args.push(outputName);
          
          await ffmpeg.exec(args);
          
          const data = await ffmpeg.readFile(outputName);
          downloadBlob(new Blob([data.buffer]), outputName);
          setStatus('Concluído.');
      } catch(e) {
          console.error(e);
          setStatus('Erro na operação.');
      }
      setProcessing(false);
  };

  const getExt = (filename) => {
      const parts = filename.split('.');
      return '.' + parts[parts.length-1];
  };

  const downloadBlob = (blob, filename) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  return (
    <div className="bg-[var(--bg-card)] text-[var(--text-main)] h-full w-full p-6 overflow-y-auto transition-colors duration-300">
      
      {/* Toolbar */}
      <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div className="flex gap-2">
            <label className="btn btn-primary bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                <i className="fas fa-upload mr-2"></i> Abrir Áudio
                <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
        </div>

        <div className="flex gap-2">
             <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg px-2">
                <i className="fas fa-search-minus text-gray-500"></i>
                <input type="range" min="1" max="100" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-24 accent-orange-500" />
                <i className="fas fa-search-plus text-gray-500"></i>
             </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-black/20">
        <div ref={containerRef} className="w-full"></div>
        <div ref={timelineRef} className="w-full"></div>
      </div>

      {/* Controls & Actions */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
            <button onClick={() => wavesurfer?.playPause()} className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30">
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </button>
            <button onClick={() => wavesurfer?.stop()} className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">
                <i className="fas fa-stop"></i>
            </button>
        </div>

        <div className="flex flex-wrap gap-2">
             <button onClick={handleCut} disabled={processing || !file} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50 transition-colors">
                <i className="fas fa-cut mr-2"></i> Cortar Seleção (Remover)
             </button>
             
             <div className="relative group">
                <button 
                    onClick={(e) => toggleMenu('convert', e)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center"
                >
                    <i className="fas fa-exchange-alt mr-2"></i> Converter <i className="fas fa-chevron-down ml-2 text-xs"></i>
                </button>
                {activeMenu === 'convert' && (
                    <div className="absolute bottom-full mb-2 w-48 bg-[var(--bg-card)] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50">
                        {['mp3', 'wav', 'ogg', 'aac'].map(fmt => (
                            <button 
                                key={fmt} 
                                onClick={() => { handleConvert(fmt); setActiveMenu(null); }} 
                                className="block w-full text-left px-4 py-2 text-[var(--text-main)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-sm mb-1 last:mb-0 transition-colors"
                            >
                                .{fmt.toUpperCase()}
                            </button>
                        ))}
                    </div>
                )}
             </div>
             
             <div className="relative group">
                <button 
                    disabled={processing || !file} 
                    onClick={(e) => toggleMenu('compress', e)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center"
                >
                    <i className="fas fa-compress mr-2"></i> Comprimir <i className="fas fa-chevron-down ml-2 text-xs"></i>
                </button>
                {activeMenu === 'compress' && (
                    <div className="absolute bottom-full mb-2 w-48 bg-[var(--bg-card)] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 z-50">
                        {[
                            { label: 'Baixa (64kbps)', bitrate: '64k' },
                            { label: 'Média (128kbps)', bitrate: '128k' },
                            { label: 'Alta (192kbps)', bitrate: '192k' },
                            { label: 'Muito Alta (320kbps)', bitrate: '320k' }
                        ].map(opt => (
                            <button 
                                key={opt.bitrate} 
                                onClick={() => { handleConvert('mp3', opt.bitrate); setActiveMenu(null); }} 
                                className="block w-full text-left px-4 py-2 text-[var(--text-main)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-sm mb-1 last:mb-0 transition-colors"
                            >
                                MP3 {opt.label}
                            </button>
                        ))}
                    </div>
                )}
             </div>

             <button onClick={() => {
                 if(file) downloadBlob(file, file.name);
             }} disabled={!file} className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg disabled:opacity-50 transition-colors">
                <i className="fas fa-download mr-2"></i> Baixar Atual
             </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mt-4 p-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 flex justify-between">
         <span>{status || (file ? file.name : 'Nenhum arquivo carregado')}</span>
         <span>{ffmpegLoaded ? 'Motor Pronto' : 'Motor Ocioso'}</span>
      </div>

    </div>
  );
}
