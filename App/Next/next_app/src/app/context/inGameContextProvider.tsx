'use client';

import { useState } from 'react';
import InGameContext from './inGameContext';

export default function InGameProvider({ children }: any) {
	const [inGameContext, setInGameContext] = useState(false);

	return (
		<InGameContext.Provider value={{ inGameContext, setInGameContext }}>
			{children}
		</InGameContext.Provider>
	)
}
