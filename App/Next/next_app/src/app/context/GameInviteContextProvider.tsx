'use client';

import { useEffect, useState } from 'react';
import GameInviteContext from './GameInviteContext';
import { useAuthContext } from './AuthContext';

export default function GameInviteProvider({ children }: any) {
	const [invitedBy, setInvitedBy] = useState("");
	const [inviteSent, setInviteSent] = useState(false);
	const [timeoutId, setTimeoutId] = useState<any>(null);
	const [mode, setMode] = useState(false);
	const [message, setMessage] = useState("");
	const { socket } = useAuthContext();

	useEffect(() => {
		socket?.on('inviteSent', (body: any) => {
			setInviteSent(true);
			const id = setTimeout(() => {
				setInviteSent(false);
			}, 20000);
			setTimeoutId(id);
		});

		socket?.on('inviteCanceled', (body: any) => {
			//TODO: set a message to notify that invitor has cancelled the invite
			console.log("invite cancelled from", body.invitorId);
			setMessage("Invite cancelled");
			clearTimeout(timeoutId);
			setTimeoutId(setTimeout(() => {
				setInvitedBy("");
				setMode(false);
			}, 2000));
			clearTimeout(timeoutId);
		});

		socket?.on('inviteAccepted', (body: any) => {
			//TODO: set a message to notify that invitee has accepted the invite
		});

		socket?.on('inviteDeclined', (body: any) => {
			//TODO: set a message to notify that invitee has declined the invite
			setMessage("Invite declined");
			const timeoutId = setTimeout(() => {
				setInviteSent(false);
				setMessage("");
			}, 2000);
			setTimeoutId(timeoutId);
		});

		socket?.on('receiveInvite', (body: any) => {
			setInvitedBy(body.invitorId);
			setMode(body.mode);
			setTimeoutId(setTimeout(() => {
				setInvitedBy("");
				setMode(false);
			}, 20000));
		});

		return () => {
			socket?.off('inviteSent');
			socket?.off('inviteCancelled');
			socket?.off('receiveInvite');
			socket?.off('inviteAccepted');
			socket?.off('inviteDeclined');

		}
	}, [socket]);

	const inviteToPlay = async (invitedId: string, modeEnabled: boolean) => {
		try {
			console.log("invite sent with: " + invitedId + " " + modeEnabled, "socket:", socket?.id);
			socket?.emit("invite", { invitedId, modeEnabled });
		}
		catch (error) {
			console.log("Invite to play:" + error);
		}
	}

	const respondToInvite = async (invitorId: string, response: boolean) => {
		console.log("responding to invite: " + invitorId + " " + response);
		socket?.emit('respondToInvite', { invitorId, response });
		if (timeoutId)
			clearTimeout(timeoutId);
	}

	const cancelInvite = async (invitedId: string) => {
		socket?.emit('cancelInvite', { invitedId });
		if (timeoutId)
			clearTimeout(timeoutId);
		console.log("cancelling invite");
	}

	return (
		<GameInviteContext.Provider value={{ invitedBy, setInvitedBy, inviteToPlay, respondToInvite, cancelInvite, inviteSent, setInviteSent, mode, setMode, timeoutId, setTimeoutId, message, setMessage }}>
			{children}
		</GameInviteContext.Provider>
	)
}