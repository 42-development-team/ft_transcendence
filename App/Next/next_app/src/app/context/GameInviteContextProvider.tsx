'use client';

import { useState } from 'react';
import InGameContext from './inGameContext';
import GameInviteContext from './GameInviteContext';

export default function GameInviteProvider({ children }: any) {
	const [invitedBy, setInvitedBy] = useState("");
	const [inviteSent, setInviteSent] = useState(false);

	const inviteToPlay = async (invitedId: string, socket: any) => {
		try {
			socket?.emit('invite', invitedId);
		}
		catch (error) {
			console.log("Invite to play:" + error);
		}
	}

	const acceptInvite = (userId: string, socket:any) => {
		console.log("accepting invite");
	}

	const declineInvite = (userId: string, socket:any) => {
		console.log("declining invite");
	}

	const cancelInvite = (userId: string, socket:any) => {
		console.log("cancelling invite");
	}

	return (
		<GameInviteContext.Provider value={{ invitedBy, setInvitedBy, inviteToPlay, acceptInvite, declineInvite, cancelInvite, inviteSent, setInviteSent }}>
			{children}
		</GameInviteContext.Provider>
	)
}