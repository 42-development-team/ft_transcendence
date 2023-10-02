'use client';

import { useEffect, useState } from 'react';
import ThemeContext from './themeContext';

export default function ThemeProvider({ children }: any) {
	const windowUndefined = typeof window === "undefined";
	const [theme, setTheme] = useState<string>('mocha');

	useEffect(() => {
		if (windowUndefined) {
			return;
		} else if (localStorage.getItem("theme")) {
			setTheme(localStorage.getItem("theme") as string);
		}
	}, [windowUndefined]);
	
	return (
		<ThemeContext.Provider value={{ theme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	)
}