// ThemeContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Cria o Contexto
const ThemeContext = createContext();

// Hook customizado para facilitar o uso
export const useTheme = () => useContext(ThemeContext);

// 2. Cria o Provedor do Contexto
export const ThemeProvider = ({ children }) => {
  // Lógica que você já tinha: estado e leitura inicial do localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Lógica que você já tinha: aplica a classe no <html> e salva no localStorage
  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
    // Opcional: Adiciona/remove o atributo 'data-theme' também
    html.setAttribute('data-theme', isDarkMode ? 'dark' : 'light'); 
  }, [isDarkMode]);

  // Função para alternar o estado
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // 3. O Provider expõe o estado e a função para alterar
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};