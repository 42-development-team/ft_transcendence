'use client';

import React, { useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Image from 'next/image';
import homeBackground from '../../../../public/backgroundUpscale.png';
import homeBackgroundLight from '../../../../public/backgroundLightUpscale.png';
import themeContext from "./themeContext";
import './styleBackground.css'

export const BackgroundBall = () => {

    const [isThemeChanged, setIsThemeChanged] = useState(false);
    const { theme } = useContext(themeContext);

  useEffect(() => {
    setIsThemeChanged(true);
    const timeout = setTimeout(() => {
      setIsThemeChanged(false);
    }, 1800);

    return () => clearTimeout(timeout);
  }, [theme]);
    return (
        <div >
            <TransitionGroup>
                <CSSTransition
                    key={localStorage.getItem('theme')}
                    in={isThemeChanged}
                    appear={true}
                    timeout={1800}
                    classNames="fade"
                    unmountOnExit
                >
                    <img
                        src={typeof window !== "undefined" && localStorage.getItem("theme") === "latte" ? homeBackgroundLight.src : homeBackground.src || theme}
                        alt="Bg"
                        className=" blur-md -z-10 fixed w-full h-full object-cover"
                    />
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}