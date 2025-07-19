import API from './api.js';

export const generateExam = (sessionId, body) =>
  API.post(`/session/${sessionId}/generate-exam`, body);

export const getExam = (sessionId) =>
  API.get(`/session/${sessionId}/get-exam`);

export const saveExamScore = (sessionId, data) =>
  API.post(`/session/${sessionId}/save-exam-score`, data);
