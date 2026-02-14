import { createContext, useState } from 'react'

export const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light')

    const toggleTheme = () => {
        const t = theme === 'light' ? 'dark' : 'light'
        setTheme(t)
        document.documentElement.setAttribute('data-theme', t)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
