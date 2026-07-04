import api from './client.js';

// Auth endpoints, one function per backend route (see routes/auth.js).
// Each returns the parsed JSON body.

// POST /auth/register -> { user }
export function register(data) {
  return api.post('/auth/register', data).then((res) => res.data);
}

// POST /auth/login (email or phone + password) -> { token, user }
export function login(credentials) {
  return api.post('/auth/login', credentials).then((res) => res.data);
}

// POST /auth/logout (JWT) -> { message }
export function logout() {
  return api.post('/auth/logout').then((res) => res.data);
}

// GET /auth/profile (JWT) -> { user }
export function getProfile() {
  return api.get('/auth/profile').then((res) => res.data);
}

// PUT /auth/profile (JWT), details + saved addresses -> { user }
export function updateProfile(data) {
  return api.put('/auth/profile', data).then((res) => res.data);
}
