
/* MediaEditor.jsx - Invalidate Cache */
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useMedia } from '../context/MediaContext';

const AudioEditor = dynamic(() => import('../components/media/AudioEditor'), { ssr: false });
const VideoEditor = dynamic(() => import('../components/media/VideoEditor'), { ssr: false });
const ImageEditor = dynamic(() => import('../components/media/ImageEditor'), { ssr: false });

export default function MediaEditor() {
  const { activeTab } = useMedia();

  return (
    <div className="h-full font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}>
      <Head>
        <title>Editor de Mídia | Business Tools</title>
        <meta name="description" content="Edite áudio, vídeo e imagens online." />
      </Head>

      {/* Header removed - using Global Navbar */}

      {/* Main Content */}
      <main className="w-full h-[calc(100vh-80px)] relative bg-gray-50 dark:bg-[#0f0f0f] overflow-hidden">
        <div className="h-full w-full">
            {activeTab === 'audio' && (
                <div key="audio-tab" className="h-full">
                    <AudioEditor />
                </div>
            )}
            {activeTab === 'video' && (
                <div key="video-tab" className="h-full">
                    <VideoEditor />
                </div>
            )}
            {/* Editor de Imagem - Em desenvolvimento
            {activeTab === 'image' && (
                <div key="image-tab" className="h-full">
                    <ImageEditor />
                </div>
            )}
            */}
        </div>
      </main>
    </div>
  );
}
