    'use client';
    import { createContext } from 'react';

    const ThemeContext = createContext({
      theme: (typeof window == 'undefined' && localStorage.getItem("theme")) || 'mocha',
      setTheme: (theme: any) => {}
    });

    export default ThemeContext;