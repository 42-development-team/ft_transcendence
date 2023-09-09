"use client";

import { useEffect, useState } from 'react';
import {useContext} from "react";
import ThemeContext from './themeContext';

export const Body = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (typeof window === 'undefined') 
      return;
    const themeStored = localStorage.getItem('theme');
    if (themeStored) {
      setTheme(themeStored);
    }
    else {
      localStorage.setItem('theme', 'mocha');
      setTheme('mocha');
    }
  }, []);

  return (
    <body className={`${theme} flex flex-col h-screen` }>
      {children}
    </body>
  );
};

