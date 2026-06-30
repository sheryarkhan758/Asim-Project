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

module.exports = db;
