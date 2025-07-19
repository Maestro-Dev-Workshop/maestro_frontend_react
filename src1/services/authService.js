import API from './api.js';

export const login = (email, password) => {
  const formData = new URLSearchParams();
  formData.append('email', email);
  formData.append('password', password);
  return API.post('/auth/login', formData);
};

export const signup = (userData) => {
  const formData = new URLSearchParams();
  Object.entries(userData).forEach(([key, value]) => {
    formData.append(key, value);
  });
  return API.post('/auth/sign-up', formData);
};
