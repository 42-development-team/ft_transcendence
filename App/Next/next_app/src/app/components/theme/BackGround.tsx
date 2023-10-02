'use client';
import { useContext, useEffect, useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import homeBackground from '../../../../public/background_11-min.webp';
import homeBackgroundLight from '../../../../public/backgroundLight_11-min.webp';
import themeContext from "./themeContext";
import './styleBackground.css'

export const Background = () => {

	const { theme } = useContext(themeContext);
	const [entered, setEntered] = useState<boolean>(false);

	useEffect(() => {
		if (typeof window === 'undefined') return;
		setTimeout(() => {
			setEntered(true);
		}, 300);
	}, [theme]);

	return (
		<div >
			<TransitionGroup className={'fade'}>
				<CSSTransition
					key={theme}
					in={entered}
					appear={true}
					timeout={900}
					classNames="fade"
					mountOnEnter
				>
					<img
						src={theme === "latte" ? homeBackgroundLight.src : homeBackground.src}
						alt="Bg"
						className="blur-md -z-10 fixed w-full h-full object-cover"
					/>
				</CSSTransition>
			</TransitionGroup>
		</div>
	)
}