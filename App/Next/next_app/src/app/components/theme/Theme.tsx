"use client";

import { useState } from 'react';
import Image from 'next/image';
import sun from '../../../../../public/App/Next/sun.png';

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
    <body className={`${theme} flex flex-col h-screen`}>
      <div className='fixed flex flex-row z-10 top-4 right-[6.9rem]'>
        <div className="static">
          <div className="inline-flex items-center">
            <div className="relative inline-block h-4 w-8 cursor-pointer rounded-full">
              <input
                id="switch-component"
                type="checkbox"
                className="peer absolute h-4 w-8 cursor-pointer appearance-none rounded-full bg-overlay0 transition-colors duration-300 checked:bg-pink-500 peer-checked:border-pink-500 peer-checked:before:bg-pink-500"
                onClick={toggleTheme}
              />
              <label
                htmlFor="switch-component"
                className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-pink-500 peer-checked:before:bg-pink-500"
              >
                <div
                  className="top-2/4 left-2/4 inline-block -translate-x-2/4 -translate-y-2/4 rounded-full p-5"
                  data-ripple-dark="true"
                ></div>
              </label>
            </div>
          </div>
        </div>
        <Image className={"m-2"} alt="Sun" src={sun} height={32} width={32}/>
      </div>
      {children}
    </body>
  );
};

