"use client";
import BallInterface from "@/app/game/interfaces/ballInterface";
import PlayerInterface from "@/app/game/interfaces/playerInterface";
import React, { useRef, useEffect, useState } from "react";

// ============================================ // 
// ===============  TO DO  ==================== // 

// Use requestAnimationFrame instead of setInterval / setTimeout
// redraw only the regions that have to and not all canvas

// ============================================ // 

const canvasStyle: any = {
	backgroundColor: '#009BD7',
	width: '100%',
};

const drawBall = (context: CanvasRenderingContext2D, ball: BallInterface, width: number, height: number) => {
	context.fillStyle = ball.color;
	context.beginPath();
		context.arc(ball.position[0] * width - ball.r, ball.position[1] * height - ball.r, ball.r, 0, ball.pi2, false);
		context.fill();
	context.closePath();
}

const drawPlayer = (context: CanvasRenderingContext2D, player: PlayerInterface, width: number, height: number) => {
	context.fillStyle = player.color;
	context.beginPath();
		context.fillRect(player.position[0] * width - player.rect[0] * width, player.position[1] * height - player.rect[1] * height, player.rect[0] * width, player.rect[1] * height);
	context.closePath();
}

const renderGame = (context: CanvasRenderingContext2D , {...props}, width:number, height: number) => {

	context.clearRect(0, 0, width, height);
	drawPlayer(context, props.player1, width, height);
	drawPlayer(context, props.player2, width, height);
	drawBall(context, props.ball, width, height);

}

const Canvas = ({ ...props }) => {

	if (window === undefined)
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
			height = width * 0.56;
			renderGame(context, props, width, height);
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
			<canvas id = "cnv" style={canvasStyle} width={width} height={width * 0.56} ref={canvasRef} />
		</div>
	);
}

export default Canvas;
