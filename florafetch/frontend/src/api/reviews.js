import api from './client.js';

// Review endpoints (see routes/reviews.js and routes/admin.js).

// GET /reviews/plant/:plantId (public), approved reviews -> { count, reviews }
export function getPlantReviews(plantId) {
  return api.get(`/reviews/plant/${plantId}`).then((res) => res.data);
}

// POST /reviews (JWT, multipart), submit a review with an optional photo -> { review }
// Pass a FormData with fields: plant_id, rating, review_text?, order_id?, photo? (file).
export function createReview(formData) {
  return api
    .post('/reviews', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((res) => res.data);
}

// PUT /reviews/:id/approve (admin) -> { review }
export function approveReview(id) {
  return api.put(`/reviews/${id}/approve`).then((res) => res.data);
}

// GET /admin/reviews (admin), moderation queue of unapproved reviews -> { count, reviews }
export function getModerationQueue() {
  return api.get('/admin/reviews').then((res) => res.data);
}
