'use client';

import { useState } from 'react';
import LoadingContext from './LoadingContext';

export default function LoadingProvider({ children }: any) {
	const [gameLoading, setGameLoading] = useState('latte');

	return (
		<LoadingContext.Provider value={{ gameLoading, setGameLoading }}>
			{children}
		</LoadingContext.Provider>
	)
}