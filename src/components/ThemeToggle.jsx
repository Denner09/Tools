import React from 'react';
import { useTheme } from '../context/ThemeContext';
import clsx from 'clsx';

const ThemeToggle = () => {
    const { theme, toggleTheme, mounted } = useTheme();

    if (!mounted) {
        return (
             <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse"></div>
        );
    }

    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            className={clsx(
                "w-10 h-10 flex items-center justify-center rounded-lg border-none outline-none focus:outline-none shadow-none ring-0",
                isDark 
                    ? "bg-transparent text-orange-400" // Modo escuro
                    : "bg-transparent text-orange-500" // Modo claro
            )}
            style={{ border: 'none' }}
            title={isDark ? "Mudar para Modo Claro" : "Mudar para Modo Escuro"}
            aria-label="Alternar Tema"
        >
            <i className={clsx("fas text-lg", isDark ? "fa-moon" : "fa-sun")}></i>
        </button>
    );
};

export default ThemeToggle;
