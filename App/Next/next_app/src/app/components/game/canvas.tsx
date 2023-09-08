"use client";

import React, { useRef, useEffect, useState } from "react";
import { GameInterface, PlayerInterface, BallInterface } from "../../game/interfaces/game.interfaces";

// ======== CANVAS CSS ==============//
const canvasStyle: any = {
	backgroundColor: '#4B3C4E',
	width: '78%',
};

// ======== PRINT CANVAS SCORE AND CONTOUR ==============//
function printScore(context: CanvasRenderingContext2D, p1: PlayerInterface, p2: PlayerInterface, width: number, height: number) {
	context.font='30px Arial';
	context.fillStyle='#cba6f7';
	context.beginPath();
		context.fillText(p1.points.toString(), 0.45 * width, 0.05 * height);
		context.fillText(p2.points.toString(), 0.53 * width, 0.05 * height);
	context.closePath();
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
	printScore(context, data.player1, data.player2, width, height);
};

const Canvas = ({...props}) => {
	
	if (window === undefined)
		return ;

	const {move, stopMove, launchGame, data, userId} = props;
	if (!data)
		return ;

	const [width, setWidth] = useState<number>(window.innerWidth);
	let height: number;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		launchGame(data.id)
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const context = canvas.getContext('2d');
		if (!context)
			return ;
		height = width * (9 / 16);

		function handleKeyDown(e: any) {
			move(e.code, data.id, userId);
		}

		function handleKeyRelease(e: any) {
			stopMove(e.code, data.id, userId);
		}

		const render = (): any => {

			blurEffect(context, width, height);
			printMidLine(context, width, height);
			renderGame(context, data, width, height);

		}
		render();

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyRelease);
	}, [data]);

	return (
		<div className="canvas w-full">
			<canvas className="border-2 border-color-#cba6f7" id = "cnv" style={canvasStyle} width={width} height={width * (9 / 16)} ref={canvasRef} />
		</div>
	);
}

export default Canvas;
