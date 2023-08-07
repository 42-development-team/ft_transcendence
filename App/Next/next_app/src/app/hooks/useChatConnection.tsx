"use client";
import { useEffect, useState } from "react";
import {io, Socket} from 'socket.io-client'

// Todo: adapt to our backend
// Note: example using socket.io connection

const ENDPOINT = `${process.env.BACK_URL}` 

const connect = () => {
    return io(ENDPOINT, {
        withCredentials: true,
        reconnectionAttempts: 1,
        transports: ['websocket'],
    })
}

export default function useChatConnection() {
    const [socket, setSocket] = useState<Socket>();
    
    useEffect(() => {
        console.log('Connecting to socket.io server...');
        const socket = connect();
        setSocket(socket);

        return () => {
            console.log('Disconnecting...');
            socket.close();
        }
    }, [])
    
    return socket;
}