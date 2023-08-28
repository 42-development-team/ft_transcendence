// "use client";
// import { useContext, createContext, useState, useEffect } from "react";
// import { io, Socket } from "socket.io-client";
// // import useSocketConnection from "../hooks/useSocketConnection";
// import { useAuthcontext } from "./AuthContext";

// type SocketContextType = {
//     socket: Socket | undefined,
// }

// const SocketContextDefaultValues: SocketContextType = {
//     socket: undefined,
// }

// const SocketContext = createContext<SocketContextType>(SocketContextDefaultValues);

// const connect = () => {
//     const ENDPOINT = `${process.env.BACK_URL}`;
//     return io(ENDPOINT, {
//         withCredentials: true,
//         reconnectionAttempts: 1,
//         transports: ['websocket'],
//     });
// }

// export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
//     const [socket, setSocket] = useState<Socket | undefined>(undefined);
// 	const {isLoggedIn} = useAuthcontext();
// 	// const socket = useSocketConnection();
// 	// const newSocket = useSocketConnection();


// 	useEffect(() => {
//         if (isLoggedIn) {
//             console.log('Connecting to socket.io server...');
//             const newSocket = connect();
//             setSocket(newSocket);
//             return () => {
//                 console.log('Disconnecting from socket.io server...');
//                 newSocket.close();
//             }
//         } else {
//             setSocket(undefined);
//         }
//     }, [isLoggedIn])

//     useEffect(() => {
//         console.log("Socket in SocketContextProvider:", socket);
//     }, [socket]);

//     // useEffect(() => {
//     //     console.log("isLoggedIn in SocketContextProvider:", isLoggedIn);
//     // }, [isLoggedIn]);

//     console.log("SocketContextProvider rendered");

//     return (
//         <SocketContext.Provider value={{ socket }}>
//             {children}
//         </SocketContext.Provider>
//     )
// }


// export const useSocketContext = () => useContext(SocketContext);
'use client'
import { useContext, createContext, useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import { useAuthcontext } from "./AuthContext";
import useSocketConnection from "../hooks/useSocketConnection";

type SocketContextType = {
    socket: Socket | undefined,
}

const SocketContextDefaultValues: SocketContextType = {
    socket: undefined,
}

const SocketContext = createContext<SocketContextType>(SocketContextDefaultValues);

export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
	// const { isLoggedIn } = useAuthcontext();
	const isLoggedIn = false;

    // const [socket, setSocket] = useState<Socket | undefined>(undefined);
	const socket = isLoggedIn ? useSocketConnection() : undefined;

    console.log("SocketContextProvider rendered");

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocketContext = () => useContext(SocketContext);
