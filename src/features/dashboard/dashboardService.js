// src/features/dashboard/dashboardService.js
import api from '../../services/axiosConfig';
import { refreshToken } from '../auth/authService';

export const getSessions = async () => {
    try {
        const response = await api.get('/session/list');
        return response.data;
    } catch (error) {
        console.error("Failed to fetch sessions:", error);
        throw error;
    }
};

export const createSession = async (name) => {
    try {
        const response = await api.post('/session/create', { name });
        return response.data;
    } catch (error) {
        console.error("Failed to create session:", error);
        throw error;
    }
};

// ✅ Added logout function
export const logout = async () => {
    try {
        const response = await api.post('/auth/logout', {refreshToken: localStorage.getItem('refresh_token')});
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        return response.data;
    } catch (error) {
        console.error("Failed to log out:", error);
        throw error;
    }
};
