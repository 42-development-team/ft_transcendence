'use client';

import React, { useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Image from 'next/image';
import homeBackground from '../../../../public/backgroundUpscale.png';
import homeBackgroundLight from '../../../../public/backgroundLightUpscale.png';
import themeContext from "./themeContext";

export const BackgroundBall = () => {
    const { theme } = useContext(themeContext);
    const [currentImage, setCurrentImage] = useState(0);
    const images = [homeBackground, homeBackgroundLight];
    const handleImageChange = () => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    };

    useEffect(() => {
        setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, [theme]);

    return (
        <div >
            <TransitionGroup>
                <CSSTransition
                    key={currentImage}
                    in={true}
                    appear={true}
                    timeout={1800}
                    classNames="fade"
                >
                    <img
                        src={images[currentImage].src}
                        alt="Bg"
                        className=" blur-md -z-10 fixed w-full h-full object-cover"
                        onChange={handleImageChange}
                    />
                </CSSTransition>
            </TransitionGroup>
        </div>
    )
}