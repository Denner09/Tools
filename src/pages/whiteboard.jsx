import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamic import for client-side rendering only (Excalidraw depends on window)
const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-gray-500">Carregando Quadro Branco...</div>,
  }
);

export default function Whiteboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] w-full flex flex-col bg-white">
      <Head>
        <title>Quadro Branco (Excalidraw)</title>
      </Head>
      <div className="flex-1 w-full h-full relative">
         {isClient && <Excalidraw langCode="pt-BR" />}
      </div>
    </div>
  );
}
