const bcrypt = require('bcrypt');
const db = require('./database.js');

const SALT_ROUNDS = 12;

// Plain credentials for the two seeded accounts (printed at the end).
const ADMIN = { full_name: 'FloraFetch Admin', email: 'admin@florafetch.pk', phone: '03001234567', password: 'Admin@123' };
const CUSTOMER = { full_name: 'Ayesha Khan', email: 'customer@florafetch.pk', phone: '03007654321', password: 'Customer@123' };

const categories = [
  { name: 'Indoor', description: 'Houseplants that thrive indoors with low to medium light.' },
  { name: 'Outdoor', description: 'Hardy plants for gardens, balconies, and terraces.' },
  { name: 'Succulents', description: 'Drought-tolerant plants that store water in their leaves.' },
  { name: 'Flowering', description: 'Ornamental plants grown for their blooms.' },
  { name: 'Medicinal', description: 'Plants valued for their healing and herbal uses.' },
];

// 8 plants spread across the 5 categories. Prices in PKR.
const plants = [
  {
    category: 'Indoor', name: 'Peace Lily', botanical_name: 'Spathiphyllum wallisii',
    description: 'Elegant air-purifying plant with glossy leaves and white blooms.',
    price: 1200, size: 'medium', stock_qty: 25, sunlight_req: 'Low', watering_freq: 'Weekly',
    is_pet_friendly: 0, is_low_maint: 1, image_url: '/uploads/peace-lily.jpg',
  },
  {
    category: 'Indoor', name: 'ZZ Plant', botanical_name: 'Zamioculcas zamiifolia',
    description: 'Nearly indestructible glossy plant ideal for low-light corners.',
    price: 1500, size: 'medium', stock_qty: 30, sunlight_req: 'Low', watering_freq: 'Fortnightly',
    is_pet_friendly: 0, is_low_maint: 1, image_url: '/uploads/zz-plant.jpg',
  },
  {
    category: 'Outdoor', name: 'Bougainvillea', botanical_name: 'Bougainvillea glabra',
    description: 'Vibrant climbing shrub with papery magenta bracts, loves full sun.',
    price: 900, size: 'large', stock_qty: 18, sunlight_req: 'High', watering_freq: 'Weekly',
    is_pet_friendly: 1, is_low_maint: 1, image_url: '/uploads/bougainvillea.jpg',
  },
  {
    category: 'Outdoor', name: 'Hibiscus', botanical_name: 'Hibiscus rosa-sinensis',
    description: 'Showy tropical shrub with large red trumpet-shaped flowers.',
    price: 750, size: 'medium', stock_qty: 22, sunlight_req: 'High', watering_freq: 'Daily',
    is_pet_friendly: 1, is_low_maint: 0, image_url: '/uploads/hibiscus.jpg',
  },
  {
    category: 'Succulents', name: 'Echeveria', botanical_name: 'Echeveria elegans',
    description: 'Compact rosette succulent with pale blue-green leaves.',
    price: 450, size: 'small', stock_qty: 50, sunlight_req: 'High', watering_freq: 'Fortnightly',
    is_pet_friendly: 1, is_low_maint: 1, image_url: '/uploads/echeveria.jpg',
  },
  {
    category: 'Succulents', name: 'Jade Plant', botanical_name: 'Crassula ovata',
    description: 'Lucky money plant with thick woody stems and fleshy oval leaves.',
    price: 600, size: 'small', stock_qty: 40, sunlight_req: 'Medium', watering_freq: 'Fortnightly',
    is_pet_friendly: 0, is_low_maint: 1, image_url: '/uploads/jade-plant.jpg',
  },
  {
    category: 'Flowering', name: 'Damask Rose', botanical_name: 'Rosa damascena',
    description: 'Fragrant pink rose prized for its scent and ornamental blooms.',
    price: 1100, size: 'medium', stock_qty: 20, sunlight_req: 'High', watering_freq: 'Daily',
    is_pet_friendly: 1, is_low_maint: 0, image_url: '/uploads/damask-rose.jpg',
  },
  {
    category: 'Medicinal', name: 'Aloe Vera', botanical_name: 'Aloe barbadensis miller',
    description: 'Soothing medicinal succulent with healing gel-filled leaves.',
    price: 500, size: 'small', stock_qty: 60, sunlight_req: 'Medium', watering_freq: 'Fortnightly',
    is_pet_friendly: 0, is_low_maint: 1, image_url: '/uploads/aloe-vera.jpg',
  },
];

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

    // Plants
    for (const p of plants) {
      const { category, ...rest } = p;
      insertPlant.run({ ...rest, category_id: categoryId[category] });
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
