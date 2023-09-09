'use client';

import React, { useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Image from 'next/image';
import homeBackground from '../../../../public/backGroundDark.png';
import homeBackgroundLight from '../../../../public/backgroundLightUpscale.png';
import themeContext from "./themeContext";
import './styleBackground.css'

export const BackgroundBall = () => {

    const { theme, setTheme } = useContext(themeContext);
    const [entered, setEntered] = useState<boolean>(false);
    

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      setEntered(true);
    }, 300);
  }, [theme]);

    console.log("tu est nul en css et en html et en js et en php et en python et en c et en c++ et en c# et en java et en ruby et en swift et en kotlin et en g et en go et en rust et en r et en r# et ");
    return (
        <div >
            <TransitionGroup>
                <CSSTransition
                    key={localStorage.getItem('theme')}
                    in={entered}
                    appear={true}
                    timeout={900}
                    classNames="fade"
                    // unmountOnExit
                    mountOnEnter
                    // mountOnEnter={false}
                >
                    <img
                        src={ typeof window !== "undefined" && localStorage.getItem("theme") === "latte" ? homeBackgroundLight.src : homeBackground.src}
                        alt="Bg"
                        className="blur-lg -z-10 fixed w-full h-full object-cover"
                    />
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}