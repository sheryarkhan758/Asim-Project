const db = require('../db/database.js');

const listCategories = db.prepare(
  'SELECT category_id, name, description FROM categories ORDER BY name'
);

// GET /categories (public)
function getAllCategories(req, res, next) {
  try {
    const categories = listCategories.all();
    res.json({ count: categories.length, categories });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllCategories };
