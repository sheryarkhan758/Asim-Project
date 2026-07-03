const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'florafetch.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Open (and create if missing) the SQLite database file.
const db = new Database(DB_PATH);

// WAL improves read concurrency; foreign_keys must be enabled per-connection.
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// On first load, run the schema if the tables don't exist yet.
const initialized = db
  .prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'")
  .get();

if (!initialized) {
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  db.exec(schema);
}

// Lightweight forward-compatible migration: ensure tables added after the
// initial schema exist even on databases created before they were introduced.
// All statements are idempotent (CREATE TABLE IF NOT EXISTS).
db.exec(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    message_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    subject    TEXT,
    message    TEXT    NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    subscriber_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    UNIQUE NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

module.exports = db;
