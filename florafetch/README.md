# FloraFetch

FloraFetch is a full-stack online plant marketplace (React + Node/Express + SQLite) for browsing,
ordering, and tracking live plant deliveries, with an admin panel for inventory, orders, and reviews.

**Stack:** React 18 + Vite (frontend) · Node.js + Express (REST API) · SQLite via better-sqlite3 ·
JWT auth · bcrypt · Multer image uploads.

## Project structure

```
florafetch/
├── backend/            Node/Express REST API (base path /api/v1)
│   ├── routes/         auth, plants, categories, cart, orders, reviews, admin
│   ├── controllers/    business logic per resource
│   ├── middleware/     JWT auth (requireAuth/requireAdmin) + Multer upload
│   ├── db/             schema.sql, database.js (better-sqlite3), seed.js
│   └── uploads/        review/plant photos (served at /uploads)
└── frontend/           React 18 + Vite SPA (dev server proxies /api -> backend)
```

## Prerequisites

- Node.js 20+ (developed on Node 24)
- npm 10+

## Backend — run

```bash
cd backend
npm install                       # install dependencies
cp .env.example .env              # create local env (PORT=5000, JWT_SECRET, JWT_EXPIRES_IN=24h)
npm run seed                      # create/reset florafetch.db with sample data + accounts
npm run dev                       # start with nodemon (auto-reload)  ->  http://localhost:5000
# or: npm start                   # plain node, no auto-reload
```

Health check: `GET http://localhost:5000/api/v1/health` → `{ "status": "ok" }`

> `.env` and the SQLite `*.db` files are gitignored. On Windows, use `copy .env.example .env`.

## Frontend — run

```bash
cd frontend
npm install
npm run dev                       # Vite dev server -> http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend on port 5000 (see `frontend/vite.config.js`),
so start the backend first.

## Seed accounts

`npm run seed` (re)creates the database and prints these credentials:

| Role     | Email                      | Password       |
| -------- | -------------------------- | -------------- |
| Admin    | `admin@florafetch.pk`      | `Admin@123`    |
| Customer | `customer@florafetch.pk`   | `Customer@123` |

It also inserts 5 categories (Indoor, Outdoor, Succulents, Flowering, Medicinal) and 8 sample plants.

## API overview (base path `/api/v1`)

| Method | Endpoint                     | Auth   | Description                              |
| ------ | ---------------------------- | ------ | --------------------------------------- |
| POST   | `/auth/register`             | Public | Register a customer                     |
| POST   | `/auth/login`                | Public | Login → JWT (24h)                       |
| GET/PUT| `/auth/profile`              | JWT    | Get / update profile + addresses        |
| GET    | `/categories`                | Public | List categories                         |
| GET    | `/plants`                    | Public | List plants (filters: `category`, `low_maint`, `pet_friendly`, `min_price`, `max_price`) |
| GET    | `/plants/:id`                | Public | Plant detail                            |
| GET    | `/plants/category/:id`       | Public | Plants in a category                    |
| POST/PUT/DELETE | `/plants[/:id]`     | Admin  | Create / update / delete a plant        |
| GET/POST | `/cart`                    | JWT    | View / add to cart (re-add increments)  |
| DELETE | `/cart/:itemId`              | JWT    | Remove a cart item (owner only)         |
| POST   | `/orders`                    | JWT    | Checkout (COD; transactional)           |
| GET    | `/orders`, `/orders/:id`     | JWT    | List / track own orders                 |
| PUT    | `/orders/:id/status`         | Admin  | Advance status (Confirmed → Quality Check → In Transit → Delivered) |
| POST   | `/reviews`                   | JWT    | Post review (multipart, optional photo) |
| GET    | `/reviews/plant/:plantId`    | Public | Approved reviews for a plant            |
| GET    | `/admin/reviews`             | Admin  | Moderation queue (unapproved)           |
| PUT    | `/reviews/:id/approve`       | Admin  | Approve a review                        |
