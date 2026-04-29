import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('us_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (userData) => {
    localStorage.setItem('us_user', JSON.stringify(userData));
    if (userData.token) localStorage.setItem('us_token', userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('us_user');
    localStorage.removeItem('us_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
