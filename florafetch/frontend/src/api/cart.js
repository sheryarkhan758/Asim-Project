import api from './client.js';

// Cart endpoints (see routes/cart.js). All require a JWT.
// Every call resolves to the full cart snapshot: { count, subtotal, items }.

// GET /cart -> { count, subtotal, items }
export function getCart() {
  return api.get('/cart').then((res) => res.data);
}

// POST /cart, add a plant (increments quantity if already present) -> cart snapshot
export function addToCart(plantId, quantity = 1) {
  return api.post('/cart', { plant_id: plantId, quantity }).then((res) => res.data);
}

// DELETE /cart/:itemId -> cart snapshot
export function removeFromCart(itemId) {
  return api.delete(`/cart/${itemId}`).then((res) => res.data);
}
