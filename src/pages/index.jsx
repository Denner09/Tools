import React from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import AppNavbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';

const Home = () => {
  return (
    <div className="min-h-screen font-sans transition-colors duration-300" 
         style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)' }}>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-orange-200/40 via-orange-100/20 to-transparent dark:from-orange-600/20 dark:via-orange-900/10 dark:to-transparent blur-3xl -z-10 pointer-events-none transition-colors duration-500" />
        
        <div className="max-w-7xl mx-auto px-4 pt-32 pb-20 text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 drop-shadow-sm dark:drop-shadow-lg transition-colors" style={{ color: 'var(--text-main)' }}>
                Potencialize seu <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-600">Trabalho</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light transition-colors" style={{ color: 'var(--text-muted)' }}>
                Ferramentas essenciais para gestão, documentos e processos executivos.
                <br />
                <span className="text-orange-500/80">Simples, rápido e direto no seu navegador.</span>
            </p>
        </div>
      </div>

      {/* Tools Grid */}
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

        </div>
      </div>
    </div>
  );
};

export default Home;
