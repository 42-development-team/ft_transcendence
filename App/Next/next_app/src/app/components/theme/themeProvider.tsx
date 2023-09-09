    'use client';

    import { useState } from 'react';
    import ThemeContext from './themeContext';

    export default function ThemeProvider({ children }: any) {
      const [theme, setTheme] = useState('latte');

      return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
          {children}
        </ThemeContext.Provider>
      )
    }