"use client";

import { useState } from 'react';

export const Theme = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "mocha");

  const toggleTheme = () => {
    switch (localStorage.getItem("theme")) {
      case "mocha":
        setTheme("latte");
        localStorage.setItem("theme", "latte");
        break;
      case "latte":
        setTheme("mocha");
        localStorage.setItem("theme", "mocha");
        break;
      default:
        setTheme("mocha");
        localStorage.setItem("theme", "mocha");

    };
  };

  return (
    <body className={`${theme}`}>
      <div className='fixed z-10 '>
        <button onClick={toggleTheme}>Switch Theme</button>
      </div>
      {children}
    </body>
  );
};

