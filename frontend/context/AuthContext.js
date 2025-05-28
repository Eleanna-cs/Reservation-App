
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/AuthService';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      const profile = await AuthService.getProfile(storedToken);
      setUser(profile);
    }
  } catch (error) {
    console.log('Error loading profile:', error.message);
    await AsyncStorage.removeItem('token'); 
    setToken(null);
    setUser(null);
  } finally {
    setLoading(false);
  }
};

    loadToken();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://192.168.2.12:5000/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data;

      
      setToken(token);
      await AsyncStorage.setItem('token', token);

     
      const profile = await AuthService.getProfile(token);
      setUser(profile);

      return token;
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      throw new Error('Incorrect credentials');
    }
  };

  const register = async (name, email, password, role) => {
    return await AuthService.register(name, email, password, role);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
