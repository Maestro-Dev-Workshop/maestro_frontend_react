import api from '../../services/axiosConfig';

// Sign Up
export async function signUp(userData) {
  return api.post('/auth/sign-up', userData);
}

// Login
export async function login(credentials) {
  return api.post('/auth/login', credentials);
}

// Refresh Token
export async function refreshToken() {
  const refresh_token = localStorage.getItem('refreshToken');
  return api.post('/auth/refresh-token', null, {
    headers: { Authorization: `Bearer ${refresh_token}` },
  });
}

// Logout
export async function logout() {
  const refresh_token = localStorage.getItem('refreshToken');
  return api.post('/auth/logout', { refresh_token });
}
