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

"use client";
import React, { useRef, useEffect, useState } from "react";
import Ball from '../../game/class/ball.class';
import Player from '../../game/class/player.class';

const canvasStyle: any = {
	backgroundColor: '#009BD7',
	width: '80%',
};

// interface CanvasProps {
// 	ball: Ball;
// 	renderBall: any;
// }

// const Canvas: React.FC<CanvasProps> = (props) => {
// const Canvas = ({ ...props }) => {
// const Canvas = ( props: any ) => {
const Canvas = () => {

	if (window === undefined)
		return ;
	// =================== //
	// Have To Declrare in //
	//   parent conponent  //
		const ball: Ball = new Ball(0.002, 0.004);
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
		function resize() {
			const canvas = canvasRef.current;
			if (!canvas)
				return ;
			setWidth((currentWidth) => { return currentWidth = canvas.getBoundingClientRect().width; });
		}
		window.addEventListener('resize', resize);
	});

	return (
		<div className="canvas w-full">
			<canvas id = "cnv" style={canvasStyle} width={width} height={width * (9 / 16)} ref={canvasRef} />
		</div>
	);
}

export default Canvas;
