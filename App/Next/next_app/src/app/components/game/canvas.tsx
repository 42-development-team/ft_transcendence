"use client";

import React, { useRef, useEffect, useState } from "react";
import { GameInterface, PlayerInterface, BallInterface } from "../../game/interfaces/game.interfaces";

// ======== CANVAS CSS ==============//
const canvasStyle: any = {
	backgroundColor: '#4B3C4E',
	width: '78%',
};

// ======== PRINT CANVAS SCORE AND CONTOUR ==============//
function printScore(context: CanvasRenderingContext2D, p1: PlayerInterface, p2: PlayerInterface, width: number, height: number): [PlayerInterface, PlayerInterface] | null {
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

function blurEffect(context: CanvasRenderingContext2D, width: number, height: number) {
	context.fillStyle= 'rgba(0, 0, 0, 0.25';
	context.beginPath();
		context.fillRect(0, 0, width, height);
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

// ======== MANAGE END GAME ==============//
function win(context: CanvasRenderingContext2D, result: [PlayerInterface, PlayerInterface], width: number, height: number) {
	
	context.font='30px Arial';
	context.fillStyle='red';
	context.beginPath();
		context.fillText(result[0].name + " won the game", 0.5 * width, 0.5 * height);
		context.fillText(result[1].name + " lose the game", 0.5 * width, 0.7 * height);
	context.closePath();
}

function finish(result: [PlayerInterface, PlayerInterface], animationId: number) {
	// envoyer les infos au back
	() => window.cancelAnimationFrame(animationId);
}

// ============ RENDER ==============//
function renderBall(context: CanvasRenderingContext2D, ball: BallInterface, width:  number, height: number) {
	context.fillStyle = ball.color;
	context.beginPath();
		context.arc(ball.x * width, ball.y * height , ball.r * width, 0, ball.pi2, false);
		context.fill();
		context.stroke();
	context.closePath();
};

function renderPlayer(context: CanvasRenderingContext2D, p: PlayerInterface, width:  number, height: number) {
	context.fillStyle = p.color;
	context.beginPath();
		context.fillRect(p.x * width - p.w * width / 2, p.y * height - p.h * height / 2, p.w * width, p.h * height);
	context.closePath();
}

function renderGame(context: CanvasRenderingContext2D, data: GameInterface, width: number, height: number) {
	renderBall(context, data.ball, width, height);
	renderPlayer(context, data.player1, width, height);
	renderPlayer(context, data.player2, width, height);
};

// ============= COMPONENT ============= //
const Canvas = ({...props}) => {
	
	if (window === undefined)
		return ;

	// const {move, stopMove, data} = props;
	const {move, stopMove, data} = props;
	if (!data)
		return ;

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

			blurEffect(context, width, height);
			printMidLine(context, width, height);
			renderGame(context, data, width, height);

			const result: any = printScore(context, data.player1, data.player2, width, height);
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
				move(e.code);
			else if (e.code === "ArrowUp")
				move(e.code);
		}

		function handleKeyRelease(e: any) {
			if (e.code === "ArrowDown")
				stopMove(e.code);
			else if (e.code === "ArrowUp")
				stopMove(e.code);
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
			<canvas className="border-2 border-color-#cba6f7" id = "cnv" style={canvasStyle} width={width} height={width * (9 / 16)} ref={canvasRef} />
		</div>
	);
}

export default Canvas;
