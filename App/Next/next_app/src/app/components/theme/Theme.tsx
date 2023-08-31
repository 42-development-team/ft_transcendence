"use client";
import { useState } from 'react';

export const Theme = ({children}: {children: React.ReactNode}) => {
    const [theme, setTheme] = useState("mocha");
    const toggleTheme = () => {
  setTheme((currentTheme) => currentTheme === "mocha" ? "latte" : "mocha");
    };

  return (
    <body className={`${theme}`}>
      <div className='fixed z-10'>
        <button onClick={toggleTheme}>Switch Theme</button>
        </div>
        {children}
    </body>
    );
};

