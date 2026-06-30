const db = require('../db/database.js');

// Explicit column list reused by every read (avoids SELECT * surprises).
const COLS = `plant_id, category_id, name, botanical_name, description, price, size,
  stock_qty, sunlight_req, watering_freq, is_pet_friendly, is_low_maint, image_url, created_at`;

const insertPlant = db.prepare(`
  INSERT INTO plants
    (category_id, name, botanical_name, description, price, size, stock_qty,
     sunlight_req, watering_freq, is_pet_friendly, is_low_maint, image_url)
  VALUES
    (@category_id, @name, @botanical_name, @description, @price, @size, @stock_qty,
     @sunlight_req, @watering_freq, @is_pet_friendly, @is_low_maint, @image_url)
`);

const updatePlantStmt = db.prepare(`
  UPDATE plants SET
    category_id = @category_id, name = @name, botanical_name = @botanical_name,
    description = @description, price = @price, size = @size, stock_qty = @stock_qty,
    sunlight_req = @sunlight_req, watering_freq = @watering_freq,
    is_pet_friendly = @is_pet_friendly, is_low_maint = @is_low_maint, image_url = @image_url
  WHERE plant_id = @plant_id
`);

const getByIdStmt = db.prepare(`SELECT ${COLS} FROM plants WHERE plant_id = ?`);
const getRawByIdStmt = db.prepare('SELECT * FROM plants WHERE plant_id = ?');
const deleteStmt = db.prepare('DELETE FROM plants WHERE plant_id = ?');

// Coerce common truthy/falsy strings to 1/0; undefined if not a recognized boolean.
function toBool01(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const s = String(v).toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(s)) return 1;
  if (['0', 'false', 'no', 'off'].includes(s)) return 0;
  return undefined;
}

// GET /plants  (public) — supports filters: category, low_maint, pet_friendly, min_price, max_price
function getAllPlants(req, res, next) {
  try {
    const { category, low_maint, pet_friendly, min_price, max_price } = req.query;
    const where = [];
    const params = [];

    if (category !== undefined && category !== '') {
      const id = Number(category);
      if (!Number.isInteger(id)) {
        return res.status(400).json({ error: 'category must be an integer id' });
      }
      where.push('category_id = ?');
      params.push(id);
    }

    const lm = toBool01(low_maint);
    if (lm !== undefined) {
      where.push('is_low_maint = ?');
      params.push(lm);
    }

    const pf = toBool01(pet_friendly);
    if (pf !== undefined) {
      where.push('is_pet_friendly = ?');
      params.push(pf);
    }

    if (min_price !== undefined && min_price !== '') {
      const v = Number(min_price);
      if (Number.isNaN(v)) return res.status(400).json({ error: 'min_price must be a number' });
      where.push('price >= ?');
      params.push(v);
    }

    if (max_price !== undefined && max_price !== '') {
      const v = Number(max_price);
      if (Number.isNaN(v)) return res.status(400).json({ error: 'max_price must be a number' });
      where.push('price <= ?');
      params.push(v);
    }

    const sql =
      `SELECT ${COLS} FROM plants` +
      (where.length ? ` WHERE ${where.join(' AND ')}` : '') +
      ' ORDER BY created_at DESC, plant_id DESC';

    const plants = db.prepare(sql).all(...params);
    res.json({ count: plants.length, plants });
  } catch (err) {
    next(err);
  }
}

// GET /plants/:id  (public)
function getPlantById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid plant id' });
    const plant = getByIdStmt.get(id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    res.json({ plant });
  } catch (err) {
    next(err);
  }
}

// GET /plants/category/:id  (public)
function getPlantsByCategory(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid category id' });
    const plants = db.prepare(`SELECT ${COLS} FROM plants WHERE category_id = ? ORDER BY name`).all(id);
    res.json({ count: plants.length, plants });
  } catch (err) {
    next(err);
  }
}

// POST /plants  (admin)
function createPlant(req, res, next) {
  try {
    const b = req.body || {};
    if (!b.name || b.price === undefined || b.price === null) {
      return res.status(400).json({ error: 'name and price are required' });
    }
    const price = Number(b.price);
    if (Number.isNaN(price)) return res.status(400).json({ error: 'price must be a number' });

    const record = {
      category_id: b.category_id != null && b.category_id !== '' ? Number(b.category_id) : null,
      name: b.name,
      botanical_name: b.botanical_name ?? null,
      description: b.description ?? null,
      price,
      size: b.size ?? null,
      stock_qty: b.stock_qty != null && b.stock_qty !== '' ? Number(b.stock_qty) : 0,
      sunlight_req: b.sunlight_req ?? null,
      watering_freq: b.watering_freq ?? null,
      is_pet_friendly: toBool01(b.is_pet_friendly) ?? 0,
      is_low_maint: toBool01(b.is_low_maint) ?? 0,
      image_url: b.image_url ?? null,
    };

    const info = insertPlant.run(record);
    res.status(201).json({ plant: getByIdStmt.get(info.lastInsertRowid) });
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return res.status(400).json({ error: 'Invalid category_id' });
    }
    next(err);
  }
}

// PUT /plants/:id  (admin) — partial update (only provided fields change)
function updatePlant(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid plant id' });

    const existing = getRawByIdStmt.get(id);
    if (!existing) return res.status(404).json({ error: 'Plant not found' });

    const b = req.body || {};
    const pick = (key) => (b[key] !== undefined ? b[key] : existing[key]);

    const merged = {
      plant_id: id,
      category_id:
        b.category_id !== undefined
          ? b.category_id === null || b.category_id === ''
            ? null
            : Number(b.category_id)
          : existing.category_id,
      name: pick('name'),
      botanical_name: pick('botanical_name'),
      description: pick('description'),
      price: b.price !== undefined ? Number(b.price) : existing.price,
      size: pick('size'),
      stock_qty: b.stock_qty !== undefined ? Number(b.stock_qty) : existing.stock_qty,
      sunlight_req: pick('sunlight_req'),
      watering_freq: pick('watering_freq'),
      is_pet_friendly:
        b.is_pet_friendly !== undefined
          ? toBool01(b.is_pet_friendly) ?? existing.is_pet_friendly
          : existing.is_pet_friendly,
      is_low_maint:
        b.is_low_maint !== undefined
          ? toBool01(b.is_low_maint) ?? existing.is_low_maint
          : existing.is_low_maint,
      image_url: pick('image_url'),
    };

    if (Number.isNaN(merged.price)) return res.status(400).json({ error: 'price must be a number' });
    if (Number.isNaN(merged.stock_qty)) return res.status(400).json({ error: 'stock_qty must be a number' });

    updatePlantStmt.run(merged);
    res.json({ plant: getByIdStmt.get(id) });
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return res.status(400).json({ error: 'Invalid category_id' });
    }
    next(err);
  }
}

// DELETE /plants/:id  (admin)
function deletePlant(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid plant id' });
    const info = deleteStmt.run(id);
    if (info.changes === 0) return res.status(404).json({ error: 'Plant not found' });
    res.json({ message: 'Plant deleted', plant_id: id });
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      return res
        .status(409)
        .json({ error: 'Cannot delete: plant is referenced by orders, cart, or reviews' });
    }
    next(err);
  }
}

module.exports = {
  getAllPlants,
  getPlantById,
  getPlantsByCategory,
  createPlant,
  updatePlant,
  deletePlant,
};
