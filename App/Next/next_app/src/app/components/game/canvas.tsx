"use client";

import React, { useRef, useEffect, useState, KeyboardEventHandler } from "react";
import Ball from '../../game/class/ball.class';
import Player from '../../game/class/player.class';

const canvasStyle: any = {
	backgroundColor: '#4B3C4E',
	width: '78%',
};

function printScore(context: CanvasRenderingContext2D, p1: Player, p2: Player, width: number, height: number): [Player, Player] | null {
	context.font='30px Arial';
	context.fillStyle='#cba6f7';
	context.beginPath();
		context.fillText(p1.points.toString(), 0.45 * width, 0.05 * height);
		context.fillText(p2.points.toString(), 0.53 * width, 0.05 * height);
	context.closePath();
	if (p1.points === 11)
		return [p1, p2];
	else if (p2.points === 11)
		return [p2, p1];
	return null;
}

function printBorder(context: CanvasRenderingContext2D, width: number, height: number) {
	context.strokeStyle='#cba6f7';
	context.beginPath();
		context.moveTo(0, 0);
			context.lineTo(0, height);
			context.lineTo(width, height);
		context.moveTo(0, 0);
			context.lineTo(width, 0);
			context.lineTo(width, height);
		context.stroke();
	context.closePath();
}

function printMidLine(context: CanvasRenderingContext2D, width: number, height: number) {
	let y = 0;

	context.strokeStyle='#cba6f7';
	context.beginPath();
	while (y < height) {
		context.moveTo(width / 2, y);
		context.lineTo(width / 2, y + 0.01 * height);
		context.stroke();
		y += 0.02 * height;
	}
	context.closePath();
}

function win(context: CanvasRenderingContext2D, result: [Player, Player], width: number, height: number) {
	
	context.font='30px Arial';
	context.fillStyle='red';
	context.beginPath();
		context.fillText(result[0].name + " won the game", 0.5 * width, 0.5 * height);
		context.fillText(result[1].name + " lose the game", 0.5 * width, 0.7 * height);
	context.closePath();
}

function finish(result: [Player, Player], animationId: number) {
	// envoyer les infos au back
	() => window.cancelAnimationFrame(animationId);
}

const Canvas = () => {
	
	if (window === undefined)
		return ;

	const ball: Ball = new Ball();
	const p1: Player = new Player(true);
	const p2: Player = new Player(false);

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

			context.fillStyle= 'rgba(0, 0, 0, 0.25';
			context.beginPath();
				context.fillRect(0, 0, width, height);
			context.closePath();

			printBorder(context, width, height);
			printMidLine(context, width, height);

			ball.renderBall(context, p1, p2, width, height);
			p1.renderPlayer(context, width, height);
			p2.renderPlayer(context, width, height);
			const result: any = printScore(context, p1, p2, width, height);
			if (result) {
				win(context, result, width, height);
				return finish(result, animationId);
			}

			animationId = window.requestAnimationFrame(render);
		}
		render();

		return () => window.cancelAnimationFrame(animationId);

	}, [width]);

	useEffect(() => {
		function handleKeyDown(e: any) {
			if (e.code === "ArrowDown")
				p1.setVelocity(0.01);
			else if (e.code === "ArrowUp")
				p1.setVelocity(-0.01);

			if (e.code === "KeyS")
				p2.setVelocity(0.01);
			else if (e.code === "KeyW")
				p2.setVelocity(-0.01);
		}

		function handleKeyRelease() {
			p1.killVelocity();
			p2.killVelocity();
		}

		function resize() {
			const canvas = canvasRef.current;
			if (!canvas)
				return ;
			setWidth((currentWidth) => { return currentWidth = canvas.getBoundingClientRect().width; });
		}
		window.addEventListener("resize", resize);
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyRelease);

	});

	return (
		<div className="canvas w-full">
			<canvas id = "cnv" style={canvasStyle} width={width} height={width * (9 / 16)} ref={canvasRef} />
		</div>
	);
}

export default Canvas;
