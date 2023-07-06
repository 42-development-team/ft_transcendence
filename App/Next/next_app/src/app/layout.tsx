import './globals.css'
import React from "react";
import {LoggedInContextProvider} from "@/context/LoggedInContextProvider";
import Navbar from "@/components/navbar/Navbar";

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
      <body className="bg-mantle text-text min-h-screen w-full flex flex-col">
      <LoggedInContextProvider>
        <Navbar/>
        <div className='flex flex-col flex-auto items-stretch'>
          {children}
        </div>
      </LoggedInContextProvider>
      </body>
    </html>
  )
}
