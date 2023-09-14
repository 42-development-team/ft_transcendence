    'use client';
    import { createContext } from 'react';

    const ThemeContext = createContext({
      theme: localStorage.getItem("theme") ? localStorage.getItem("theme") : 'mocha',
      setTheme: (theme: any) => {}
    });


    export default ThemeContext;