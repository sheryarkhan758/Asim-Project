const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database.js');

const SALT_ROUNDS = 12;

// --- Prepared (parameterized) statements ---
const findByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const findByEmailOrPhone = db.prepare('SELECT * FROM users WHERE email = ? OR phone = ?');
const insertUser = db.prepare(
  'INSERT INTO users (full_name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)'
);
const findById = db.prepare(
  `SELECT user_id, full_name, email, phone, role, addresses, created_at
   FROM users WHERE user_id = ?`
);
const updateUser = db.prepare(
  'UPDATE users SET full_name = ?, phone = ?, addresses = ? WHERE user_id = ?'
);

// --- Helpers ---
function parseAddresses(value) {
  if (value == null) return null;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function publicUser(u) {
  if (!u) return u;
  const { password, ...rest } = u;
  return { ...rest, addresses: parseAddresses(rest.addresses) };
}

function signToken(user) {
  return jwt.sign(
    { user_id: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
}

// --- POST /auth/register ---
function register(req, res, next) {
  try {
    const { full_name, email, phone, password } = req.body || {};
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'full_name, email, and password are required' });
    }
    if (findByEmail.get(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = bcrypt.hashSync(password, SALT_ROUNDS);
    const info = insertUser.run(full_name, email, phone || null, hash, 'customer');
    const user = findById.get(info.lastInsertRowid);

    return res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Email or phone already in use' });
    }
    return next(err);
  }
}

// --- POST /auth/login (email or phone + password) -> JWT ---
function login(req, res, next) {
  try {
    const { email, phone, password } = req.body || {};
    if ((!email && !phone) || !password) {
      return res.status(400).json({ error: 'email (or phone) and password are required' });
    }

    const user = findByEmailOrPhone.get(email || null, phone || null);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({ token, user: publicUser(user) });
  } catch (err) {
    return next(err);
  }
}

// --- POST /auth/logout (stateless JWT) ---
function logout(req, res) {
  // JWTs are stateless; the client discards the token. Nothing to revoke server-side.
  return res.json({ message: 'Logged out. Please discard your token.' });
}

// --- GET /auth/profile ---
function getProfile(req, res) {
  // req.user is set by requireAuth (no password column selected).
  return res.json({ user: publicUser(req.user) });
}

// --- PUT /auth/profile (details + saved addresses JSON) ---
function updateProfile(req, res, next) {
  try {
    const current = req.user;
    const { full_name, phone, addresses } = req.body || {};

    const newName = full_name !== undefined ? full_name : current.full_name;
    const newPhone = phone !== undefined ? phone : current.phone;

    let newAddresses;
    if (addresses !== undefined) {
      newAddresses =
        addresses === null
          ? null
          : typeof addresses === 'string'
            ? addresses
            : JSON.stringify(addresses);
    } else {
      newAddresses = current.addresses; // unchanged (raw string from db)
    }

    updateUser.run(newName, newPhone, newAddresses, current.user_id);
    const updated = findById.get(current.user_id);

    return res.json({ user: publicUser(updated) });
  } catch (err) {
    if (err && err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Phone already in use' });
    }
    return next(err);
  }
}

module.exports = { register, login, logout, getProfile, updateProfile };
