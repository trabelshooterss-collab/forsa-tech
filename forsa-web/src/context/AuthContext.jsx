import { createContext, useState, useEffect } from 'react';
import { insforge } from '../lib/insforge';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data } = await insforge.auth.getCurrentSession();
                if (data?.session) {
                    setUser(data.session.user);
                    setIsLoggedIn(true);
                }
            } catch (err) {
                console.error("Auth check failed:", err);
            } finally {
                setLoading(false);
            }
        };
        checkSession();
    }, []);

    const login = async (email, password) => {
        const { data, error } = await insforge.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setUser(data.user);
        setIsLoggedIn(true);
        return data;
    };

    const loginMock = (email) => {
        const mockUser = {
            id: 'd8e74d28-d8d9-83e8-e8ea-013d728e93f9', // Matching the API_KEY part for consistency or just a random UUID
            email: email || 'admin@forsa.com',
            user_metadata: { full_name: 'محمد أحمد' },
            coins: 2450
        };
        setUser(mockUser);
        setIsLoggedIn(true);
    };

    const logout = async () => {
        await insforge.auth.signOut();
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, loading, login, loginMock, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
