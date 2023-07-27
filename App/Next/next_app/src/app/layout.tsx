import './globals.css'
import React from "react";
import {LoggedInContextProvider} from "@/context/LoggedInContextProvider";
import Navbar from "@/components/navbar/Navbar";
import { ChatBarContextProvider } from './context/ChatBarContextProvider';

export const metadata = {
  title: 'Pongolin',
  description: 'Awesome pong game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // const jwt = getJWTCookie();
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
          <LoggedInContextProvider>
            <ChatBarContextProvider>
              <Navbar />
              {/* <div className='flex flex-col flex-auto items-stretch'> */}
              <div className='flex-auto grid place-items-center h-full'>
                {children}
              </div>
              {/* <p>{jwt?.value}</p> */}
            </ChatBarContextProvider>
          </LoggedInContextProvider>
      </body>
    </html>
  )
}
