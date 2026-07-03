import { createContext, useState } from 'react';
import { login as loginService, register as registerService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(false);


    const isAuthenticated = !!token;

    const login = async (credentials) => {
        setLoading(true);
        try {
            const data = await loginService(credentials);
            
            setToken(data.token);
            setUser(data.user);
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            return data;
        } catch (error) {
          
            throw error; 
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const data = await registerService(userData);
            return data;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};