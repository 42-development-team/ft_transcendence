"use client";
import React, { use, useContext, useEffect, useState } from 'react';
import ThemeContext from '../theme/themeContext';
import CustomBtn from '../CustomBtn';

const OverlayMessage = ({ message, surrender, id, userId } : { message: any, surrender: (id: number, userId: number) => void, id: string, userId: string}) => {
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
    <div className={`fixed inset-0 flex flex-col items-center justify-center w-[auto] h-[auto] z-1 ${textColor} bg-base bg-opacity-20 backdrop-blur-xl`}>
      <div className="flex text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-center">{message}</div>
        <div className='flex'>
            <CustomBtn onClick={() => surrender(parseInt(id), parseInt(userId))} color='bg-red' disable={false} >Surrender</CustomBtn>
        </div>
    </div>
  );
}

export default OverlayMessage;