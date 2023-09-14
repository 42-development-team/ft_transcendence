'use client';

import React, { useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Image from "next/image";
import logoWhite from "../../../../public/logoWhite.png";
import homeBackground from '../../../../public/background_11.png';
import homeBackgroundLight from '../../../../public/backgroundLight_11.png';
import themeContext from "./themeContext";
import './styleBackground.css'

export const BackgroundBall = () => {

    const { theme, setTheme } = useContext(themeContext);
    const [entered, setEntered] = useState<boolean>(false);
    let storage = typeof window !== "undefined" ? localStorage.getItem("theme") : "mocha";

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      setEntered(true);
    }, 300);
  }, [theme]);

    console.log("tu est nul en css et en html et en js et en php et en python et en c et en c++ et en c# et en java et en ruby et en swift et en kotlin et en g et en go et en rust et en r et en r# et ");
    return (
        <div >
            <Image src={logoWhite} alt="logo" className="fixed top-0 left-0 z-10 w-20 h-20 m-4" />
            <TransitionGroup>
                <CSSTransition
                    key={storage}
                    in={entered}
                    appear={true}
                    timeout={900}
                    classNames="fade"
                    mountOnEnter
                >
                    <img
                        src={ typeof window !== "undefined" && localStorage.getItem("theme") === "latte" ? homeBackgroundLight.src : homeBackground.src}
                        alt="Bg"
                        className="blur-md -z-10 fixed w-full h-full object-cover"
                    />
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}