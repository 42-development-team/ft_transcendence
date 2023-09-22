'use client';

import { useEffect, useRef, useState } from 'react';
import GameInviteContext from './GameInviteContext';
import { useAuthContext } from './AuthContext';

export default function GameInviteProvider({ children }: any) {
	const timeoutRefId = useRef<NodeJS.Timeout | null>(null);
	const [invitedBy, setInvitedBy] = useState("");
	const [inviteSent, setInviteSent] = useState(false);
	const [timeoutId, setTimeoutId] = useState<any>();
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const [mode, setMode] = useState(false);
	const [message, setMessage] = useState("");
	const [receiveVisible, setReceiveVisible] = useState(false);
	const [sentVisible, setSentVisible] = useState(false);
	const [slide, setSlide] = useState("translateX(100%)");
	const [timer, setTimer] = useState<any>(0);
	const { socket } = useAuthContext();

	/* SOCKET LISTENERS */

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
			setTimeoutId(setTimeout(() => {
				setInvitedBy("");
				setMessage("");
				setMode(false);
			}, 1500));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('inviteAccepted', (body: any) => {
			setMessage("Invite accepted");
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			setTimeoutId(setTimeout(() => {
				setInviteSent(false);
				setMessage("");
				setMode(false);
			}, 1500));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
			//TODO: set a message to notify that invitee has accepted the invite
		});

		socket?.on('inviteDeclined', (body: any) => {
			//TODO: set a message to notify that invitee has declined the invite
			setMessage("Invite declined");
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			setTimeoutId(setTimeout(() => {
				setInviteSent(false);
				setMode(false);
			}, 1500));
			setMessage("");
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('receiveInvite', (body: any) => {
			setInvitedBy("");
			setMessage("");
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
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

	/* END SOCKET LISTENERS */

	/* USE EFFECTS SIDE PANEL*/
	useEffect(() => {
		if (invitedBy || inviteSent) {
			if (invitedBy) {
				setReceiveVisible(true);
				setSentVisible(false);
			} else {
				setReceiveVisible(false);
				setSentVisible(true);
			}
			clearInterval(timerRef.current as NodeJS.Timeout);
			setTimer(20);
			setSlide("translateX(0%)");
		} else {
			clearInterval(timerRef.current as NodeJS.Timeout);
			setTimer(0);
			setSlide("translateX(100%)");
			setSentVisible(false);
			setReceiveVisible(false);
		}
	}, [invitedBy, inviteSent]);

	useEffect(() => {
		if (invitedBy || inviteSent) {
			if (invitedBy) {
				setReceiveVisible(true);
				setSentVisible(false);
			} else {
				setReceiveVisible(false);
				setSentVisible(true);
			}
			setSlide("translateX(0%)");
		} else {
			setSlide("translateX(100%)");
			setSentVisible(false);
			setReceiveVisible(false);
		}
	}, []);

	useEffect(() => {
		if (timeoutId)
			timeoutRefId.current = timeoutId;
	}, [timeoutId]);
	/* END USE EFFECTS SIDE PANEL*/

	/* SIDEPANEL ACTIONS */
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
		clearTimeout(timeoutRefId.current as NodeJS.Timeout);
		if (response)
			setMessage("Accepted");
		else
			setMessage("Cancelled");
		setTimeoutId(setTimeout(() => {
            setSlide("translateX(100%)");
			setInvitedBy("");
			setMessage("");
		}, 1500));
		socket?.emit('respondToInvite', { invitorId, response });
		return () => {
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
		}
	}

	const cancelInvite = async (invitedId: string) => {
		setSlide("translateX(100%)");
        setSentVisible(false);
        setInviteSent(false);
		socket?.emit('cancelInvite', { invitedId });
		console.log("cancelling invite");
		return () => {
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
		}
	}

	/* End Action */

	return (
		<GameInviteContext.Provider value={{ 
			invitedBy, 
			setInvitedBy, 
			inviteToPlay, 
			respondToInvite, 
			cancelInvite, 
			inviteSent, 
			setInviteSent, 
			mode, 
			setMode, 
			timeoutId, 
			setTimeoutId, 
			message, 
			setMessage, 
			receiveVisible, 
			setReceiveVisible, 
			sentVisible, 
			setSentVisible, 
			slide, 
			setSlide, 
			timer, 
			setTimer }}>
			{children}
		</GameInviteContext.Provider>
	)
}