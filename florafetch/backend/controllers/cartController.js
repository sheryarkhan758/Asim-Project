const db = require('../db/database.js');

// Cart rows joined with plant details, scoped to one user.
const listCart = db.prepare(`
  SELECT
    ci.cart_item_id,
    ci.quantity,
    ci.created_at,
    p.plant_id,
    p.name,
    p.botanical_name,
    p.price,
    p.size,
    p.stock_qty,
    p.image_url,
    p.category_id,
    (p.price * ci.quantity) AS line_total
  FROM cart_items ci
  JOIN plants p ON p.plant_id = ci.plant_id
  WHERE ci.user_id = ?
  ORDER BY ci.created_at DESC, ci.cart_item_id DESC
`);

const getPlant = db.prepare('SELECT plant_id, stock_qty FROM plants WHERE plant_id = ?');
const findCartRow = db.prepare(
  'SELECT cart_item_id, quantity FROM cart_items WHERE user_id = ? AND plant_id = ?'
);
const insertCartRow = db.prepare(
  'INSERT INTO cart_items (user_id, plant_id, quantity) VALUES (?, ?, ?)'
);
const bumpQuantity = db.prepare(
  'UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?'
);
const findCartRowById = db.prepare(
  'SELECT cart_item_id FROM cart_items WHERE cart_item_id = ? AND user_id = ?'
);
const deleteCartRow = db.prepare('DELETE FROM cart_items WHERE cart_item_id = ? AND user_id = ?');

function buildCartResponse(userId) {
  const items = listCart.all(userId);
  const subtotal = items.reduce((sum, i) => sum + i.line_total, 0);
  return { count: items.length, subtotal, items };
}

// GET /cart, the current user's cart joined with plant details
function getCart(req, res, next) {
  try {
    res.json(buildCartResponse(req.user.user_id));
  } catch (err) {
    next(err);
  }
}

// POST /cart, add a plant + quantity; if already in cart, increment
function addToCart(req, res, next) {
  try {
    const userId = req.user.user_id;
    const { plant_id } = req.body || {};
    let { quantity } = req.body || {};

    const pid = Number(plant_id);
    if (!Number.isInteger(pid)) {
      return res.status(400).json({ error: 'plant_id is required and must be an integer' });
    }

    quantity = quantity === undefined ? 1 : Number(quantity);
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'quantity must be a positive integer' });
    }

    if (!getPlant.get(pid)) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    const existing = findCartRow.get(userId, pid);
    if (existing) {
      bumpQuantity.run(quantity, existing.cart_item_id);
    } else {
      insertCartRow.run(userId, pid, quantity);
    }

    res.status(201).json(buildCartResponse(userId));
  } catch (err) {
    next(err);
  }
}

// DELETE /cart/:itemId, remove, only if it belongs to the user
function removeFromCart(req, res, next) {
  try {
    const userId = req.user.user_id;
    const itemId = Number(req.params.itemId);
    if (!Number.isInteger(itemId)) {
      return res.status(400).json({ error: 'Invalid cart item id' });
    }

    // 404 covers both "doesn't exist" and "belongs to another user", without leaking which.
    if (!findCartRowById.get(itemId, userId)) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    deleteCartRow.run(itemId, userId);
    res.json(buildCartResponse(userId));
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, removeFromCart };
