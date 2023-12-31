'use client';

import { useEffect, useRef, useState } from 'react';
import GameInviteContext from './GameInviteContext';
import { useAuthContext } from './AuthContext';

export default function GameInviteProvider({ children }: any) {
	const {userId} = useAuthContext();
	const timeoutRefId = useRef<NodeJS.Timeout | null>(null);
	const [invitedId, setInvitedId] = useState("");
	const [invitorUsername, setInvitorUsername] = useState("");
	const [invitedUsername, setInvitedUsername] = useState("");
	const [invitedBy, setInvitedBy] = useState("");
	const [inviteSent, setInviteSent] = useState(false);
	const [timeoutId, setTimeoutId] = useState<any>();
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const [mode, setMode] = useState(false);
	const [message, setMessage] = useState("");
	const [receiveVisible, setReceiveVisible] = useState(false);
	const [sentVisible, setSentVisible] = useState(false);
	const [slide, setSlide] = useState("translateX(100%)");
	const [timer, setTimer] = useState<any>(20);
	const [inviteQueued, setInviteQueued] = useState(false);
	const { socket } = useAuthContext();

	/* SOCKET LISTENERS */

	useEffect(() => {
		socket?.on('inviteSent', (body: any) => {
			const {invitedUsername, invitedIdNumber} = body;
			setInvitedId(invitedIdNumber);
			closePanel(true);
			openSent();
			setInvitedUsername(invitedUsername);
			setTimeoutId(setTimeout(() => {
				closePanel(true);
			}, 20000));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('closePanel', (body: any) => {
			closePanel(true);
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
				clearInterval(timerRef.current as NodeJS.Timeout);
			}
		}
		);

		socket?.on('inviteCanceled', (body: any) => {
			setMessage("Invite cancelled");
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			clearInterval(timerRef.current as NodeJS.Timeout);
			setTimeoutId(setTimeout(() => {
				closePanel(true);
			}, 1500));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('inviteAccepted', (body: any) => {
			setMessage("Invite accepted");
			clearInterval(timerRef.current as NodeJS.Timeout);
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			setTimeoutId(setTimeout(() => {
				closePanel(true);
			}, 1500));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('inviteDeclined', (body: any) => {
			setMessage("Invite declined");
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			clearInterval(timerRef.current as NodeJS.Timeout);
			setTimeoutId(setTimeout(() => {
				closePanel(true);
			}, 1500));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('receiveInvite', (body: any) => {
			socket?.emit('isUserQueuedInvite', parseInt(userId));
			closePanel(true);
			setInvitedBy(body.invitorId);
			setMode(body.mode);
			setInvitorUsername(body.invitorUsername);
			openInvite();
			setTimeoutId(setTimeout(() => {
				closePanel(true);
				socket?.emit('removeInviteQueue', { invitorId: body.invitorId });
			}, 20000));
			return () => {
				clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			}
		});

		socket?.on('isAlreadyInGame', (body: any) => {
			const { invitedUsername, sidePanelPopUp } = body;
			closePanel(true);
			if (!sidePanelPopUp)
				return;
			openSent();
			setMessage(invitedUsername + " is already in game");
			setTimeoutId(setTimeout(() => {
				closePanel(true);
			}, 1500));
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
			socket?.off('isAlreadyInGame');
			socket?.off('closePanel');

		}
	}, [socket]);

	/* END SOCKET LISTENERS */

	/* sidePanelActions */

	const closePanel = (clear: boolean) => {
		if (true) {
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
			clearInterval(timerRef.current as NodeJS.Timeout);
		}
		setInviteQueued(false);
		setSlide("translateX(100%)");
		setInvitedBy("");
		setMessage("");
		setTimer(0);
		setMode(false);
		setInviteSent(false);
		setReceiveVisible(false);
		setSentVisible(false);
	}

	const openInvite = () => {
		setSlide("translateX(0%)");
		setTimer(20);
		setReceiveVisible(true);
		setSentVisible(false);
	}

	const openSent = () => {
		setSlide("translateX(0%)");
		setTimer(20);
		setReceiveVisible(false);
		setSentVisible(true);
	}

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
			setInvitedId(invitedId);
			socket?.emit("invite", { invitedId, modeEnabled });
		}
		catch (error) {
			console.log("Invite to play:" + error);
		}
	}

	const respondToInvite = async (invitorId: string, response: boolean) => {
		clearTimeout(timeoutRefId.current as NodeJS.Timeout);
		if (response)
			setMessage("Accepted");
		else
			setMessage("Cancelled");
		setTimeoutId(setTimeout(() => {
			closePanel(true);
		}, 1500));
		socket?.emit('respondToInvite', { invitorId, response });
		return () => {
			clearTimeout(timeoutRefId.current as NodeJS.Timeout);
		}
	}

	const cancelInvite = async (invitedId: string) => {
		closePanel(true);
		socket?.emit('cancelInvite', { invitedId });
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
			setTimer,
			invitorUsername,
			setInvitorUsername,
			invitedUsername,
			setInvitedUsername,
			invitedId,
			setInvitedId,
		}}>
			{children}
		</GameInviteContext.Provider>
	)
}