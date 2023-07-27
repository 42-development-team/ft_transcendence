"use client";
import BallInterface from "@/app/game/interfaces/ballInterface";
import PlayerInterface from "@/app/game/interfaces/playerInterface";
import React, {useRef, useEffect, useState } from "react";

type CanvasProps = React.DetailedHTMLProps<
	React.CanvasHTMLAttributes<HTMLCanvasElement>,
	HTMLCanvasElement
>

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

const Canvas: React.FC<CanvasProps> = ({ ...props }) => {
//dessiner chez le client
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const drawPlayerOne = (context: CanvasRenderingContext2D) => {
		context.fillStyle = 'blue';
		context.fillRect(10 , 10, 30, 20);
	}

	const drawBall = (context: CanvasRenderingContext2D) => {
		context.fillStyle = 'red';
		context.beginPath();
		context.arc(200, 200, 10, 0, Math.PI * 2, false);
		context.fill();
	}
	
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const context = canvas.getContext('2d');
		if (!context)
			return ;
		drawPlayer(props.player1, context);
		drawPlayer(props.player2, context);
		drawBall(props.ball, context);
	}, []);

	return <canvas width={props.width} height={props.height} ref={canvasRef} />
}

export default Canvas;