'use client';
import React, { useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import homeBackground from '../../../../public/background_11.png';
import homeBackgroundLight from '../../../../public/backgroundLight_11.png';
import themeContext from "./themeContext";
import './styleBackground.css'

export const BackgroundBall = () => {

	const { theme } = useContext(themeContext);
	const [entered, setEntered] = useState<boolean>(false);
	let storage = typeof window !== "undefined" ? localStorage.getItem("theme") : "mocha";

	useEffect(() => {
		if (typeof window === 'undefined') return;
		setTimeout(() => {
			setEntered(true);
		}, 300);
	}, [theme]);

	return (
		<div >
			<TransitionGroup>
				<CSSTransition
					key={typeof localStorage !== 'undefined' ? localStorage.getItem("theme") : ''}
					in={entered}
					appear={true}
					timeout={900}
					classNames="fade"
					mountOnEnter
				>
					<img
						src={typeof window !== "undefined" && localStorage.getItem("theme") === "latte" ? homeBackgroundLight.src : homeBackground.src}
						alt="Bg"
						className="blur-md -z-10 fixed w-full h-full object-cover"
					/>
				</CSSTransition>
			</TransitionGroup>
		</div>
	)
}