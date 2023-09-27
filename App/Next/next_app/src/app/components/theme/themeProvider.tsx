'use client';

import { useState } from 'react';
import ThemeContext from './themeContext';

export default function ThemeProvider({ children }: any) {
	const windowUndefined = typeof window !== "undefined";
	const [theme, setTheme] = useState(windowUndefined ? (localStorage.getItem("theme") || 'mocha') : 'mocha');

	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}