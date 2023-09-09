'use client';

import React, { useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Image from 'next/image';
import homeBackground from '../../../../public/backgroundUpscale.png';
import homeBackgroundLight from '../../../../public/backgroundLightUpscale.png';
import themeContext from "./themeContext";
import './styleBackground.css'

export const BackgroundBall = () => {

    const { theme, setTheme } = useContext(themeContext);


    return (
        <div >
            <TransitionGroup>
                <CSSTransition
                    key={localStorage.getItem('theme')}
                    in={true}
                    appear={true}
                    timeout={1800}
                    classNames="fade"
                    unmountOnExit
                >
                    <img
                        src={typeof window !== "undefined" && localStorage.getItem("theme") === "latte" ? homeBackgroundLight.src : homeBackground.src}
                        alt="Bg"
                        className="blur-lg -z-10 fixed w-full h-full object-cover"
                    />
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}