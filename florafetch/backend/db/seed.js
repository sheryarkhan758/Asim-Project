const bcrypt = require('bcrypt');
const db = require('./database.js');
const { categories, plants } = require('./catalog.js');

const SALT_ROUNDS = 12;

// Plain credentials for the two seeded accounts (printed at the end).
const ADMIN = { full_name: 'FloraFetch Admin', email: 'admin@florafetch.pk', phone: '03001234567', password: 'Admin@123' };
const CUSTOMER = { full_name: 'Ayesha Khan', email: 'customer@florafetch.pk', phone: '03007654321', password: 'Customer@123' };

function seed() {
  // --- Wipe everything (children first to respect foreign keys) ---
  db.exec(`
    DELETE FROM reviews;
    DELETE FROM order_items;
    DELETE FROM cart_items;
    DELETE FROM orders;
    DELETE FROM plants;
    DELETE FROM categories;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);

  const insertCategory = db.prepare('INSERT INTO categories (name, description) VALUES (@name, @description)');
  const insertPlant = db.prepare(`
    INSERT INTO plants
      (category_id, name, botanical_name, description, price, size, stock_qty,
       sunlight_req, watering_freq, is_pet_friendly, is_low_maint, image_url)
    VALUES
      (@category_id, @name, @botanical_name, @description, @price, @size, @stock_qty,
       @sunlight_req, @watering_freq, @is_pet_friendly, @is_low_maint, @image_url)
  `);
  const insertUser = db.prepare(`
    INSERT INTO users (full_name, email, phone, password, role)
    VALUES (@full_name, @email, @phone, @password, @role)
  `);

  const run = db.transaction(() => {
    // Categories -> map name to generated id
    const categoryId = {};
    for (const c of categories) {
      const info = insertCategory.run(c);
      categoryId[c.name] = info.lastInsertRowid;
    }

    // Plants, image_url is derived from the slug; slug/imageQuery are not stored.
    for (const p of plants) {
      const { category, slug, imageQuery, ...rest } = p;
      insertPlant.run({
        ...rest,
        image_url: `/uploads/${slug}.jpg`,
        category_id: categoryId[category],
      });
    }

    // Users (bcrypt-hashed passwords, 12 rounds)
    insertUser.run({
      full_name: ADMIN.full_name, email: ADMIN.email, phone: ADMIN.phone,
      password: bcrypt.hashSync(ADMIN.password, SALT_ROUNDS), role: 'admin',
    });
    insertUser.run({
      full_name: CUSTOMER.full_name, email: CUSTOMER.email, phone: CUSTOMER.phone,
      password: bcrypt.hashSync(CUSTOMER.password, SALT_ROUNDS), role: 'customer',
    });
  });

  run();

  const counts = {
    categories: db.prepare('SELECT COUNT(*) AS n FROM categories').get().n,
    plants: db.prepare('SELECT COUNT(*) AS n FROM plants').get().n,
    users: db.prepare('SELECT COUNT(*) AS n FROM users').get().n,
  };

  console.log('\n✅ Database seeded successfully.');
  console.log(`   Categories: ${counts.categories}  |  Plants: ${counts.plants}  |  Users: ${counts.users}`);
  console.log('\n──────────────── Login Credentials ────────────────');
  console.log(`  Admin    →  email: ${ADMIN.email}     password: ${ADMIN.password}`);
  console.log(`  Customer →  email: ${CUSTOMER.email}  password: ${CUSTOMER.password}`);
  console.log('────────────────────────────────────────────────────\n');
}

seed();
