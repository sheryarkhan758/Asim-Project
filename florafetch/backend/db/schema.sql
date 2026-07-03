-- FloraFetch database schema (SQLite)
-- 7 tables: users, categories, plants, cart_items, orders, order_items, reviews
-- Tables are created in dependency order so foreign keys resolve.

-- Table 1: users
CREATE TABLE IF NOT EXISTS users (
  user_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name   TEXT    NOT NULL,
  email       TEXT    UNIQUE NOT NULL,
  phone       TEXT    UNIQUE,
  password    TEXT    NOT NULL,
  role        TEXT    DEFAULT 'customer',
  addresses   TEXT,                                  -- JSON string of saved delivery addresses
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: categories
CREATE TABLE IF NOT EXISTS categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL UNIQUE,               -- Indoor, Outdoor, Succulents, Flowering, Medicinal
  description TEXT
);

-- Table 2: plants
CREATE TABLE IF NOT EXISTS plants (
  plant_id        INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id     INTEGER,
  name            TEXT    NOT NULL,
  botanical_name  TEXT,
  description     TEXT,
  price           REAL    NOT NULL,                  -- Price in PKR
  size            TEXT,                              -- small / medium / large
  stock_qty       INTEGER DEFAULT 0,
  sunlight_req    TEXT,                              -- Low / Medium / High
  watering_freq   TEXT,                              -- Daily / Weekly / Fortnightly
  is_pet_friendly INTEGER DEFAULT 0,                 -- 0 = No, 1 = Yes
  is_low_maint    INTEGER DEFAULT 0,                 -- low-maintenance flag
  image_url       TEXT,
  created_at      DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (category_id)
);

-- Table: cart_items (temporary cart records linked to user and plant)
CREATE TABLE IF NOT EXISTS cart_items (
  cart_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL,
  plant_id     INTEGER NOT NULL,
  quantity     INTEGER NOT NULL DEFAULT 1,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users (user_id),
  FOREIGN KEY (plant_id) REFERENCES plants (plant_id)
);

-- Table 3: orders
CREATE TABLE IF NOT EXISTS orders (
  order_id         INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id          INTEGER NOT NULL,
  delivery_address TEXT    NOT NULL,
  delivery_date    DATE,
  special_instr    TEXT,                             -- handling instructions for delicate plants
  total_amount     REAL    NOT NULL,                 -- total order amount in PKR
  payment_method   TEXT    DEFAULT 'COD',
  status           TEXT    DEFAULT 'Confirmed',      -- 4-stage tracking pipeline
  created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

-- Table: order_items (individual plants within each order)
CREATE TABLE IF NOT EXISTS order_items (
  item_id  INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  plant_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price    REAL    NOT NULL,                         -- unit price at time of purchase (PKR)
  FOREIGN KEY (order_id) REFERENCES orders (order_id),
  FOREIGN KEY (plant_id) REFERENCES plants (plant_id)
);

-- Table 4: reviews
CREATE TABLE IF NOT EXISTS reviews (
  review_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id     INTEGER NOT NULL,
  plant_id    INTEGER NOT NULL,
  order_id    INTEGER,
  rating      INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  photo_url   TEXT,
  is_approved INTEGER DEFAULT 0,                     -- admin moderation status
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)  REFERENCES users (user_id),
  FOREIGN KEY (plant_id) REFERENCES plants (plant_id),
  FOREIGN KEY (order_id) REFERENCES orders (order_id)
);

-- Table: contact_messages (submissions from the public Contact form)
CREATE TABLE IF NOT EXISTS contact_messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT    NOT NULL,
  email      TEXT    NOT NULL,
  subject    TEXT,
  message    TEXT    NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Table: newsletter_subscribers (email captures from the homepage CTA)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  subscriber_id INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT    UNIQUE NOT NULL,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on frequently filtered / joined columns
CREATE INDEX IF NOT EXISTS idx_plants_category_id  ON plants (category_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id  ON cart_items (user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id      ON orders (user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_plant_id    ON reviews (plant_id);
