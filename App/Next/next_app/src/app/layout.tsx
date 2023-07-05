import Navbar from './components/navbar/Navbar'
import { LoggedInContextProvider } from './context/LoggedInContextProvider'
import './globals.css'
import React from "react";

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
      <body className="bg-mantle text-text min-h-screen flex flex-col">
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
