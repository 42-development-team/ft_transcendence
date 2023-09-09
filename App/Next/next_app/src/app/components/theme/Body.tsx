"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import sun from "../../../../public/sun.png";
import sunLight from "../../../../public/sunLight.png";
import {useContext} from "react";
import ThemeContext from './themeContext';

export const Body = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useContext(ThemeContext);

  useEffect(() => {
    if (typeof window === 'undefined') 
      return;

    if (localStorage.getItem("theme") === null) {
      localStorage.setItem("theme", "mocha");
      setTheme("mocha");
    }
    else {
        
        if ( theme !== undefined && theme !== null && theme !== localStorage.getItem("theme")) {
          localStorage.setItem("theme", theme);
        } else if (theme === undefined || theme === null) {
            setTheme(localStorage.getItem("theme") || "mocha");
        }
    }
  }, []);

  return (
    <body className={`${theme} flex flex-col h-screen` }>
      {children}
    </body>
  );
};

