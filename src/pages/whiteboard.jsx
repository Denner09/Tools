import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { useTheme } from '../context/ThemeContext';

// Dynamic import to handle Excalidraw's client-side only nature
const ExcalidrawWrapper = dynamic(
  async () => {
    const mod = await import('@excalidraw/excalidraw');
    const { Excalidraw, MainMenu, WelcomeScreen } = mod;
    
    return function ExcalidrawComp({ theme }) {
        return (
            <Excalidraw 
                langCode="pt-BR" 
                theme={theme}
                UIOptions={{
                    canvasActions: {
                        changeViewBackgroundColor: true,
                        clearCanvas: true, 
                        loadScene: true,
                        saveToActiveFile: true,
                        toggleTheme: false, 
                        saveAsImage: true,
                        export: { saveFileToDisk: true }
                    },
                    allowStateController: true,
                }}
            >
                <MainMenu>
                    <MainMenu.DefaultItems.LoadScene />
                    <MainMenu.DefaultItems.SaveToActiveFile />
                    <MainMenu.DefaultItems.Export /> 
                    <MainMenu.DefaultItems.SaveAsImage /> 
                    
                    <MainMenu.Separator />
                    
                    <MainMenu.Item 
                        icon={
                            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="file-pdf" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style={{ width: '1em', height: '1em' }}>
                                <path fill="currentColor" d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9z"></path>
                            </svg>
                        }
                        className="custom-pdf-export"
                        onSelect={() => {
                            setTimeout(() => window.print(), 100);
                        }}
                    >
                        Exportar para PDF
                    </MainMenu.Item>

                    <MainMenu.Separator />
                    
                    <MainMenu.DefaultItems.ClearCanvas />
                    <MainMenu.DefaultItems.ChangeCanvasBackground />
                    <MainMenu.DefaultItems.Help />
                </MainMenu>
            </Excalidraw>
        );
    };
  },
  {
    ssr: false,
    loading: () => <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Carregando Quadro Branco...</div>,
  }
);

export default function Whiteboard() {
  const [isClient, setIsClient] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-col bg-white dark:bg-[#121212] overflow-hidden">
      <Head>
        <title>Quadro Branco (Excalidraw)</title>
      </Head>
      <style jsx global>{`
        /* Hide Excalidraw Help Button */
        .excalidraw .layer-ui__wrapper__footer-right {
           display: none !important;
        }

        /* Elevate the entire UI layer of Excalidraw */
        .excalidraw .layer-ui__wrapper {
            z-index: 50 !important; /* Match Navbar z-index */
        }

        /* 
           CRITICAL FIX: Bootstrap Conflict Resolution
           Bootstrap's .dropdown-menu class has 'display: none'.
           Excalidraw uses the same class name for its menu but expects it to be visible when rendered.
           We must override Bootstrap's style specifically for Excalidraw.
        */
        .excalidraw .dropdown-menu {
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            position: absolute !important;
            /* Ensure it has a background and isn't transparent */
            background-color: var(--bg-card) !important;
            border: 1px solid var(--border-card) !important;
            box-shadow: var(--shadow-card) !important;
        }
        
        .excalidraw .dropdown-menu-container {
             z-index: 100 !important;
        }

        /* Ensure the menu button is clickable */
        .excalidraw .dropdown-menu-button {
            pointer-events: all !important;
        }
      `}</style>
      
      <div className="flex-1 w-full h-full relative">
         <ExcalidrawWrapper theme={theme} />
      </div>
    </div>
  );
}
