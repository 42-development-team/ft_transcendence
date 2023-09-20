'use client';

import { useEffect, useState } from 'react';
import InGameContext from './inGameContext';
import GameInviteContext from './GameInviteContext';
import { useAuthContext } from './AuthContext';

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
			setInvitedBy(body.invitorId);
			setMode(body.mode);
			const timeoutId = setTimeout(() => {
				setInvitedBy("");
				setMode(false);
			  }, 5000);
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
			socket?.emit("invite", {invitedId, modeEnabled});
		}
		catch (error) {
			console.log("Invite to play:" + error);
		}
	}

	const respondToInvite = async (invitorId: string, response: boolean) => {
		console.log("responding to invite: " + invitorId + " " + response);
		socket?.emit('respondToInvite', { invitorId, response });
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