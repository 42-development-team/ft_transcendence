"use client";
import BallInterface from "@/app/game/interfaces/ballInterface";
import PlayerInterface from "@/app/game/interfaces/playerInterface";
import React, { useRef, useEffect, useState } from "react";

// let width: number = window.innerWidth;
// let height: number = window.innerHeight;

// window.onload = function handleLoad() {
// 	width = window.innerWidth;
// 	height = window.innerHeight;
// };

// window.onresize = function handleResize() {
// 	let width = window.innerWidth;
// 	let height = window.innerHeight;
// };

const drawBall = (context: CanvasRenderingContext2D, ball: BallInterface, width: number, height: number) => {
	context.fillStyle = ball.color;
	context.beginPath();
	context.arc(ball.position[0] * width, ball.position[1] * height, ball.r, 0, ball.pi2, false);
	context.fill();
}
	
const drawPlayer = (context: CanvasRenderingContext2D, player: PlayerInterface, width: number, height: number) => {
	context.beginPath();
	context.fillStyle = player.color;
	context.fillRect(player.position[0] * width, player.position[1] * height, player.rect[0] * width, player.rect[1] * height);
}

// const renderGame = (canvasRef: React.MutableRefObject<HTMLCanvasElement | null>, {...props}, width:number, height: number) => {
const renderGame = (context: CanvasRenderingContext2D , {...props}, width:number, height: number) => {

	drawPlayer(context, props.player1, width, height);
	drawPlayer(context, props.player2, width, height);
	drawBall(context, props.ball, width, height);
}

const Canvas = ({ ...props }) => {

	// const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const canvas = useRef<HTMLCanvasElement | null>(null);
	// const canvas = document.getElementById('canvas') as  HTMLCanvasElement;
	// if (!canvas)
	if (!canvas.current)
		return ;

	// const context = canvas.getContext('2d');
	const context = canvas.current.getContext('2d');
	if (!context)
		return ;

	if (window === undefined)
		return ;

	let width: number = window.innerWidth;
	let height: number = window.innerHeight;
	
	// useEffect(() => {
	// 	width = window.innerWidth;
	// 	height = window.innerHeight;
	// 	// renderGame(canvas, props, width, height);
		renderGame(context, props, width, height);
	// }, [window.onresize]);

	// renderGame(canvasRef, props, width, height);

	return (
		<div className="canvas">
			<canvas width={width} height={height} ref={canvas} />
		</div>
	);
}

export default Canvas;
