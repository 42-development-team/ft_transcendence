'use client';

import { useEffect, useRef, useState } from 'react';
import GameInviteContext from './GameInviteContext';
import { useAuthContext } from './AuthContext';
import { clear } from 'console';

export default function GameInviteProvider({ children }: any) {
	const timeoutRefId = useRef<NodeJS.Timeout | null>(null);
	const [invitedBy, setInvitedBy] = useState("");
	const [inviteSent, setInviteSent] = useState(false);
	const [timeoutId, setTimeoutId] = useState<any>();
	const [mode, setMode] = useState(false);
	const [message, setMessage] = useState("");
	const { socket } = useAuthContext();

	useEffect(() => {
		if (timeoutId)
			timeoutRefId.current = timeoutId;
	}, [timeoutId]);

	useEffect(() => {
		socket?.on('inviteSent', (body: any) => {
			setInviteSent(true);
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			setTimeoutId(setTimeout(() => {
				setInviteSent(false);
			}, 20000));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('inviteCanceled', (body: any) => {
			//TODO: set a message to notify that invitor has cancelled the invite
			console.log("invite cancelled from", body.invitorId);
			setMessage("Invite cancelled");
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			setInvitedBy("");
			setMessage("");
			setMode(false);
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('inviteAccepted', (body: any) => {
			setMessage("Invite accepted");
			clearTimeout(timeoutId);
			setTimeoutId(setTimeout(() => {
				setInviteSent(false);
				setMessage("");
				setMode(false);
			}, 700));
			return () => {
				clearTimeout(timeoutId);
			}
			//TODO: set a message to notify that invitee has accepted the invite
		});

		socket?.on('inviteDeclined', (body: any) => {
			//TODO: set a message to notify that invitee has declined the invite
			setMessage("Invite declined");
			clearTimeout(timeoutId);
			setTimeoutId(setTimeout(() => {
				setInviteSent(false);
				setMode(false);
			}, 2000));
			setMessage("");
			return () => {
				clearTimeout(timeoutId);
			}
		});

		socket?.on('receiveInvite', (body: any) => {
			setInvitedBy(body.invitorId);
			setMode(body.mode);
			setTimeoutId(setTimeout(() => {
				setInvitedBy("");
				setMode(false);
			}, 20000));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
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
		clearTimeout(timeoutId);
		if (response)
			setMessage("Accepted");
		else
			setMessage("Cancelled");
		setTimeoutId(setTimeout(() => {
			setInvitedBy("");
			setMessage("");
		}, 2000));
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