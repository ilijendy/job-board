import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const raw = localStorage.getItem('user');
        if (raw) {
            try {
                setUser(JSON.parse(raw));
            } catch {
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = (nextUser, token) => {
        localStorage.setItem('user', JSON.stringify(nextUser));
        localStorage.setItem('token', token);
        setUser(nextUser);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
