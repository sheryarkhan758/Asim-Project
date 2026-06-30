import axios from 'axios';

// Requests hit /api/v1/* and are proxied to the backend by Vite (see vite.config.js).
const api = axios.create({
  baseURL: '/api/v1',
});

export default api;
