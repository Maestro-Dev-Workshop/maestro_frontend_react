import axios from 'axios';
import store from '../redux/store.js';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 300000, 
});

API.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
