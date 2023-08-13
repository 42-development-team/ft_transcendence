// import BallInterface from "@/app/game/interfaces/ballInterface";
// import PlayerInterface from "@/app/game/interfaces/playerInterface";

// ============================================ // 
// ===============  TO DO  ==================== // 

// Use requestAnimationFrame instead of setInterval / setTimeout
// redraw only the regions that have to and not all canvas

// ============================================ // 
// update canvas every 1/60 sec
// move ball in random direction
// add hit box on canvas border
// bounce on borders
// delete hit box on left abd rigth canvas's sides
// count points on canvas's sides
// add hit box on paddle
// ============================================ // 

// function handleKeyDown(e: React.KeyboardEvent) {
	// const key: string = e.code;

	// console.log("keyDown:", e);

	// if (key == 'ArrowDown')
	// 	p1.setVelocity(0.001);
	// else if (key == 'ArrowUp')
	// 	p1.setVelocity(-0.001);
// }

// function handleKeyDown(p: Player) {

// 	if (key == 'ArrowDown')
// 		p1.setVelocity(0.001);
// 	else if (key == 'ArrowUp')
// 		p1.setVelocity(-0.001);
// }

// function handleKeyUp(e: React.KeyboardEvent) {
// 	const key: string = e.code;

// 	console.log("keyDown:", key);
// 	p1.killVelocity();
// }
"use client";
import React, { useRef, useEffect, useState, KeyboardEventHandler } from "react";
import Ball from '../../game/class/ball.class';
import Player from '../../game/class/player.class';

const canvasStyle: any = {
	backgroundColor: '#009BD7',
	width: '80%',
};

const Canvas = () => {
	
	if (window === undefined)
		return ;

	// function useKey(key: string, cb: any) {
	// 	const callbackRef = useRef(cb);

	// 	useEffect(() => {
	// 		callbackRef.current = cb;
	// 	});
	
	// 	useEffect(() => {
	// 		function handleKeyDown(event: any) {
	// 			console.log(event);
	
	// 			if (event.code === "ArrowDown") {
	// 				callbackRef.current(event);
	// 			}
	// 		};
	
	// 		document.addEventListener("keydown", handleKeyDown);
	// 		return removeEventListener("keydown", handleKeyDown);
	// 	}, [key]);
	// }

	// =================== //
	// Have To Declrare in //
	//   parent conponent  //
		const ball: Ball = new Ball(0.007, 0.003);
		const p1: Player = new Player(true);
		const p2: Player = new Player(false);
	// =================== //

	const [width, setWidth] = useState<number>(window.innerWidth);
	let height: number;
	
	const canvasRef = useRef<HTMLCanvasElement>(null);


	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const context = canvas.getContext('2d');
		if (!context)
			return ;
		height = width * (9 / 16);

		let animationId: number;
		
		const render = (): any => {

			context.clearRect(0, 0, width, height);
			ball.renderBall(context, p1, p2, width, height);
			p1.renderPlayer(context, width, height);
			p2.renderPlayer(context, width, height);

			animationId = window.requestAnimationFrame(render);
		}
		render();

		return () => window.cancelAnimationFrame(animationId);

		// ======================== //
		// Do we want to loose canvas in height
		// or to play in a stamp
	}, [width]);

	useEffect(() => {
		function handleKeyDown(e: any) {
			if (e.code === "ArrowDown")
				p1.setVelocity(0.01);
			else if (e.code === "ArrowUp")
				p1.setVelocity(-0.01);
		}

		function handleKeyRelease() {
			p1.killVelocity();
		}

		function resize() {
			const canvas = canvasRef.current;
			if (!canvas)
				return ;
			setWidth((currentWidth) => { return currentWidth = canvas.getBoundingClientRect().width; });
		}
		window.addEventListener('resize', resize);
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyRelease);

	});

	return (
		<div className="canvas w-full">
			{/* <input onKeyDown={handleKeyDown}/>
			<input onKeyUp={handleKeyUp}/> */}
			<canvas id = "cnv" style={canvasStyle} width={width} height={width * (9 / 16)} ref={canvasRef} />
		</div>
	);
}

export default Canvas;
