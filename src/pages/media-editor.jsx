
import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useMedia } from '../context/MediaContext';

const AudioEditor = dynamic(() => import('../components/media/AudioEditor'), { ssr: false });
const VideoEditor = dynamic(() => import('../components/media/VideoEditor'), { ssr: false });

export default function MediaEditor() {
  const { activeTab } = useMedia();

  return (
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}>
      <Head>
        <title>Editor de Mídia | Business Tools</title>
        <meta name="description" content="Edite áudio e vídeo online: cortar, juntar, converter e comprimir." />
      </Head>

      {/* Header removed - using Global Navbar */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
          
        {/* Ambient Background Lights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="transition-all duration-500 animate-fade-in-up">
            {activeTab === 'audio' ? (
                <div key="audio-tab">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Editor de Áudio</h2>
                        <p className="text-gray-500 dark:text-gray-400">Corte, junte e converta seus arquivos de áudio.</p>
                    </div>
                    <AudioEditor />
                </div>
            ) : (
                <div key="video-tab">
                     <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Editor de Vídeo</h2>
                        <p className="text-gray-500 dark:text-gray-400">Edição simples e rápida para seus vídeos.</p>
                    </div>
                    <VideoEditor />
                </div>
            )}
        </div>
      </main>
    </div>
  );
}
