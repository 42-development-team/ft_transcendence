"use client";

import React, { useRef, useEffect, useState } from "react";
import { GameInterface, PlayerInterface, BallInterface } from "./interfaces/game.interfaces";

// ======== CANVAS CSS ==============//
const canvasStyle: any = {
	backgroundColor: '#4B3C4E',
	width: '78%',
};

// ======== PRINT CANVAS SCORE AND CONTOUR ==============//
function printScore(context: CanvasRenderingContext2D, p1: PlayerInterface, p2: PlayerInterface, width: number, height: number) {
	context.font = '30px Arial';
	context.fillStyle = '#cba6f7';
	context.beginPath();
	context.fillText(p1.points.toString(), 0.45 * width, 0.05 * height);
	context.fillText(p2.points.toString(), 0.53 * width, 0.05 * height);
	context.closePath();
}

function blurEffect(context: CanvasRenderingContext2D, width: number, height: number) {
	context.fillStyle = 'rgba(0, 0, 0, 0.4';
	context.beginPath();
	context.fillRect(0, 0, width, height);
	context.closePath();
}

function printMidLine(context: CanvasRenderingContext2D, width: number, height: number) {

	context.strokeStyle = '#cba6f7';
	context.beginPath();
	context.setLineDash([2, 2]);
	context.moveTo(width / 2, 0);
	context.lineTo(width / 2, height);
	context.stroke();
	context.closePath();
}

// ============ RENDER ==============//
function renderBall(context: CanvasRenderingContext2D, ball: BallInterface, width: number, height: number) {
	context.fillStyle = ball.color;
	context.beginPath();
	context.arc(ball.x * width, ball.y * height, ball.r * width, 0, ball.pi2, false);
	context.fill();
	context.stroke();
	context.closePath();
};

function renderPlayer(context: CanvasRenderingContext2D, p: PlayerInterface, width: number, height: number, mode: boolean) {
	const x = p.x * width - p.w * width / 2;
	const y = p.y * height - p.h * height / 2;
	const w = p.w * width;
	const h = p.h * height;

	context.fillStyle = p.color;
	if (mode) {
		if (y + h > height) {
			context.beginPath();
				context.fillRect(x, y - height, w, h);
			context.closePath();
		}
		if (y < 0) {
			context.beginPath();
				context.fillRect(x, height + y, w, h);
			context.closePath();
		}
	}
	context.beginPath();
		context.fillRect(x, y, w, h);
	context.closePath();
}

function renderGame(context: CanvasRenderingContext2D, data: GameInterface, width: number, height: number, mode: boolean) {
	renderBall(context, data.ball, width, height);
	renderPlayer(context, data.player1, width, height, mode);
	renderPlayer(context, data.player2, width, height, mode);
	printScore(context, data.player1, data.player2, width, height);
};

const Canvas = ({ ...props }) => {
	if (typeof window === 'undefined')
		return;

	const { move, stopMove, launchGame, data, mode, userId } = props;

	const [width, setWidth] = useState<number>(window.innerWidth * 0.9);
	let height: number;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (data)
			launchGame(data.id);
	}, []);

	useEffect(() => {
		if (!data)
			return;
		const canvas = canvasRef.current;
		if (!canvas)
			return;
		const context = canvas.getContext('2d');
		if (!context)
			return;
		height = width * (9 / 16);

		function handleKeyDown(e: any) {
			move(e.code, data.id, userId);
		}

		function handleKeyUp(e: any) {
			stopMove(e.code, data.id, userId);
		}

		blurEffect(context, width, height);
		printMidLine(context, width, height);
		renderGame(context, data, width, height, mode);

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('keyup', handleKeyUp);
		}

	}, [data]);

	return (
		<div className="flex flex-col justify-center items-center canvas h-[9/16vw]">
			<canvas className="border-2 border-color-#cba6f7" id="cnv" style={canvasStyle} width={width} height={width * (9 / 16)} ref={canvasRef} />
			<div className="pt-2">Use Arrow Keys To Move</div>
		</div>
	);
}

export default Canvas;
