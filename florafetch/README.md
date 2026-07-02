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
# npm run build                   # production build (code-split per route)
# npm run preview                 # preview the production build
```

The Vite dev server proxies `/api/*` **and** `/uploads/*` to the backend on port 5000
(see `frontend/vite.config.js`), so start the backend first. Then open http://localhost:5173.

**Frontend features:** JWT auth (persisted in `localStorage`, auto-logout on 401), Auth/Cart
React Contexts, React Router v6 with `ProtectedRoute`/`AdminRoute` guards, mobile-responsive
layouts (CSS media queries + ≥44px touch targets), and route-level code splitting via
`React.lazy` (heavier storefront routes and the whole admin panel load on demand).

## Log in

| Role     | Email                    | Password       | Where it goes                                  |
| -------- | ------------------------ | -------------- | ---------------------------------------------- |
| Admin    | `admin@florafetch.pk`    | `Admin@123`    | Admin panel at `/admin` (Dashboard/Inventory/Orders/Reviews) |
| Customer | `customer@florafetch.pk` | `Customer@123` | Storefront (shop, cart, checkout, order tracking, profile) |

The **Admin** link appears in the navbar only when logged in as an admin.

## Verified end-to-end flow (click-path)

The following path was smoke-tested against the running app and API:

1. **Register** — `/register` → fill name/email/password → auto-logged in, redirected home.
2. **Browse & filter** — `/shop` → toggle *Low Maintenance*, set a max price → filters appear in the URL and the grid updates (paginated).
3. **Add to cart** — open a plant at `/plant/:id`, pick a quantity → **Add to cart** (navbar count updates).
4. **Checkout (COD)** — `/cart` → **Proceed to checkout** → enter a delivery address (+ optional date/instructions) → **Place order** → confirmation with the order id.
5. **Track order** — follow **Track your order** to `/orders/:id` → the 4-stage stepper shows *Confirmed*.
6. *(to exercise moderation)* on the plant page, **Write a review** (rating + text + optional photo) → "pending approval".
7. **Log in as admin** — log out, log in with the admin account → **Admin** appears in the navbar.
8. **Advance status** — `/admin/orders` → change the order's status dropdown (e.g. *In Transit*) → row updates.
9. **Moderate a review** — `/admin/reviews` → **Approve** the pending review → it leaves the queue and becomes visible on the plant page.

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
| GET    | `/admin/orders`              | Admin  | Store-wide orders list (with customer)  |
| POST   | `/reviews`                   | JWT    | Post review (multipart or JSON, optional photo) |
| GET    | `/reviews/plant/:plantId`    | Public | Approved reviews for a plant            |
| GET    | `/admin/reviews`             | Admin  | Moderation queue (unapproved)           |
| PUT    | `/reviews/:id/approve`       | Admin  | Approve a review                        |

> Plant create/update (`POST`/`PUT /plants`) accept an optional multipart `image` file
> (stored under `/uploads`) or an `image_url` string.
