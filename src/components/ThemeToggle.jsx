import React from 'react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

const ThemeToggle = () => {
    const { theme, toggleTheme, mounted } = useTheme();

    // Prevent hydration mismatch by rendering a placeholder or standard state until mounted
    // We keep the visual size identical to prevent layout shift
    if (!mounted) {
        return (
            <div className="w-14 h-8 rounded-full bg-slate-200 dark:bg-slate-800 p-1 flex items-center cursor-wait opacity-50">
               <div className="w-6 h-6 rounded-full bg-white shadow-md transform translate-x-0"></div>
            </div>
        );
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={clsx(
                "w-14 h-8 rounded-full p-1 flex items-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500",
                isDark ? "bg-slate-700" : "bg-slate-200"
            )}
            title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            aria-label="Alternar Tema"
        >
            <div
                className={clsx(
                    "w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 flex items-center justify-center",
                    isDark ? "translate-x-6 bg-slate-800" : "translate-x-0"
                )}
            >
                {isDark ? (
                    <i className="fas fa-moon text-indigo-400 text-[10px]"></i>
                ) : (
                    <i className="fas fa-sun text-orange-500 text-[10px]"></i>
                )}
            </div>
        </button>
    );
};

export default ThemeToggle;
