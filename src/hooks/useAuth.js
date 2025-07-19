import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if access token exists
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    return !!token;
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(() => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      axios.post('/auth/logout', { refresh_token }).catch(console.error);
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
    navigate('/login');
  }, [navigate]);

  const getAccessToken = () => localStorage.getItem('access_token');

  return { isAuthenticated, checkAuth, logout, getAccessToken };
}
