'use client';

import Image from 'next/image';
import sun from "../../../../public/sun.png";
import sunLight from "../../../../public/sunLight.png";
import { useContext, useEffect } from "react";
import themeContext from './themeContext';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import homeBackground from '../../../../public/background_11-min.webp';
import homeBackgroundLight from '../../../../public/backgroundLight_11-min.webp';
import { CustomImage } from '../CustomImage';

export const Theme = () => {

    const { theme, setTheme } = useContext(themeContext);

    const handleThemeChange = () => {
        if (typeof window === 'undefined')
            return;
        const themeStored = localStorage.getItem('theme');
        if (themeStored) {
            const newTheme = themeStored === 'mocha' ? 'latte' : 'mocha';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        } else {
            localStorage.setItem('theme', 'mocha');
            setTheme('mocha');
        }
    };

    return (
        <div className='flex flex-row'>
            <div className='flex flex-col justify-center'>
                <div className="relative inline-block h-4 w-8 cursor-pointer rounded-full">
                    <input
                        id="switch-component"
                        type="checkbox"
                        className="peer absolute h-4 w-8 cursor-pointer appearance-none rounded-full bg-overlay0 transition-colors duration-300 checked:bg-pink-500 peer-checked:border-pink-500 peer-checked:before:bg-pink-500"
                        onClick={handleThemeChange}
                        defaultChecked={typeof window !== 'undefined' && localStorage.getItem('theme') === "latte"}
                    />
                    <label
                        htmlFor="switch-component"
                        className={`before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-pink-500 peer-checked:before:bg-pink-500`}
                    >
                        <div
                            className="top-2/4 left-2/4 inline-block -translate-x-2/4 -translate-y-2/4 rounded-full p-5"
                            data-ripple-dark="true"
                        ></div>
                    </label>
                </div>
            </div>
            <div className='flex'>
                {
                    sun && sunLight ? (
                        theme === 'mocha' ? (
                            <CustomImage url={sunLight.src} size={22}/>
                        ) : (
                            <CustomImage url={sun.src} size={22}/>
                        )
                    ) : (
                        <div className="m-2">☀️</div>
                    )
                }
            </div>
        </div>
    )
}