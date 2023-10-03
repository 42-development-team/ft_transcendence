import './globals.css'
import React from "react";
import { AuthContextProvider } from "@/app/context/AuthContext";
import Navbar from "@/components/navbar/Navbar";
import { ChatBarContextProvider } from './context/ChatBarContextProvider';
import { Body } from './components/theme/Body';
import ThemeProvider from './components/theme/themeProvider';
import { Background } from './components/theme/BackGround';
import LoadingProvider from './context/LoadingContextProvider';
import InGameProvider from './context/inGameContextProvider';
import GameInviteProvider from './context/GameInviteContextProvider';
import SidePanelGameInvite from './components/game/sidePanelGameInvite';
export const metadata = {
	title: 'Pong',
	description: 'Awesome pong game',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

	return (
		<html lang="en">
			<ThemeProvider>
				<Body>
					<AuthContextProvider>
						<GameInviteProvider>
							<ChatBarContextProvider>
								<LoadingProvider>
									<InGameProvider>
										<Navbar />
										<SidePanelGameInvite />
										<Background />
										<div className=' flex-auto grid place-items-center h-full'>
											{children}
										</div>
									</InGameProvider>
								</LoadingProvider>
							</ChatBarContextProvider>
						</GameInviteProvider>
					</AuthContextProvider>
				</Body>
			</ThemeProvider>
		</html>
	)
}
