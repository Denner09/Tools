import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import logo from '../assets/logo.png';
import ThemeToggle from './ThemeToggle';
import clsx from 'clsx';

const AppNavbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // A captura de tela mostra "Menu" com um dropdown
    // Implementaremos um Menu alinhado à direita.
    
    const router = useRouter();
    const isHomePage = router.pathname === '/';

    return (
        <nav 
            className="fixed top-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-300"
            style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-card)'
            }}
        >
            <div className={clsx(
                "h-20 flex items-center justify-between px-6",
                isHomePage ? "max-w-7xl mx-auto" : "w-full"
            )}>
                
                {/* Área do Logo */}
                <Link href="/" className="flex items-center gap-3 group text-decoration-none focus:outline-none">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
                        <img 
                            src={logo.src || logo} 
                            alt="Business Tools" 
                            className="h-8 w-auto relative z-10" 
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight transition-colors" style={{ color: 'var(--text-main)' }}>
                        Business <span className="text-orange-500">tools</span>
                    </span>
                    
                    {/* Botão de Configurações Removido */}
                </Link>

                {/* Lado Direito: Menu Dropdown */}
                <div className="flex items-center gap-6">
                    
                    {/* Estilo do Menu Desktop */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Alternar Tema - Switch Elegante */}
                        <ThemeToggle />
                        
                        <div className="relative group">
                            <button 
                                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors py-2"
                                style={{ color: 'var(--text-muted)' }}
                            >
                                Menu
                                <i className="fas fa-chevron-down text-[10px]"></i>
                            </button>
                            
                            {/* Menu Dropdown */}
                            <div 
                                className="absolute right-0 top-full mt-2 w-48 border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50"
                                style={{ 
                                    backgroundColor: 'var(--bg-card)', 
                                    borderColor: 'var(--border-card)'
                                }}
                            >
                                <Link 
                                    href="/" 
                                    className="block px-4 py-3 text-sm hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-white/5 first:rounded-t-xl transition-colors"
                                    style={{ color: 'var(--text-main)' }}
                                >
                                    Início
                                </Link>
                                <Link 
                                    href="/pdf-tools" 
                                    className="block px-4 py-3 text-sm hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    style={{ color: 'var(--text-main)' }}
                                >
                                    Ferramentas PDF
                                </Link>
                                <Link 
                                    href="/bpmn" 
                                    className="block px-4 py-3 text-sm hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    style={{ color: 'var(--text-main)' }}
                                >
                                    Modelador BPMN
                                </Link>
                                <Link 
                                    href="/text-editor" 
                                    className="block px-4 py-3 text-sm hover:text-orange-500 hover:bg-gray-50 dark:hover:bg-white/5 last:rounded-b-xl transition-colors"
                                    style={{ color: 'var(--text-main)' }}
                                >
                                    Editor de Texto
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Alternar Menu Mobile */}
                    <button 
                        className="md:hidden hover:text-orange-500"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{ color: 'var(--text-muted)' }}
                    >
                        <i className="fas fa-bars fa-lg"></i>
                    </button>
                </div>
            </div>

            {/* Overlay do Menu Mobile */}
            {isMenuOpen && (
                <div 
                    className="md:hidden border-b"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                    <div className="px-4 py-2 space-y-1">
                        <Link href="/" className="block px-3 py-3 rounded-md text-base font-medium hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: 'var(--text-main)' }}>Início</Link>
                        <Link href="/pdf-tools" className="block px-3 py-3 rounded-md text-base font-medium hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: 'var(--text-main)' }}>Ferramentas PDF</Link>
                        <Link href="/bpmn" className="block px-3 py-3 rounded-md text-base font-medium hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: 'var(--text-main)' }}>Modelador BPMN</Link>
                         <Link href="/text-editor" className="block px-3 py-3 rounded-md text-base font-medium hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: 'var(--text-main)' }}>Editor de Texto</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default AppNavbar;
