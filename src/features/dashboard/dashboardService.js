// src/features/dashboard/dashboardService.js
import api from '../../services/axiosConfig';

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
