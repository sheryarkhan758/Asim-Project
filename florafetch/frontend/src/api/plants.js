import api from './client.js';

// Plant endpoints (see routes/plants.js). Each returns the parsed JSON body.

// GET /plants -> { count, plants }
// Supports filter query params: category, low_maint, pet_friendly, min_price, max_price
export function getPlants(params = {}) {
  return api.get('/plants', { params }).then((res) => res.data);
}

// GET /plants/:id -> { plant }
export function getPlant(id) {
  return api.get(`/plants/${id}`).then((res) => res.data);
}

// GET /plants/category/:id -> { count, plants }
export function getPlantsByCategory(categoryId) {
  return api.get(`/plants/category/${categoryId}`).then((res) => res.data);
}

// POST /plants (admin) -> { plant }
export function createPlant(data) {
  return api.post('/plants', data).then((res) => res.data);
}

// PUT /plants/:id (admin), partial update -> { plant }
export function updatePlant(id, data) {
  return api.put(`/plants/${id}`, data).then((res) => res.data);
}

// DELETE /plants/:id (admin) -> { message, plant_id }
export function deletePlant(id) {
  return api.delete(`/plants/${id}`).then((res) => res.data);
}
