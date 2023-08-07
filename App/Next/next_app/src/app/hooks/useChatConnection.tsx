import { useEffect, useState } from "react";
import {io, Socket} from 'socket.io-client'

// Todo: adapt to our backend
// Note: example using socket.io connection

const ENDPOINT = ""

const connect = () => {
    return io(ENPOINT, {
        reconnectionAttempts: 5,
    })
    return 
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
    })
    
    return socket;
}