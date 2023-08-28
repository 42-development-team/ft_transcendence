// 'use client'
// import { useContext, createContext, useState, useEffect } from "react";
// import { io, Socket } from 'socket.io-client';
// import { useAuthcontext } from "./AuthContext";
// import useSocketConnection from "../hooks/useSocketConnection";

// type SocketContextType = {
//     socket: Socket | undefined,
// }

// const SocketContextDefaultValues: SocketContextType = {
//     socket: undefined,
// }

// const SocketContext = createContext<SocketContextType>(SocketContextDefaultValues);

// export const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
//     const [socket, setSocket] = useState<Socket | undefined>(undefined);
//     const { isLoggedIn } = useAuthcontext();
// 	const newSocket = useSocketConnection();

//     const initializeSocket = async () => {
// 		console.log("init socket");
// 		if (isLoggedIn) {
// 		  setSocket(newSocket);
// 		}
// 	};


// 	useEffect(() => {
// 		if (isLoggedIn)
// 			initializeSocket();
// 	}, [isLoggedIn]);


//     console.log("SocketContextProvider rendered");

//     return (
//         <SocketContext.Provider value={{ socket }}>
//             {children}
//         </SocketContext.Provider>
//     )
// }

// export const useSocketContext = () => useContext(SocketContext);
