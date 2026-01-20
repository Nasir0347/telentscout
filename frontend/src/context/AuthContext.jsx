import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext({
    user: null,
    token: null,
    login: () => { },
    register: () => { },
    logout: () => { },
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Validate token and fetch user
            api.get('/user')
                .then((res) => {
                    setUser(res.data);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                })
                .finally(() => setIsLoading(false));
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const res = await api.post('/login', { email, password });
        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
        setUser(res.data.user);
        return res.data;
    };

    const register = async (data) => {
        const res = await api.post('/register', data);
        localStorage.setItem('token', res.data.access_token);
        setToken(res.data.access_token);
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.error(e);
        }
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
