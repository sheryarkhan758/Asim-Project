import api from './client.js';

// Order endpoints (see routes/orders.js). All require a JWT.

// POST /orders, checkout the current cart -> { order }
// data: { delivery_address, delivery_date?, special_instr? }
export function createOrder(data) {
  return api.post('/orders', data).then((res) => res.data);
}

// GET /orders, the logged-in user's orders -> { count, orders }
export function getOrders() {
  return api.get('/orders').then((res) => res.data);
}

// GET /admin/orders (admin), every order in the store -> { count, orders }
export function getAllOrders() {
  return api.get('/admin/orders').then((res) => res.data);
}

// GET /orders/:id, one order with items + status -> { order }
export function getOrder(id) {
  return api.get(`/orders/${id}`).then((res) => res.data);
}

// PUT /orders/:id/status (admin), advance the 4-stage pipeline -> { order }
export function updateOrderStatus(id, status) {
  return api.put(`/orders/${id}/status`, { status }).then((res) => res.data);
}
