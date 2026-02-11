import React from 'react';
import Link from 'next/link';

import FeatureCard from '../components/FeatureCard';

const Home = () => {
  return (
    <div className="min-h-screen font-sans transition-colors duration-300" 
         style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}>
      
      {/* Seção Hero */}
      <div className="pb-12 md:pb-20 relative">
        <div className="w-full bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#ea580c] py-10 md:py-20 px-4 text-center shadow-[0_25px_50px_-12px_rgba(234,88,12,0.20)] rounded-b-[3rem] relative overflow-hidden isolate group">
            
            {/* Efeito Sutil de Textura/Brilho */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light pointer-events-none"></div>
            <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-white/10 to-transparent blur-3xl rounded-full opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity duration-700"></div>

            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-8 text-white drop-shadow-lg relative z-10 selection:bg-white/30">
                Potencialize seu Trabalho
            </h1>
            <p className="text-base md:text-xl text-gray-200 font-bold w-full whitespace-nowrap mx-auto leading-relaxed opacity-90 relative z-10 selection:bg-white/30">
                Ferramentas essenciais para gestão, documentos e processos executivos.
            </p>
        </div>
      </div>

      {/* Grid de Ferramentas */}
      <div className="max-w-7xl mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <FeatureCard 
                href="/pdf-tools"
                icon="fas fa-file-pdf"
                title="Ferramentas PDF"
                description="Comprimir, dividir, converter e redimensionar relatórios e documentos em PDF."
                buttonText="Acessar"
            />

            <FeatureCard 
                href="/bpmn"
                icon="fas fa-project-diagram"
                title="Modelador BPMN"
                description="Mapeie processos de negócio com o padrão BPMN 2.0. Exportação profissional."
                buttonText="Abrir"
            />

            <FeatureCard 
                href="/text-editor"
                icon="fas fa-pen-nib"
                title="Editor de Texto"
                description="Ferramentas de correção, formatação e conversão de texto com exportação."
                buttonText="Abrir"
            />

            <FeatureCard 
                href="/media-editor"
                icon="fas fa-photo-video"
                title="Editor de Mídia"
                description="Edite áudio e vídeo: corte, junte, converta e comprima arquivos multimídia."
                buttonText="Abrir"
            />




            <FeatureCard 
                href="/whiteboard"
                icon="fas fa-chalkboard"
                title="Quadro Branco"
                description="Desenhe fluxogramas e esboços livremente com a tecnologia Excalidraw."
                buttonText="Desenhar"
            />

        </div>
      </div>
    </div>
  );
};

export default Home;
