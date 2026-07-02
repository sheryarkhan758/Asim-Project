import api from './client.js';

// Category endpoints (see routes/categories.js).

// GET /categories -> { count, categories }
export function getCategories() {
  return api.get('/categories').then((res) => res.data);
}
