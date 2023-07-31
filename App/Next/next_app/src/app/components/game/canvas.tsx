"use client";
import BallInterface from "@/app/game/interfaces/ballInterface";
import PlayerInterface from "@/app/game/interfaces/playerInterface";
import React, { useRef } from "react";


const drawBall = (ball: BallInterface, context: CanvasRenderingContext2D) => {
		context.fillStyle = ball.color;
		context.beginPath();
		context.arc(ball.position[0], ball.position[1], ball.r, 0, ball.pi2, false);
		context.fill();
}

const drawPlayer = (player: PlayerInterface, context: CanvasRenderingContext2D) => {
		context.fillStyle = player.color;
		context.fillRect(player.position[0] , player.position[1], player.rect[0], player.rect[1]);
}

const renderGame = (canvasRef: React.MutableRefObject<HTMLCanvasElement | null>, {...props}) => {
	const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const context = canvas.getContext('2d');
		if (!context)
			return ;
		drawPlayer(props.player1, context);
		drawPlayer(props.player2, context);
		drawBall(props.ball, context);
}

const Canvas = ({ ...props }) => {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	renderGame(canvasRef, props);

	return <canvas width={props.width} height={props.height} ref={canvasRef} />
}

export default Canvas;