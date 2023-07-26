"use client";
import React, {useRef, useEffect, useState } from "react";

export default function Canvas() {

	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas)
			return ;
		const context = canvas.getContext('2d');
		if (!context)
			return ;
		context.fillStyle = 'blue';
		context.fillRect(10, 10, 30, 20);
	}, []);

	return <canvas ref={canvasRef} />
}
