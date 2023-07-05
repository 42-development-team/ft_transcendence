import Navbar from './components/navbar/navbar'
import { LoggedInContextProvider } from './context/LoggedInContextProvider'
import './globals.css'

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
