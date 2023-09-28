"use client";
import React, { use, useContext, useEffect, useState } from 'react';
import ThemeContext from '../theme/themeContext';

const OverlayMessage = ({ message, surrender } : { message: any, surrender: (id: number, userId: number) => void}) => {
    const {theme} = useContext(ThemeContext);
    const [textColor, setTextColor] = useState<string>(theme === 'latte' ? 'text-gray-100' : 'text-text')
    useEffect(() => {
        if (theme === 'latte') {
            setTextColor('text-gray-100');
        }
        else {
            setTextColor('text-text');
        }
    }
    , [theme]);

  return (
    <div className={`fixed inset-0 flex items-center justify-center w-[auto] h-[auto] z-1 ${textColor} bg-base bg-opacity-20 backdrop-blur-xl`}>
      <div className=" text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-center">{message}</div>
    </div>
  );
}

export default OverlayMessage;