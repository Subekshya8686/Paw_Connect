import { useEffect, useState } from 'react';
import config from '../config/config';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(config.TOKEN_KEY);
    const role = localStorage.getItem(config.ROLE_KEY);
    const id = localStorage.getItem(config.USER_ID_KEY);

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUserId(id);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
      setUserId(null);
    }
    setIsLoading(false);
  }, []);

  const login = (token, role, id) => {
    localStorage.setItem(config.TOKEN_KEY, token);
    localStorage.setItem(config.ROLE_KEY, role);
    localStorage.setItem(config.USER_ID_KEY, id);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(id);
  };

  const logout = () => {
    localStorage.removeItem(config.TOKEN_KEY);
    localStorage.removeItem(config.ROLE_KEY);
    localStorage.removeItem(config.USER_ID_KEY);
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
  };

  const isAdmin = () => userRole === 'Admin';
  const isUser = () => userRole === 'User';

  return {
    isAuthenticated,
    userRole,
    userId,
    isLoading,
    login,
    logout,
    isAdmin,
    isUser,
  };
}; 