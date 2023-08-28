"use client";
import useSocketConnection from "./useSocketConnection";
import { useEffect, useState } from "react";
import { BallInterface, GameInterface, PlayerInterface } from "../game/interfaces/game.interfaces";

export default function useGame() {
	
	const socket = useSocketConnection();
	const [data, setData] = useState<GameInterface>();
	// const [activeGames, setActiveGames] = useState<GameModel[]>([]); // check db model and redo this properly

	const handleNewGameConnection = (body: any) => {
		const { room, user } = body;
	};

	// init data with p1, p2 and ball infos
	useEffect(() => {
		socket?.on('updateGame', (body: any) => {
			console.log("move event - useGame.tsx");
			console.log("body:", JSON.stringify(body, null, 2));
			// update data
			// launch the loop here ?

		});

		socket?.on('newGameConnection', (body: any) => {
			handleNewGameConnection(body); // get data from this ???
		});

		return () => {
			socket?.off('updateGame');
		};
	}, [socket]);


	// TODO keep this logic but match it with db model
	const joinGameRoom = async () => {
		// activeGames.forEach( game => {
		// 	if (game.slot < 2) {
				// socket?.emit("joinGameRoom", game.id);
				// 	game.slot++;
			// }
		// });
		socket?.emit("joinGameRoom", 0);
	}

	const move = async (event: string) => {
		// Emit le move sur la socket
		socket?.emit('move', (event));
	}

	const stopMove = async (event: string) => {
		socket?.emit('stopMove', (event));
	}

	return {
		move,
		stopMove,
		data,
	}
}
