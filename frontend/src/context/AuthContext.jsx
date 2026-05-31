import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phoneNumber, dateOfBirth, role) => {
    try {
      const response = await API.post('/api/auth/login', { phoneNumber, dateOfBirth, role });
      const { token, email, roles } = response.data;
      
      const userData = { username: phoneNumber, email, role: roles[0] }; // Map login identity
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(token);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error.response?.data || 'Login failed. Please check credentials.';
    }
  };

  const register = async (payload) => {
    try {
      await API.post('/api/auth/register', payload);
    } catch (error) {
      throw error.response?.data || 'Registration failed.';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
