const db = require('../db/database.js');

const VALID_STATUSES = ['Confirmed', 'Quality Check', 'In Transit', 'Delivered'];

// --- Prepared statements ---
const getCartForCheckout = db.prepare(`
  SELECT ci.cart_item_id, ci.plant_id, ci.quantity, p.name, p.price, p.stock_qty
  FROM cart_items ci
  JOIN plants p ON p.plant_id = ci.plant_id
  WHERE ci.user_id = ?
`);
const insertOrder = db.prepare(`
  INSERT INTO orders (user_id, delivery_address, delivery_date, special_instr, total_amount, payment_method, status)
  VALUES (?, ?, ?, ?, ?, 'COD', 'Confirmed')
`);
const insertOrderItem = db.prepare(
  'INSERT INTO order_items (order_id, plant_id, quantity, price) VALUES (?, ?, ?, ?)'
);
const decrementStock = db.prepare('UPDATE plants SET stock_qty = stock_qty - ? WHERE plant_id = ?');
const clearCart = db.prepare('DELETE FROM cart_items WHERE user_id = ?');

const getOrderRow = db.prepare('SELECT * FROM orders WHERE order_id = ?');
const listUserOrders = db.prepare(
  'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC, order_id DESC'
);
const getOrderItems = db.prepare(`
  SELECT oi.item_id, oi.plant_id, oi.quantity, oi.price,
         p.name, p.image_url, (oi.price * oi.quantity) AS line_total
  FROM order_items oi
  JOIN plants p ON p.plant_id = oi.plant_id
  WHERE oi.order_id = ?
  ORDER BY oi.item_id
`);
const updateStatusStmt = db.prepare('UPDATE orders SET status = ? WHERE order_id = ?');

function getOrderWithItems(orderId) {
  const order = getOrderRow.get(orderId);
  if (!order) return null;
  order.items = getOrderItems.all(orderId);
  return order;
}

// --- Atomic checkout: all-or-nothing. Throws (rolls back) on any problem. ---
const placeOrder = db.transaction((userId, details) => {
  const cart = getCartForCheckout.all(userId);
  if (cart.length === 0) {
    const e = new Error('Cart is empty');
    e.status = 400;
    throw e;
  }

  let total = 0;
  for (const item of cart) {
    if (item.quantity > item.stock_qty) {
      const e = new Error(
        `Insufficient stock for "${item.name}": requested ${item.quantity}, only ${item.stock_qty} available`
      );
      e.status = 409;
      throw e; // rolls back the entire transaction
    }
    total += item.price * item.quantity;
  }

  const info = insertOrder.run(
    userId,
    details.delivery_address,
    details.delivery_date,
    details.special_instr,
    total
  );
  const orderId = info.lastInsertRowid;

  for (const item of cart) {
    insertOrderItem.run(orderId, item.plant_id, item.quantity, item.price); // price at purchase time
    decrementStock.run(item.quantity, item.plant_id);
  }

  clearCart.run(userId);
  return orderId;
});

// POST /orders (JWT) — checkout
function createOrder(req, res, next) {
  try {
    const { delivery_address, delivery_date, special_instr } = req.body || {};
    if (!delivery_address || !String(delivery_address).trim()) {
      return res.status(400).json({ error: 'delivery_address is required' });
    }

    const orderId = placeOrder(req.user.user_id, {
      delivery_address: String(delivery_address).trim(),
      delivery_date: delivery_date ?? null,
      special_instr: special_instr ?? null,
    });

    res.status(201).json({ order: getOrderWithItems(orderId) });
  } catch (err) {
    if (err && err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

// GET /orders (JWT) — the logged-in user's orders
function getOrders(req, res, next) {
  try {
    const orders = listUserOrders.all(req.user.user_id);
    res.json({ count: orders.length, orders });
  } catch (err) {
    next(err);
  }
}

// GET /orders/:id (JWT) — one order with items + status (owner or admin)
function getOrder(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid order id' });

    const order = getOrderWithItems(id);
    // 404 for both "missing" and "not yours" so we don't leak existence.
    if (!order || (order.user_id !== req.user.user_id && req.user.role !== 'admin')) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (err) {
    next(err);
  }
}

// PUT /orders/:id/status (admin) — advance the 4-stage pipeline
function updateOrderStatus(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid order id' });

    const { status } = req.body || {};
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
    }

    if (!getOrderRow.get(id)) return res.status(404).json({ error: 'Order not found' });

    updateStatusStmt.run(status, id);
    res.json({ order: getOrderWithItems(id) });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrders, getOrder, updateOrderStatus };
