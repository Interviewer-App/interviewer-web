// Create a Providers component to wrap your application with all the components requiring 'use client', such as next-nprogress-bar or your different contexts...
'use client';

import { ThemeProvider } from '@/components/ui/theme-provider';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { createContext, useEffect, useState } from 'react';

// Create a context for theme
export const ThemeContext = createContext(null);

const Providers = ({ children }) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        localStorage.setItem('theme', theme === 'light' ? 'dark' : 'light');
    }

    const getCurrentTheme = () => {
        const themeLocalStorage = localStorage.getItem('theme');
        if (themeLocalStorage) {
            setTheme(themeLocalStorage);
        }
    }

    useEffect(() => {
        getCurrentTheme();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            <ThemeProvider
                attribute="class"
                defaultTheme={'light'}
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <ProgressBar
                    height="4px"
                    color="#fffd00"
                    options={{ showSpinner: false }}
                    shallowRouting
                />
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

export default Providers;

