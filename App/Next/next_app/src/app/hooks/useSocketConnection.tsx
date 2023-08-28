"use client";
import { useEffect, useState } from "react";
import { io, Socket } from 'socket.io-client';
import { useAuthcontext } from "../context/AuthContext";
const ENDPOINT = `${process.env.BACK_URL}`

const connect = () => {
    return io(ENDPOINT, {
        withCredentials: true,
        reconnectionAttempts: 1,
        transports: ['websocket'],
    })
}

export default function useSocketConnection() {
    const [socket, setSocket] = useState<Socket>();
	const {isLoggedIn} = useAuthcontext();

    useEffect(() => {
		// if (isLoggedIn){
			console.log('Connecting to socket.io server...');
			const socket = connect();
			setSocket(socket);
			return () => {
				console.log('Disconnecting from socket.io server...');
				socket.close();
			}
		// }
    }, [isLoggedIn])

    useEffect(() => {
        socket?.on('connect_error', (err) => {
            console.log('Connection to socket.io server failed', err);
        });
        socket?.on('disconnect', (reason) => {
            console.log('Disconnected from socket.io server', reason);
        });
        socket?.on('connect', () => {
            console.log('Connected to socket.io server');
        });

        return () => {
            socket?.off('connect_error');
            socket?.off('disconnect');
            socket?.off('connect');
        }
    }, [socket]);

    return socket;
}
