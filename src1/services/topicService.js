import API from './api.js';

export const getTopics = (sessionId) =>
  API.get(`/topic/${sessionId}/list`);

export const selectTopics = (sessionId, topics) =>
  API.post(`/session/${sessionId}/select-topics`, { topics });

export const generateLesson = (sessionId) =>
  API.post(
    `/session/${sessionId}/generate-lesson`,
    new URLSearchParams({ lesson_preference: 'Gimme simplified explanations' })
  );
