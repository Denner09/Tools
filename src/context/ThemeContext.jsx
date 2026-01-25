import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Inicializa como 'light' para evitar incompatibilidade de hidratação (SSR vs Client)
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Efeito para sincronizar com localStorage e System Preference após a montagem
  useEffect(() => {
    setMounted(true);
    
    // Tenta obter do localStorage
    const storedTheme = window.localStorage.getItem('theme');
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Se não houver preferência salva, verifica a preferência do sistema
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Evita execução no servidor ou antes da montagem
    if (!mounted) return;

    const root = window.document.documentElement;
    
    // Aplicação da classe 'dark' no elemento raiz (<html>)
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Persistência da escolha
    window.localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  // Função memoizada para evitar recriação desnecessária
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  // Valor do contexto memoizado
  const contextValue = React.useMemo(() => ({
    theme,
    toggleTheme,
    mounted
  }), [theme, toggleTheme, mounted]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
