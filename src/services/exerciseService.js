import API from './api.js';

export const getExercise = (topicId) =>
  API.get(`/topic/${topicId}/get-exercise`);

export const saveExerciseScore = (topicId, data) =>
  API.post(`/topic/${topicId}/save-exercise-score`, data);
