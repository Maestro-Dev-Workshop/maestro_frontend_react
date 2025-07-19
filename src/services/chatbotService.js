import API from './api.js';

export const getChatHistory = (sessionId) =>
  API.get(`/chatbot/${sessionId}/chat-history`);

export const sendMessage = (sessionId, message) =>
  API.post(`/chatbot/${sessionId}/send-message`, {
    message,
    metadata: {},
  });

export const submitEssayAnswer = (questionId, answer) => {
  const formData = new URLSearchParams();
  formData.append('question_id', questionId);
  formData.append('answer', answer);
  return API.post('/chatbot/answer-question', formData);
};
