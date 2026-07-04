import axios from 'axios';

// localStorage keys, shared with AuthContext so the interceptors and the
// context read/write the exact same slots.
export const TOKEN_KEY = 'ff_token';
export const USER_KEY = 'ff_user';

// Requests hit /api/v1/* and are proxied to the backend by Vite (see vite.config.js).
const api = axios.create({
  baseURL: '/api/v1',
});

// --- Request interceptor: attach the JWT from localStorage as a Bearer token. ---
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: on 401, clear the session and bounce to /login. ---
// We skip the redirect when the failing call is login/register (so the auth
// forms can surface "invalid credentials" instead of a page reload) and when
// we are already sitting on the login page (avoids a redirect loop).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthAttempt = url.includes('/auth/login') || url.includes('/auth/register');

    if (status === 401 && !isAuthAttempt) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
