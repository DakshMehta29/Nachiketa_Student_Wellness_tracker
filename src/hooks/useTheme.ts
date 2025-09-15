import { useEffect, useState, useCallback } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'manasfit-theme';

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) as Theme | null : null;
		if (stored === 'light' || stored === 'dark') return stored;
		if (typeof window !== 'undefined') {
			const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
			return prefersDark ? 'dark' as Theme : 'light' as Theme;
		}
		return 'light';
	});

	useEffect(() => {
		const root = document.documentElement;
		if (theme === 'dark') {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}
		localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const toggleTheme = useCallback(() => {
		setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
	}, []);

	return { theme, toggleTheme };
}


