import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                api.defaults.headers.common['Authorization'] = token;
                const response = await api.get('/users/profile');
                if (response.data.success) {
                    setUser(response.data.user);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');
            if (storedUser && token) {
                setUser(JSON.parse(storedUser));
                // Background refresh to get latest data (e.g. resume path)
                await fetchProfile();
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            // Set header for future requests
            api.defaults.headers.common['Authorization'] = token;
            setUser(user);
            return { success: true, user };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || error.message || 'Login failed'
            };
        }
    };

    const signup = async (name, email, password, confirmPassword, role) => {
        try {
            // Defaulting Role to student if not provided, but Admin might create Admin
            const response = await api.post('/users/create', { name, email, password, confirmPassword, role });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, fetchProfile }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
