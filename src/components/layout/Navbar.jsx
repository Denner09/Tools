import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import logo from '../../assets/logo.png';
import ThemeToggle from '../ThemeToggle'; // We'll need to check this path
import clsx from 'clsx';
import Button from '../ui/Button'; // Integrating our new Button component

const Navbar = ({ centerContent, rightContent, hideMenu = false }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const isHomePage = router.pathname === '/';

    return (
        <nav 
            className="fixed top-0 w-full z-50 border-b backdrop-blur-md transition-colors duration-300"
            style={{ 
                backgroundColor: 'var(--bg-card)', 
                borderColor: 'var(--border-card)',
                height: '80px'
            }}
        >
            <div className={clsx(
                "h-20 flex items-center justify-between px-6",
                (isHomePage && !centerContent) ? "max-w-7xl mx-auto" : "w-full"
            )}>
                
                {/* Left: Logo */}
                <Link href="/" className="flex items-center gap-3 group text-decoration-none focus:outline-none shrink-0">
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
                </Link>

                {/* Center Content (for BPMN or other tools) */}
                {centerContent && (
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                        {centerContent}
                    </div>
                )}

                {/* Right: Menu & Actions */}
                <div className="flex items-center gap-6">
                    
                    {/* Desktop View */}
                    <div className="flex items-center gap-8">
                        <ThemeToggle />
                        
                        {!hideMenu && (
                            <>
                                {rightContent ? (
                                    // Custom Right Content (e.g., BPMN Menu)
                                    rightContent
                                ) : (
                                    // Default Logic
                                    <>
                                        {isHomePage ? (
                                            null // Hidden on home page
                                        ) : (
                                            <Link 
                                                href="/" 
                                                className="flex items-center gap-2 text-sm font-medium hover:text-orange-500 transition-colors px-4 py-2 rounded-lg border hover:border-orange-500/30 no-underline text-decoration-none"
                                                style={{ color: 'var(--text-main)', borderColor: 'var(--border-card)', textDecoration: 'none' }}
                                            >
                                                <i className="fas fa-arrow-left text-xs"></i>
                                                Voltar
                                            </Link>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle (Only on Home Page) */}
                    {(isHomePage && !hideMenu && !rightContent) && (
                        <button 
                            className="md:hidden hover:text-orange-500"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={{ color: 'var(--text-muted)' }}
                        >
                            <i className="fas fa-bars fa-lg"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {(isMenuOpen && isHomePage && !hideMenu && !rightContent) && (
                <div 
                    className="md:hidden border-b"
                    style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-card)' }}
                >
                    <div className="px-4 py-2 space-y-1">
                        <Link href="/pdf-tools" className="block px-3 py-3 rounded-md text-base font-medium hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: 'var(--text-main)' }}>Ferramentas PDF</Link>
                        <Link href="/bpmn" className="block px-3 py-3 rounded-md text-base font-medium hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: 'var(--text-main)' }}>Modelador BPMN</Link>
                        <Link href="/text-editor" className="block px-3 py-3 rounded-md text-base font-medium hover:text-orange-500 hover:bg-gray-100 dark:hover:bg-white/10" style={{ color: 'var(--text-main)' }}>Editor de Texto</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
