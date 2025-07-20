import api from '../../services/axiosConfig';

export const createSession = async (sessionName) => {
    const res = await api.post('/session/create', { name: sessionName });
    return res.data;
};

export const uploadDocuments = async (sessionId, files) => {
    const formData = new FormData();
    Array.from(files).forEach(file => formData.append('files', file));
    const res = await api.post(`/session/${sessionId}/docs/ingest`, formData);
    return res.data;
};

export const labelDocuments = async (sessionId) => {
    const res = await api.post(`/session/${sessionId}/docs/label`);
    return res.data;
};

export const selectTopics = async (sessionId, topics) => {
    const response = await api.post(`/session/${sessionId}/select-topics`, { topics });
    return response.data;
};

export const generateLesson = async (sessionId, lessonPreference) => {
    // const data = new URLSearchParams();
    const response = await api.post(`/session/${sessionId}/generate-lesson`, { lesson_preference: lessonPreference });
    return response.data;
};

export const generateExercises = async (sessionId, payload) => {
    const response = await api.post(`/session/${sessionId}/generate-exercises`, payload);
    return response.data;
};

export const generateExam = async (sessionId, payload) => {
    const response = await api.post(`/session/${sessionId}/generate-exam`, payload);
    return response.data;
};
