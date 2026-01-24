import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import logo from '../assets/logo.png';
import clsx from 'clsx';

const AppNavbar = () => {
    // Force dark theme visual for Navbar to match screenshot, regardless of context for now if preferred
    // But better to respect context but provide Good defaults.
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Screenshot shows "Menu" with a dropdown caret
    // We will implement a right-aligned Menu.
    
    return (
        <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a] border-b border-white/5 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-3 group text-decoration-none focus:outline-none">
                    <div className="relative">
                        <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 rounded-full group-hover:opacity-40 transition-opacity"></div>
                        <img 
                            src={logo.src || logo} 
                            alt="Business Tools" 
                            className="h-8 w-auto relative z-10" 
                        />
                    </div>
                    <span className="font-bold text-xl text-white tracking-tight">
                        Business <span className="text-orange-500">tools</span>
                    </span>
                    
                    {/* Settings Cog from screenshot */}
                    <button className="ml-2 text-gray-500 hover:text-white transition-colors">
                        <i className="fas fa-cog"></i>
                    </button>
                </Link>

                {/* Right Side: Menu Dropdown */}
                <div className="flex items-center gap-6">
                    
                    {/* Desktop Menu Link style */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Theme Toggle - Keep it subtle */}
                        <button 
                            onClick={toggleTheme}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                        >
                            <i className={clsx("fas text-xs", theme === 'dark' ? "fa-sun" : "fa-moon")}></i>
                        </button>

                        <div className="relative group">
                            <button className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider hover:text-white transition-colors py-2">
                                Menu
                                <i className="fas fa-chevron-down text-[10px] text-gray-500 group-hover:text-white transition-colors"></i>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#151515] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                <Link href="/" className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 first:rounded-t-xl">
                                    Início
                                </Link>
                                <Link href="/pdf-tools" className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5">
                                    Ferramentas PDF
                                </Link>
                                <Link href="/bpmn" className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5">
                                    Modelador BPMN
                                </Link>
                                <Link href="/text-editor" className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 last:rounded-b-xl">
                                    Editor de Texto
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button 
                        className="md:hidden text-gray-300 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <i className="fas fa-bars fa-lg"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#0a0a0a] border-b border-white/10">
                    <div className="px-4 py-2 space-y-1">
                        <Link href="/" className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">Início</Link>
                        <Link href="/pdf-tools" className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">Ferramentas PDF</Link>
                        <Link href="/bpmn" className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">Modelador BPMN</Link>
                         <Link href="/text-editor" className="block px-3 py-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10">Editor de Texto</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default AppNavbar;
