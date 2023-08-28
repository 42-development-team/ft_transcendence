import './globals.css'
import React from "react";
import {AuthContextProvider} from "@/app/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import { ChatBarContextProvider } from './context/ChatBarContextProvider';
// import { SocketContextProvider } from './context/SocketContext';

export const metadata = {
  title: 'Pongolin',
  description: 'Awesome pong game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
	  {/* <SocketContextProvider> */}
          <AuthContextProvider>
            <ChatBarContextProvider>
              <Navbar />
              {/* <div className='flex flex-col flex-auto items-stretch'> */}
              <div className='flex-auto grid place-items-center h-full'>
                {children}
              </div>
              {/* <p>{jwt?.value}</p> */}
            </ChatBarContextProvider>
          </AuthContextProvider>
		{/* </SocketContextProvider> */}
      </body>
    </html>
  )
}
