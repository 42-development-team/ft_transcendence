'use client';

import { useState } from 'react';
import InGameContext from './inGameContext';
import GameInviteContext from './GameInviteContext';

export default function GameInviteProvider({ children }: any) {
	const [invitedBy, setInvitedBy] = useState("");

	return (
		<GameInviteContext.Provider value={{ invitedBy, setInvitedBy }}>
			{children}
		</GameInviteContext.Provider>
	)
}