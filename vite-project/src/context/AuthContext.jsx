// src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') ?? '');
  const [role, setRole] = useState(localStorage.getItem('role') ?? '');

  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    setToken(token);
    setRole(role);
  };

  const logout = () => {
    localStorage.clear();
    setToken('');
    setRole('');
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token') ?? '');
      setRole(localStorage.getItem('role') ?? '');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
