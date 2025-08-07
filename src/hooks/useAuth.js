import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/axiosConfig';

export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = useCallback(() => {
    setLoading(true);
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setLoading(false);
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

  return { isAuthenticated, loading, checkAuth, logout, getAccessToken };
}
