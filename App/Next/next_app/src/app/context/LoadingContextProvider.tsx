'use client';

import { useState } from 'react';
import LoadingContext from './LoadingContext';

export default function LoadingProvider({ children }: any) {
	const [gameLoading, setGameLoading] = useState(false);

	return (
		<LoadingContext.Provider value={{ gameLoading, setGameLoading }}>
			{children}
		</LoadingContext.Provider>
	)
}