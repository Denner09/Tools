
import { useState, useRef, useEffect } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export function useFFmpeg() {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const ffmpegRef = useRef(null);
  const messageRef = useRef(null);
  const [message, setMessage] = useState('Carregando FFmpeg...');

  const load = async () => {
    if (loaded) return;
    setLoading(true);
    
    if (!ffmpegRef.current) {
        ffmpegRef.current = new FFmpeg();
    }
    
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd';
    const ffmpeg = ffmpegRef.current;
    
    ffmpeg.on('log', ({ message }) => {
        setMessage(message);
        console.log(message);
    });

    try {
        const coreBlobURL = await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript');
        const wasmBlobURL = await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm');

        await ffmpeg.load({
            coreURL: coreBlobURL,
            wasmURL: wasmBlobURL,
        });
        setLoaded(true);
    } catch (e) {
        console.error("FFmpeg load failed:", e);
        setMessage("Erro ao carregar FFmpeg: " + e.message);
    } finally {
        setLoading(false);
    }
  };

  return { ffmpeg: ffmpegRef.current, ffmpegRef, loaded, loading, load, message };
}
