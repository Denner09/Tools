import React from 'react';
import clsx from 'clsx';

const tools = [
    { id: 'merge', icon: 'fa-layer-group', label: 'Juntar PDF', subtitle: 'Combine múltiplos arquivos em um único PDF' },
    { id: 'split', icon: 'fa-cut', label: 'Dividir PDF', subtitle: 'Extraia páginas ou divida seu arquivo' },
    { id: 'compress', icon: 'fa-compress-arrows-alt', label: 'Comprimir PDF', subtitle: 'Reduza o tamanho do arquivo mantendo a qualidade' },
    { id: 'ocr', icon: 'fa-font', label: 'OCR e Texto', subtitle: 'Reconhecimento de texto e comparação' },
    { id: 'crop', icon: 'fa-crop-alt', label: 'Cortar', subtitle: 'Recorte partes específicas das páginas' },
    { id: 'rotate', icon: 'fa-sync-alt', label: 'Rotacionar', subtitle: 'Gire páginas ou todo o documento' },
    { id: 'number', icon: 'fa-list-ol', label: 'Numeração', subtitle: 'Adicione números de página personalizados' },
    { id: 'convert', icon: 'fa-exchange-alt', label: 'Converter', subtitle: 'Converta PDF para Word, Excel, JPG e mais' },
    { id: 'repair', icon: 'fa-wrench', label: 'Reparar PDF', subtitle: 'Analise e corrija arquivos corrompidos' },
];

const PDFToolsSidebar = ({ activeTool, setActiveTool, onToolChange }) => {
    return (
        <aside 
            className="hidden md:flex flex-col w-72 border-r fixed top-16 bottom-0 left-0 z-40 overflow-y-auto"
            style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-card)',
                top: '80px' // Adjust for new navbar height
            }}
        >
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-card)' }}>
                <div className="text-base font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Ferramentas PDF</div>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => { setActiveTool(tool.id); if(onToolChange) onToolChange(); }}
                        className={clsx(
                            "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all w-full text-left group",
                            activeTool === tool.id 
                                ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 shadow-sm ring-1 ring-orange-200 dark:ring-orange-800" 
                                : "hover:bg-gray-50 dark:hover:bg-white/5"
                        )}
                        style={{ 
                            color: activeTool === tool.id ? undefined : 'var(--text-muted)'
                        }}
                    >
                        <span className={clsx(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                            activeTool === tool.id ? "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400" : "bg-gray-100/50 dark:bg-white/5 text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-white/10"
                        )}>
                            <i className={`fas ${tool.icon}`}></i>
                        </span>
                        {tool.label}
                    </button>
                ))}
            </nav>
            <div className="p-4 bg-gray-50 dark:bg-white/5 border-t" style={{ borderColor: 'var(--border-card)' }}>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>Business Tools v1.0</p>
            </div>
        </aside>
    );
};

export default PDFToolsSidebar;
export { tools };
