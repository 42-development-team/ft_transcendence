'use client';

import { useEffect, useState } from 'react';
import InGameContext from './inGameContext';
import GameInviteContext from './GameInviteContext';
import { useAuthContext } from './AuthContext';
import { Body } from '../components/theme/Body';

export default function GameInviteProvider({ children }: any) {
	const [invitedBy, setInvitedBy] = useState("");
	const [inviteSent, setInviteSent] = useState(false);
	const [mode, setMode] = useState(false);
	const {socket} = useAuthContext();

	useEffect(() => {
		socket?.on('inviteSent', (body: any) => {
			setInviteSent(true);
		});
		socket?.on('inviteCancelled', (body: any) => {
			setInviteSent(false);
		});
		socket?.on('receiveInvite', (body: any) => {
			/* create a timer on invitedBy attribute */

			setInvitedBy(body.invitorId);
			setMode(body.mode);
			const timeoutId = setTimeout(() => {
				setInvitedBy("");
				setMode(false);
			  }, 5000);
		  
			  // Cleanup the timeout when the component unmounts or when the event is triggered again
			  return () => clearTimeout(timeoutId);
		});

		return () => {
			socket?.off('inviteSent');
			socket?.off('inviteCancelled');
			socket?.off('receiveInvite');
		}
	}, [socket]);

	const inviteToPlay = async (invitedId: string, modeEnabled: boolean) => {
		try {
			console.log("invite sent with: " + invitedId + " " + modeEnabled);
			socket?.emit('invite', invitedId, modeEnabled);
		}
		catch (error) {
			console.log("Invite to play:" + error);
		}
	}

	const respondToInvite = async (userId: string, response: boolean) => {
		socket?.emit('respondToInvite', { userId, response });
	}

	const cancelInvite = (userId: string, socket:any) => {
		console.log("cancelling invite");
	}

	return (
		<GameInviteContext.Provider value={{ invitedBy, setInvitedBy, inviteToPlay, respondToInvite, cancelInvite, inviteSent, setInviteSent, mode, setMode }}>
			{children}
		</GameInviteContext.Provider>
	)
}