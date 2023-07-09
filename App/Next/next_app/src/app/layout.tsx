import './globals.css'
import React from "react";
import {LoggedInContextProvider} from "@/context/LoggedInContextProvider";
import Navbar from "@/components/navbar/Navbar";
import { ChatContextProvider } from './context/ChatContextProvider';

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
      <body className="flex flex-col">
        <LoggedInContextProvider>
          <ChatContextProvider>
            <Navbar />
            {/* <div className='flex flex-col flex-auto items-stretch'> */}
            <div className='flex-auto grid place-items-center'>
              {children}
            </div>
          </ChatContextProvider>
        </LoggedInContextProvider>
      </body>
    </html>
  )
}
