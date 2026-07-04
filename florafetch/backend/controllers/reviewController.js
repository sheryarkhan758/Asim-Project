const db = require('../db/database.js');

// --- Prepared statements ---
const getPlant = db.prepare('SELECT plant_id FROM plants WHERE plant_id = ?');
const getOrder = db.prepare('SELECT order_id, user_id FROM orders WHERE order_id = ?');
const insertReview = db.prepare(`
  INSERT INTO reviews (user_id, plant_id, order_id, rating, review_text, photo_url, is_approved)
  VALUES (?, ?, ?, ?, ?, ?, 0)
`);
const getReviewById = db.prepare('SELECT * FROM reviews WHERE review_id = ?');
const approvedForPlant = db.prepare(`
  SELECT r.review_id, r.user_id, r.plant_id, r.order_id, r.rating, r.review_text,
         r.photo_url, r.is_approved, r.created_at, u.full_name AS reviewer
  FROM reviews r
  JOIN users u ON u.user_id = r.user_id
  WHERE r.plant_id = ? AND r.is_approved = 1
  ORDER BY r.created_at DESC
`);
const moderationQueue = db.prepare(`
  SELECT r.review_id, r.user_id, r.plant_id, r.order_id, r.rating, r.review_text,
         r.photo_url, r.is_approved, r.created_at,
         u.full_name AS reviewer, p.name AS plant_name
  FROM reviews r
  JOIN users u ON u.user_id = r.user_id
  JOIN plants p ON p.plant_id = r.plant_id
  WHERE r.is_approved = 0
  ORDER BY r.created_at ASC
`);
const approveStmt = db.prepare('UPDATE reviews SET is_approved = 1 WHERE review_id = ?');

// POST /reviews (JWT, multipart), defaults is_approved to 0
function createReview(req, res, next) {
  try {
    const userId = req.user.user_id;
    const { plant_id, order_id, review_text } = req.body || {};
    const rating = Number(req.body.rating);
    const pid = Number(plant_id);

    if (!Number.isInteger(pid)) {
      return res.status(400).json({ error: 'plant_id is required and must be an integer' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'rating must be an integer between 1 and 5' });
    }
    if (!getPlant.get(pid)) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    let oid = null;
    if (order_id !== undefined && order_id !== '' && order_id !== null) {
      oid = Number(order_id);
      if (!Number.isInteger(oid)) {
        return res.status(400).json({ error: 'order_id must be an integer' });
      }
      const order = getOrder.get(oid);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      if (order.user_id !== userId) {
        return res.status(403).json({ error: 'You can only review your own orders' });
      }
    }

    // Uploaded file is served from /uploads (see static mount in server.js).
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const info = insertReview.run(userId, pid, oid, rating, review_text ?? null, photo_url);
    res.status(201).json({ review: getReviewById.get(info.lastInsertRowid) });
  } catch (err) {
    next(err);
  }
}

// GET /reviews/plant/:plantId (public), approved reviews only
function getPlantReviews(req, res, next) {
  try {
    const pid = Number(req.params.plantId);
    if (!Number.isInteger(pid)) return res.status(400).json({ error: 'Invalid plant id' });
    const reviews = approvedForPlant.all(pid);
    res.json({ count: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
}

// GET /admin/reviews (admin), moderation queue of unapproved reviews
function getModerationQueue(req, res, next) {
  try {
    const reviews = moderationQueue.all();
    res.json({ count: reviews.length, reviews });
  } catch (err) {
    next(err);
  }
}

// PUT /reviews/:id/approve (admin)
function approveReview(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid review id' });
    if (!getReviewById.get(id)) return res.status(404).json({ error: 'Review not found' });
    approveStmt.run(id);
    res.json({ review: getReviewById.get(id) });
  } catch (err) {
    next(err);
  }
}

module.exports = { createReview, getPlantReviews, getModerationQueue, approveReview };
