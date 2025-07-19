import API from './api.js';

export const getUserSessions = () => API.get('/session/list');

export const createSession = (name) => {
  const formData = new URLSearchParams();
  formData.append('name', name);
  return API.post('/session/create', formData);
};

export const uploadDocuments = (sessionId, files) => {
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  return API.post(`/session/${sessionId}/docs/ingest`, formData);
};

export const labelDocuments = (sessionId) => {
  const formData = new URLSearchParams();
  //topics.forEach((t) => formData.append('topics', t));
  return API.post(`/session/${sessionId}/docs/label`, formData);
};


export const selectTopics = (sessionId, topics) =>
  API.post(`/session/${sessionId}/select-topics`, {
    topics, // ✅ this must be an array of strings
  });

