<!--
================================================================================
FloraFetch — MASTER TECHNICAL REPORT (report.md)
================================================================================
PURPOSE
  Single technical source of truth for the FloraFetch platform (frontend +
  backend). Written to be expanded by an AI assistant (e.g. Claude Desktop)
  into a professional APA 7th-edition document.

HOW TO EXPAND THIS INTO APA 7 (instructions for the AI that reads this file)
  - Treat Section 0 (Front Matter) as the APA title-page data.
  - Treat Section 1 as the APA Abstract (+ keywords line).
  - Heading hierarchy maps to APA heading Levels 1–5:
      "# 1." heading      -> APA Level 1 (centered, bold, title case)
      "## 1.1" heading     -> APA Level 2 (flush left, bold)
      "### 1.1.1" heading   -> APA Level 3 (flush left, bold italic)
      "#### a)" heading      -> APA Level 4 (indented, bold, period)
  - Convert every "**Table N.**" block to an APA table (number, italic title,
    borderless, "*Note.*" beneath).
  - Convert every "**Figure N.**" + "[FIGURE: ...]" to an APA figure
    (number, italic title, image, "*Note.*" beneath).
  - Replace each "[CITATION: key]" marker with an APA in-text citation and add
    the matching entry to the References list (Section 15).
  - Preserve exact code identifiers, file paths and route strings verbatim.
================================================================================
-->

# FloraFetch: An Online Plant Marketplace with Cash-on-Delivery Fulfilment and an Integrated Admin Panel

---

## 0. Front Matter (APA Title-Page Data)

| Field | Value |
| --- | --- |
| **Project title** | FloraFetch: An Online Plant Marketplace with Cash-on-Delivery Fulfilment and an Integrated Admin Panel |
| **Document type** | Final Year Project (FYP) — Master Technical Report |
| **Author** | `[STUDENT FULL NAME]` |
| **Student ID** | `[STUDENT ID]` |
| **Degree program** | `[e.g., BS Computer Science]` |
| **Course** | CS519 — `[COURSE TITLE]`, Spring 2026 |
| **Supervisor** | `[SUPERVISOR NAME]` |
| **Institution** | `[UNIVERSITY / DEPARTMENT]` |
| **Submission date** | `[DD MONTH 2026]` |
| **Version** | 1.0 |

> **Note to author:** Replace every `[BRACKETED]` placeholder before final submission. These fields populate the APA 7 student title page (title, author, affiliation, course, instructor, due date).

---

## 1. Abstract

FloraFetch is a full-stack e-commerce web application that enables customers across Pakistan to browse, order, and track live plant deliveries, while giving administrators tools to manage inventory, orders, and customer reviews. The platform is implemented as a decoupled **client–server system**: a **React 18 single-page application (SPA)** built with Vite communicates over HTTP with a **Node.js/Express REST API** persisting data in an embedded **SQLite** database via `better-sqlite3`. Authentication uses stateless **JSON Web Tokens (JWT)** with **bcrypt**-hashed passwords, and role-based access control separates customer and administrator capabilities. The system implements a complete commerce workflow — registration, catalogue browsing with server-side filtering, a persistent shopping cart, an atomic Cash-on-Delivery (COD) checkout, a four-stage order-tracking pipeline, and a photo-enabled review system with administrator moderation. This report documents the platform's architecture, exact API surface, database schema, component structure, and business logic as a definitive technical reference.

**Keywords:** *e-commerce, React, Node.js, Express, SQLite, REST API, JWT authentication, single-page application, role-based access control, Cash on Delivery*

---

## 2. Table of Contents

0. Front Matter
1. Abstract
2. Table of Contents
3. Introduction
4. Technology Review
5. System Requirements
6. System Architecture
7. Backend Design and Implementation
8. Database Design
9. Frontend Design and Implementation
10. Feature Walkthroughs (Business Logic)
11. Security Design
12. Testing and Validation
13. Deployment and Execution
14. Limitations and Future Work
15. References
16. Appendices

---

# 3. Introduction

## 3.1 Background

Houseplant ownership has grown rapidly, yet buying plants online remains difficult: plants are perishable, delivery is risky, and customers lack care knowledge. In markets such as Pakistan, low card-payment penetration also makes Cash on Delivery (COD) the dominant fulfilment model. FloraFetch addresses these constraints with a purpose-built marketplace that pairs a curated plant catalogue with COD checkout, protective-delivery messaging, and per-plant care guidance.

## 3.2 Problem Statement

Existing general-purpose marketplaces do not model plant-specific attributes (sunlight, watering, pet-safety, maintenance level), do not provide care guidance, and assume online prepayment. There is a need for a domain-specific platform that (a) represents plant care metadata, (b) supports COD, (c) provides order tracking suited to living goods, and (d) gives operators an admin panel for inventory and review moderation.

## 3.3 Objectives

1. Design and implement a secure REST API for authentication, catalogue, cart, orders, and reviews.
2. Build a responsive React SPA consuming that API with client-side routing and global state.
3. Implement COD checkout as an atomic, stock-safe transaction.
4. Provide a four-stage order-tracking pipeline visible to customers and controllable by admins.
5. Deliver an administrator panel for inventory CRUD (with image upload), order-status management, and review moderation.

## 3.4 Scope

**In scope:** user registration/login, catalogue browsing and filtering, cart, COD checkout, order tracking, reviews with photo upload and moderation, profile/address management, and an admin panel. **Out of scope (Phase 1):** online/card payments, real-time courier integration, multi-warehouse inventory, and email/SMS delivery of notifications.

## 3.5 Significance

FloraFetch demonstrates a complete, production-shaped full-stack architecture — decoupled SPA + REST API, token auth, transactional integrity, role-based authorization, and file uploads — applied to a realistic domain, making it a strong reference implementation for a Final Year Project.

---

# 4. Technology Review

**Table 1.** *Core Technology Stack and Versions*

| Layer | Technology | Version | Role | Source |
| --- | --- | --- | --- | --- |
| Frontend UI | React | ^18.3.1 | Component-based SPA rendering | [CITATION: react] |
| Frontend routing | react-router-dom | ^6.30.4 | Client-side routing, route guards, lazy loading | [CITATION: reactrouter] |
| HTTP client | Axios | ^1.18.1 | Promise-based API calls, interceptors | [CITATION: axios] |
| Build tool | Vite | ^5.4.21 | Dev server, HMR, production bundling, code-splitting | [CITATION: vite] |
| Runtime | Node.js | 20+ | JavaScript server runtime | [CITATION: nodejs] |
| Web framework | Express | ^5.2.1 | HTTP routing and middleware | [CITATION: express] |
| Database | SQLite via better-sqlite3 | ^12.11.1 | Embedded relational store, synchronous API, transactions | [CITATION: bettersqlite] |
| Auth tokens | jsonwebtoken | ^9.0.3 | Stateless JWT signing/verification | [CITATION: jwt] |
| Password hashing | bcrypt | ^6.0.0 | Salted password hashing (12 rounds) | [CITATION: bcrypt] |
| File uploads | Multer | ^2.2.0 | multipart/form-data image handling | [CITATION: multer] |
| CORS | cors | ^2.8.6 | Cross-origin policy for the SPA origin | [CITATION: cors] |
| Config | dotenv | ^17.4.2 | Environment-variable loading | [CITATION: dotenv] |

*Note.* Frontend and backend are independent npm packages (`florafetch/frontend`, `florafetch/backend`).

## 4.1 Rationale

A **decoupled SPA + REST** design was chosen to separate presentation from business logic and to allow independent evolution of each tier. **better-sqlite3** was selected over an async driver because its synchronous, in-process API simplifies transactional code (e.g., the checkout transaction in §10.4) and requires no separate database server, which suits an FYP deployment. **JWT** provides stateless authentication that scales without server-side session storage, and **Vite** provides fast HMR in development and route-level code-splitting in production.

---

# 5. System Requirements

## 5.1 User Roles

**Table 2.** *Actor Roles and Capabilities*

| Role | Authentication | Capabilities |
| --- | --- | --- |
| Guest | None | Browse catalogue, view plant details and approved reviews, read content pages, register/login |
| Customer | JWT (`role = 'customer'`) | All guest actions + cart, checkout (COD), order tracking, profile/address management, submit reviews |
| Administrator | JWT (`role = 'admin'`) | All customer actions + inventory CRUD with image upload, view all orders, advance order status, moderate reviews |

## 5.2 Functional Requirements (FR)

- **FR-1 Authentication:** register, login (email or phone + password), logout, view/update profile.
- **FR-2 Catalogue:** list plants, filter by category, low-maintenance, pet-friendly, and price range; view plant detail.
- **FR-3 Cart:** add item (increments if present), change quantity, remove item; cart persists server-side per user.
- **FR-4 Checkout:** place a COD order from the cart as an atomic, stock-checked transaction.
- **FR-5 Orders:** list own orders; track a single order through four stages.
- **FR-6 Reviews:** submit a rating/text/photo review; view approved reviews per plant.
- **FR-7 Admin — Inventory:** create, update, delete plants; upload plant images.
- **FR-8 Admin — Orders:** view all orders; advance status.
- **FR-9 Admin — Reviews:** view moderation queue; approve reviews.
- **FR-10 Engagement:** newsletter subscription and contact-form submission.

## 5.3 Non-Functional Requirements (NFR)

- **NFR-1 Security:** hashed passwords, JWT-protected endpoints, parameterized SQL, role checks.
- **NFR-2 Integrity:** checkout is all-or-nothing; stock never goes negative.
- **NFR-3 Usability/Responsiveness:** mobile-responsive layouts, ≥44×44px touch targets.
- **NFR-4 Performance:** route-level code-splitting; indexed database columns.
- **NFR-5 Maintainability:** layered backend (routes → controllers → DB), single design-token source, catalogue data centralized.

---

# 6. System Architecture

## 6.1 High-Level Architecture

**Figure 1.** *FloraFetch Client–Server Architecture*

[FIGURE: A three-tier diagram — (1) Browser running the React SPA; (2) the SPA calls the Express REST API at base path `/api/v1`; (3) Express controllers read/write the SQLite database file `florafetch.db`. A static `/uploads` route serves plant/review images. In development, the Vite dev server (port 5173) proxies `/api` and `/uploads` to the Express server (port 5000).]

The system is composed of two independently deployable applications:

- **Client (Presentation tier):** React 18 SPA served by Vite. Owns routing, UI state, and rendering. Communicates only through the REST API.
- **Server (Application + Data tier):** Express REST API applying business logic in controllers and persisting to SQLite through prepared statements. Serves uploaded images as static files.

## 6.2 Request Flow (Development)

1. Browser loads the SPA from Vite (`http://localhost:5173`).
2. SPA issues an Axios request to a relative path (e.g., `/api/v1/plants`).
3. Vite's dev proxy forwards `/api/*` and `/uploads/*` to Express (`http://localhost:5000`).
4. Express routes the request to a controller, which queries SQLite and returns JSON.
5. The 401 response interceptor clears the session and redirects to `/login` when a token is rejected.

## 6.3 Repository Structure (Top Level)

```
project/
├── README.md
├── report.md                     ← this document
├── data/                         FYP brief + course material
└── florafetch/
    ├── backend/                  Node/Express REST API (base path /api/v1)
    └── frontend/                 React 18 + Vite SPA
```

## 6.4 Backend Folder Structure

```
florafetch/backend/
├── server.js                     App bootstrap, middleware, router mounts, error handler
├── .env                          PORT, JWT_SECRET, JWT_EXPIRES_IN  (gitignored)
├── package.json                  scripts: start | dev | seed
├── routes/                       Thin Express routers (URL → controller)
│   ├── auth.js          categories.js   plants.js      cart.js
│   ├── orders.js        reviews.js      admin.js
│   └── contact.js       newsletter.js
├── controllers/                  Business logic + prepared statements
│   ├── authController.js         cartController.js     categoryController.js
│   ├── orderController.js        plantController.js    reviewController.js
│   └── contactController.js      newsletterController.js
├── middleware/
│   ├── auth.js                   requireAuth, requireAdmin
│   └── upload.js                 Multer (image-only, 2 MB, UUID filenames)
├── db/
│   ├── database.js               better-sqlite3 connection + schema bootstrap
│   ├── schema.sql                9-table DDL + indexes
│   ├── catalog.js                4 categories + 40 plants (seed source of truth)
│   ├── seed.js                   Wipe + reseed categories/plants/users
│   └── florafetch.db             SQLite database file (gitignored)
└── uploads/                      Uploaded plant/review images (served at /uploads)
```

## 6.5 Frontend Folder Structure

```
florafetch/frontend/
├── index.html                    SPA host page (#root)
├── vite.config.js                Dev server + /api and /uploads proxy to :5000
├── package.json                  scripts: dev | build | preview
└── src/
    ├── main.jsx                  Root render: BrowserRouter → AuthProvider → CartProvider → App
    ├── App.jsx                   Route table + lazy loading + guards
    ├── index.css                 Global resets, touch targets, dropdowns, responsive helpers
    ├── api/                      Axios service layer (one module per resource)
    │   ├── client.js             Axios instance + JWT request/401 response interceptors
    │   ├── auth.js  plants.js  categories.js  cart.js  orders.js
    │   └── reviews.js  contact.js  newsletter.js
    ├── context/
    │   ├── AuthContext.jsx       user/token session state + auth actions
    │   └── CartContext.jsx       cart items/count/total + cart actions
    ├── routes/
    │   ├── ProtectedRoute.jsx    Requires authentication
    │   └── AdminRoute.jsx        Requires role = admin
    ├── pages/                    Route-level screens (storefront, content, auth)
    │   └── admin/                AdminDashboard, AdminPlants, AdminOrders, AdminReviews
    ├── components/               Reusable UI (product, cart, order, review, admin, home)
    │   ├── ui/                   Design-system primitives (Container, Button, etc.)
    │   └── home/                 Homepage sections (Hero strip, WhyUs, Stats, etc.)
    ├── styles/
    │   ├── theme.js              Design tokens (color, font, radius, shadow, gradient)
    │   └── animations.css        Keyframes + utility animation classes
    ├── hooks/
    │   ├── useReveal.js          IntersectionObserver reveal-on-scroll
    │   └── useCountUp.js         Animated numeric counters
    └── utils/
        ├── format.js             formatPKR(), formatDate()
        └── addresses.js          normalizeAddresses()
```

---

# 7. Backend Design and Implementation

## 7.1 Application Bootstrap and Middleware Pipeline

File: `florafetch/backend/server.js`. The middleware order is significant:

1. `cors({ origin: 'http://localhost:5173' })` — restricts cross-origin requests to the SPA origin.
2. `express.json()` and `express.urlencoded({ extended: true })` — body parsing for JSON and form posts.
3. `express.static('/uploads')` — serves uploaded images from disk.
4. `/api/v1` router mount — all resource routers (see §7.2).
5. **404 handler** — returns `{ error: "Not found: <METHOD> <URL>" }`.
6. **Central error handler** — maps `MulterError` → 400, uses `err.status`/`err.statusCode`, hides 500 internals, logs server errors.

The server listens on `process.env.PORT` (configured as `5000`).

## 7.2 Complete Route Inventory

All endpoints are mounted under the base path **`/api/v1`**. "Auth" column: *Public* = none; *JWT* = valid Bearer token; *Admin* = JWT with `role = 'admin'`.

**Table 3.** *REST API Endpoint Inventory*

| # | Method | Path (under `/api/v1`) | Auth | Controller.function | Purpose |
| --- | --- | --- | --- | --- | --- |
| 1 | GET | `/health` | Public | (inline) | Liveness check → `{ status: "ok" }` |
| 2 | POST | `/auth/register` | Public | authController.register | Register a customer → `{ user }` |
| 3 | POST | `/auth/login` | Public | authController.login | Login (email or phone + password) → `{ token, user }` |
| 4 | POST | `/auth/logout` | JWT | authController.logout | Stateless logout acknowledgement |
| 5 | GET | `/auth/profile` | JWT | authController.getProfile | Current user profile → `{ user }` |
| 6 | PUT | `/auth/profile` | JWT | authController.updateProfile | Update name/phone/addresses → `{ user }` |
| 7 | GET | `/categories` | Public | categoryController.getAllCategories | List categories → `{ count, categories }` |
| 8 | GET | `/plants` | Public | plantController.getAllPlants | List/filter plants → `{ count, plants }` |
| 9 | GET | `/plants/category/:id` | Public | plantController.getPlantsByCategory | Plants in a category |
| 10 | GET | `/plants/:id` | Public | plantController.getPlantById | Plant detail → `{ plant }` |
| 11 | POST | `/plants` | Admin | plantController.createPlant | Create plant (multipart `image`) → `{ plant }` |
| 12 | PUT | `/plants/:id` | Admin | plantController.updatePlant | Partial update (multipart `image`) → `{ plant }` |
| 13 | DELETE | `/plants/:id` | Admin | plantController.deletePlant | Delete plant → `{ message, plant_id }` |
| 14 | GET | `/cart` | JWT | cartController.getCart | View cart → `{ count, subtotal, items }` |
| 15 | POST | `/cart` | JWT | cartController.addToCart | Add/increment item → cart snapshot |
| 16 | DELETE | `/cart/:itemId` | JWT | cartController.removeFromCart | Remove owned item → cart snapshot |
| 17 | POST | `/orders` | JWT | orderController.createOrder | COD checkout (atomic) → `{ order }` |
| 18 | GET | `/orders` | JWT | orderController.getOrders | Own orders → `{ count, orders }` |
| 19 | GET | `/orders/:id` | JWT | orderController.getOrder | One order + items (owner or admin) → `{ order }` |
| 20 | PUT | `/orders/:id/status` | Admin | orderController.updateOrderStatus | Advance 4-stage status → `{ order }` |
| 21 | GET | `/admin/orders` | Admin | orderController.getAllOrders | All orders + customer → `{ count, orders }` |
| 22 | GET | `/admin/reviews` | Admin | reviewController.getModerationQueue | Unapproved reviews → `{ count, reviews }` |
| 23 | GET | `/reviews/plant/:plantId` | Public | reviewController.getPlantReviews | Approved reviews → `{ count, reviews }` |
| 24 | POST | `/reviews` | JWT | reviewController.createReview | Submit review (multipart `photo`) → `{ review }` |
| 25 | PUT | `/reviews/:id/approve` | Admin | reviewController.approveReview | Approve a review → `{ review }` |
| 26 | POST | `/contact` | Public | contactController.createMessage | Store contact message |
| 27 | POST | `/newsletter` | Public | newsletterController.subscribe | Subscribe an email |

*Note.* Query parameters for endpoint 8 (`/plants`): `category` (integer id), `low_maint` (0/1), `pet_friendly` (0/1), `min_price`, `max_price`. Valid order statuses for endpoint 20: `Confirmed`, `Quality Check`, `In Transit`, `Delivered`.

## 7.3 Controllers (Responsibilities)

**Table 4.** *Controller Responsibilities*

| Controller | Key responsibilities |
| --- | --- |
| authController | bcrypt hash/compare; JWT signing; profile read/update; addresses JSON parse; email/phone uniqueness (409 on conflict) |
| categoryController | Read-only listing of categories |
| plantController | Filtered listing (dynamic WHERE); detail; admin create/update/delete; image_url from uploaded file or string; boolean coercion (`toBool01`) |
| cartController | Per-user cart join with plant data; add-or-increment; ownership-scoped removal; subtotal computation |
| orderController | Atomic checkout transaction; own-orders list; single-order fetch (owner/admin); admin all-orders (customer join); status transition validation |
| reviewController | Create review (default unapproved); approved-per-plant listing; moderation queue; approve action |
| contactController | Persist contact-form messages |
| newsletterController | Persist unique subscriber emails |

## 7.4 Middleware

- **`requireAuth`** (`middleware/auth.js`): parses `Authorization: Bearer <token>`, verifies via `jwt.verify` with `JWT_SECRET`, loads the fresh user record (no password column) onto `req.user`; returns 401 on missing/invalid/expired token or deleted user.
- **`requireAdmin`**: runs after `requireAuth`; returns 403 unless `req.user.role === 'admin'`.
- **`upload`** (`middleware/upload.js`): Multer disk storage; **image mimetypes only**; **2 MB** size limit; UUID filenames preserving extension; destination `uploads/`. Wrapped per-route so upload errors return clean 400 JSON.

---

# 8. Database Design

## 8.1 Overview

The database is a single SQLite file (`db/florafetch.db`) created from `db/schema.sql` on first connection (`db/database.js`) with **foreign keys enabled** and **WAL journaling**. It contains **nine tables** and four indexes.

## 8.2 Entity–Relationship Model

**Figure 2.** *FloraFetch Entity–Relationship Diagram*

[FIGURE: An ERD showing: `users` (1)→(N) `cart_items`, `orders`, `reviews`; `categories` (1)→(N) `plants`; `plants` (1)→(N) `cart_items`, `order_items`, `reviews`; `orders` (1)→(N) `order_items` and (1)→(N) `reviews` (optional). Standalone tables: `contact_messages`, `newsletter_subscribers`.]

## 8.3 Table Definitions

**Table 5.** *Database Tables and Key Columns*

| Table | Primary key | Notable columns | Foreign keys |
| --- | --- | --- | --- |
| users | user_id | full_name, email (UNIQUE), phone (UNIQUE), password (bcrypt), role (default `customer`), addresses (JSON), created_at | — |
| categories | category_id | name (UNIQUE), description | — |
| plants | plant_id | name, botanical_name, description, price (PKR), size, stock_qty, sunlight_req, watering_freq, is_pet_friendly, is_low_maint, image_url | category_id → categories |
| cart_items | cart_item_id | quantity, created_at | user_id → users; plant_id → plants |
| orders | order_id | delivery_address, delivery_date, special_instr, total_amount, payment_method (default `COD`), status (default `Confirmed`) | user_id → users |
| order_items | item_id | quantity, price (unit price at purchase) | order_id → orders; plant_id → plants |
| reviews | review_id | rating (CHECK 1–5), review_text, photo_url, is_approved (default 0) | user_id, plant_id, order_id |
| contact_messages | message_id | name, email, subject, message, created_at | — |
| newsletter_subscribers | subscriber_id | email (UNIQUE), created_at | — |

*Note.* Indexes: `idx_plants_category_id`, `idx_cart_items_user_id`, `idx_orders_user_id`, `idx_reviews_plant_id`. Booleans are stored as `INTEGER` (0/1). The complete DDL is reproduced in Appendix B.

## 8.4 Seed Data

`db/catalog.js` is the single source of truth for seed content: **4 categories** (Indoor Plants, Outdoor Plants, Air Purifying Plants, Medicinal Plants) and **40 plants** (10 per category), each with botanical name, PKR price, care attributes, and an image slug mapping to `/uploads/<slug>.jpg`. `db/seed.js` wipes all tables and re-inserts categories, plants, and two accounts (see §13.3).

---

# 9. Frontend Design and Implementation

## 9.1 Application Shell

`src/main.jsx` composes the provider tree: `BrowserRouter → AuthProvider → CartProvider → App`. `CartProvider` is nested inside `AuthProvider` so cart state can react to authentication changes. `App.jsx` defines the route table; a shared `Layout` renders the global `Navbar` and `Footer` and wraps page content in a `Suspense` boundary (with `RouteTransition`) so lazy chunks stream in without unmounting the chrome.

## 9.2 Routing Map

**Table 6.** *Frontend Route Table*

| Path | Component | Access | Loading |
| --- | --- | --- | --- |
| `/` | Home | Public | Eager |
| `/login` | Login | Public | Eager |
| `/register` | Register | Public | Eager |
| `/shop` | Shop | Public | Lazy |
| `/plant/:id` | PlantDetail | Public | Lazy |
| `/cart` | Cart | Public | Lazy |
| `/about` | About | Public | Lazy |
| `/care-guides` | CareGuides | Public | Lazy |
| `/contact` | Contact | Public | Lazy |
| `/faq` | FAQ | Public | Lazy |
| `/checkout` | Checkout | ProtectedRoute (JWT) | Lazy |
| `/orders/:id` | OrderTracking | ProtectedRoute (JWT) | Lazy |
| `/profile` | Profile | ProtectedRoute (JWT) | Lazy |
| `/admin` | AdminDashboard | AdminRoute (admin) | Lazy |
| `/admin/plants` | AdminPlants | AdminRoute (admin) | Lazy |
| `/admin/orders` | AdminOrders | AdminRoute (admin) | Lazy |
| `/admin/reviews` | AdminReviews | AdminRoute (admin) | Lazy |
| `*` | NotFound | Public | Eager |

*Note.* `ProtectedRoute` redirects unauthenticated users to `/login` (remembering the target); `AdminRoute` redirects non-admins to `/`. Both wait out the initial token-validation to avoid bouncing a logged-in user on refresh.

## 9.3 Global State — Contexts

**Table 7.** *React Context Providers*

| Context | State | Actions |
| --- | --- | --- |
| AuthContext | user, token, loading, isAuthenticated, isAdmin | login(), register(), logout(), loadProfile(), updateProfile(), setUser() |
| CartContext | items, count, total, loading | addToCart(), removeFromCart(), updateQuantity(), refreshCart() |

- **AuthContext** persists `token` and `user` to `localStorage`, validates the token on startup via `loadProfile()`, and exposes `isAdmin`. Because the backend `register` returns no token, `register()` chains a `login()` for a smooth sign-up flow.
- **CartContext** derives `count` (sum of quantities) and `total` (subtotal) from server snapshots, auto-refreshes on auth change, and implements `updateQuantity()` around the backend's add/remove primitives (increments up; delete-then-re-add down).

## 9.4 API Service Layer

`src/api/client.js` creates a single Axios instance with `baseURL: '/api/v1'` and two interceptors:

- **Request interceptor:** attaches `Authorization: Bearer <token>` from `localStorage`.
- **Response interceptor:** on HTTP 401 (excluding login/register calls), clears the session and redirects to `/login`.

Each resource has a dedicated module (`auth.js`, `plants.js`, `categories.js`, `cart.js`, `orders.js`, `reviews.js`, `contact.js`, `newsletter.js`) exposing one function per backend endpoint and returning parsed response bodies.

## 9.5 Component Catalog (Selected)

**Table 8.** *Representative Components by Domain*

| Domain | Components |
| --- | --- |
| Layout/chrome | Layout, Navbar, Footer, Loading, RouteTransition, Modal |
| Design-system (`ui/`) | Container, Button, SectionHeading, PageHeader, FeatureCard, StatCounter, Testimonial, Accordion |
| Home (`home/`) | HeroBanner, FeatureStrip, FeaturedPlants, WhyUs, StatsBand, Testimonials, CategoryGrid, NewsletterCTA |
| Catalogue | ProductGrid, ProductCard, FilterSidebar, PaginationBar, CategoryGrid |
| Plant detail | PlantGallery, CareGuide, AddToCartBtn, RelatedItems, ReviewList, ReviewForm, StarRating |
| Cart/checkout | CartTable, CartItem, OrderSummary, AddressSelector, DeliveryDatePicker, OrderReview, PlaceOrderBtn |
| Orders | OrderStatusStepper, OrderItemList, DeliveryInfo, PurchaseHistory |
| Profile | ProfileForm, AddressManager |
| Admin | AdminLayout, SalesStats, LowStockAlert, RecentOrders, PlantTable, PlantFormModal, DeleteConfirm, OrderTable, OrderRow, StatusDropdown, ReviewQueue, ApproveBtn |

## 9.6 Design System

`src/styles/theme.js` centralizes design tokens (color, typography, radius, shadow, gradients) consumed inline across components. `src/index.css` provides global resets, a display-font rule for headings, ≥44px touch-target sizing, custom-styled `<select>` dropdowns (custom chevron + focus ring), and responsive split-layout utilities. `src/styles/animations.css` supplies keyframes and utility classes (reveal-on-scroll, float, gradient, lift) used for micro-interactions.

---

# 10. Feature Walkthroughs (Business Logic)

## 10.1 Registration and Authentication

1. Client posts `full_name, email, phone?, password` to `POST /auth/register`.
2. Server rejects duplicate email/phone (409); otherwise bcrypt-hashes the password (12 rounds) and inserts the user with `role = 'customer'`, returning the public user.
3. `AuthContext.register()` immediately calls `login()`; `POST /auth/login` verifies credentials and returns a signed JWT `{ user_id, role }` (expiry `JWT_EXPIRES_IN`, default 24h).
4. The token and user persist to `localStorage`; the request interceptor attaches the token to all subsequent calls.

## 10.2 Catalogue Browsing and Filtering

The Shop page reads filter state from the URL query string (`useSearchParams`), so filters are shareable and bookmarkable. Filters map to `GET /plants` query parameters; the controller builds a dynamic parameterized `WHERE` clause. Pagination is client-side.

## 10.3 Cart Management

`POST /cart` adds a plant and **increments** quantity if the line already exists. `updateQuantity()` in `CartContext` synthesizes an absolute set operation: increases post the delta; decreases delete the line and re-add at the new quantity; zero removes it. Every mutation returns the full cart snapshot, keeping the navbar badge and totals consistent.

## 10.4 Checkout (Cash on Delivery) — Atomic Transaction

**Figure 3.** *COD Checkout Transaction Sequence*

[FIGURE: Sequence — Client posts delivery details to `POST /orders`; server opens a `better-sqlite3` transaction; reads the user's cart; validates stock for every line; computes total; inserts `orders` (status `Confirmed`, payment `COD`); inserts `order_items` at purchase-time prices; decrements `plants.stock_qty`; clears the cart; commits. Any failure rolls back the entire transaction.]

Key properties: the entire checkout is wrapped in `db.transaction(...)`, so it is **all-or-nothing**. Stock is validated inside the transaction (409 on insufficient stock), preventing oversell. Prices are captured per line item so historical orders remain accurate if catalogue prices change later.

## 10.5 Order Tracking (Four-Stage Pipeline)

Orders progress through **Confirmed → Quality Check → In Transit → Delivered**. Customers view progress via `OrderStatusStepper` on `/orders/:id` (fetched from `GET /orders/:id`, authorized for owner or admin). Admins advance status via `PUT /orders/:id/status`, which validates the target against the allowed set.

## 10.6 Reviews and Moderation

Authenticated users submit a rating (1–5), optional text, and optional photo to `POST /reviews` (multipart). New reviews default to `is_approved = 0` and are therefore invisible on the storefront. Admins see the queue via `GET /admin/reviews` and publish a review with `PUT /reviews/:id/approve`; only approved reviews appear via `GET /reviews/plant/:plantId`.

## 10.7 Administrator Panel

- **Inventory:** `AdminPlants` performs full CRUD. Create/update submit `FormData` (multipart) so an image file uploads with the plant; the table refreshes after each change.
- **Orders:** `AdminOrders` lists all orders (with customer) and provides an inline `StatusDropdown` per row plus an expandable detail (items + delivery info).
- **Reviews:** `AdminReviews` renders the moderation queue; approving a review removes it from the queue and publishes it.

---

# 11. Security Design

**Table 9.** *Security Controls*

| Control | Implementation |
| --- | --- |
| Password storage | bcrypt hashing, 12 salt rounds; hash never returned by any read query |
| Authentication | Stateless JWT (`Authorization: Bearer`); verified per request; fresh user loaded onto `req.user` |
| Authorization (RBAC) | `requireAuth` + `requireAdmin`; admin endpoints reject non-admins (403) |
| SQL injection defense | Exclusively parameterized/prepared statements (`better-sqlite3`) |
| Resource ownership | Cart and order operations are scoped to `req.user`; cross-user access returns 404 (no existence leak) |
| Input validation | Server-side field/type checks; client-side real-time form validation |
| Upload safety | Image mimetypes only; 2 MB cap; UUID filenames |
| CORS | Restricted to the SPA origin |
| Session hygiene (client) | 401 interceptor clears token and redirects to login |

*Note.* For production, `JWT_SECRET` must be replaced with a strong secret and served over HTTPS.

---

# 12. Testing and Validation

The end-to-end workflow was validated by exercising the API in sequence, mirroring the user journey.

**Table 10.** *End-to-End Validation Click-Path*

| Step | Action | Endpoint | Expected result |
| --- | --- | --- | --- |
| 1 | Register + auto-login | POST /auth/register, POST /auth/login | JWT issued |
| 2 | Browse + filter | GET /plants, GET /plants?low_maint=1&max_price=… | Filtered subset |
| 3 | Add to cart | POST /cart | Cart snapshot with subtotal |
| 4 | Checkout (COD) | POST /orders | Order created, status `Confirmed`, cart emptied |
| 5 | Track order | GET /orders/:id | Stepper at `Confirmed` |
| 6 | Submit review | POST /reviews | Review created, `is_approved = 0` |
| 7 | Admin login | POST /auth/login | Admin JWT |
| 8 | View all orders | GET /admin/orders | Store-wide list |
| 9 | Advance status | PUT /orders/:id/status | Status → `In Transit` |
| 10 | Moderate review | GET /admin/reviews, PUT /reviews/:id/approve | Review published |
| 11 | Authorization guard | GET /admin/orders as customer | HTTP 403 |

*Note.* All steps passed against the running stack, including the negative authorization test (Step 11).

---

# 13. Deployment and Execution

## 13.1 Prerequisites

Node.js 20+ and npm 10+.

## 13.2 Backend

```bash
cd florafetch/backend
npm install
# create .env with: PORT=5000, JWT_SECRET=<secret>, JWT_EXPIRES_IN=24h
npm run seed          # create/reset florafetch.db with categories, plants, accounts
npm run dev           # start API on http://localhost:5000/api/v1
```

## 13.3 Frontend

```bash
cd florafetch/frontend
npm install
npm run dev           # Vite dev server on http://localhost:5173 (proxies /api and /uploads)
```

## 13.4 Seed Accounts

**Table 11.** *Seeded Login Credentials*

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@florafetch.pk | Admin@123 |
| Customer | customer@florafetch.pk | Customer@123 |

## 13.5 Environment Variables

**Table 12.** *Backend Environment Configuration (`.env`)*

| Variable | Example | Purpose |
| --- | --- | --- |
| PORT | 5000 | API listen port (must match Vite proxy target) |
| JWT_SECRET | `<random string>` | Secret for signing/verifying JWTs |
| JWT_EXPIRES_IN | 24h | Token lifetime |

---

# 14. Limitations and Future Work

- **Payments:** Only COD is supported; online/card payment is future work.
- **Notifications:** Order/status changes are not emailed or texted; only in-app.
- **Newsletter/contact:** Submissions are stored but not yet surfaced in an admin view.
- **Database:** SQLite suits single-node deployment; a client–server RDBMS (e.g., PostgreSQL) would be required for horizontal scaling.
- **Testing:** Validation is manual/scripted; automated unit and integration test suites are future work.
- **Media:** Plant imagery is sourced from open repositories; production would use owned photography and a CDN.

---

# 15. References

> **Formatting note for the expanding AI:** render each entry as an APA 7 reference with a hanging indent, and match the `[CITATION: key]` markers in the text. Replace access dates/versions as needed; these are software documentation references.

- **[axios]** Axios. (2024). *Axios documentation*. https://axios-http.com/docs/intro
- **[bcrypt]** Kelektiv. (2024). *bcrypt (Node.js library)* [Computer software]. npm. https://www.npmjs.com/package/bcrypt
- **[bettersqlite]** WiseLibs. (2024). *better-sqlite3* [Computer software]. npm. https://www.npmjs.com/package/better-sqlite3
- **[cors]** Expressjs. (2024). *cors middleware* [Computer software]. npm. https://www.npmjs.com/package/cors
- **[dotenv]** Motdotla. (2024). *dotenv* [Computer software]. npm. https://www.npmjs.com/package/dotenv
- **[express]** OpenJS Foundation. (2024). *Express — Node.js web application framework*. https://expressjs.com/
- **[jwt]** Auth0. (2024). *jsonwebtoken* [Computer software]. npm. https://www.npmjs.com/package/jsonwebtoken
- **[multer]** Expressjs. (2024). *Multer* [Computer software]. npm. https://www.npmjs.com/package/multer
- **[nodejs]** OpenJS Foundation. (2024). *Node.js documentation*. https://nodejs.org/en/docs
- **[react]** Meta. (2024). *React documentation*. https://react.dev/
- **[reactrouter]** Remix Software. (2024). *React Router documentation*. https://reactrouter.com/
- **[vite]** Vite. (2024). *Vite documentation*. https://vitejs.dev/

`[ADD: any FYP-specific academic sources — e.g., textbooks, papers on e-commerce or web architecture your supervisor requires.]`

---

# 16. Appendices

## Appendix A — Complete Route Table
See **Table 3** (§7.2). All routes share base path `/api/v1`.

## Appendix B — Database Schema (DDL)
Reproduce the full contents of `florafetch/backend/db/schema.sql` here (nine `CREATE TABLE` statements plus four indexes). Summarized in **Table 5** (§8.3).

## Appendix C — Frontend Component Tree
See §6.5 (folder structure) and **Table 8** (§9.5).

## Appendix D — Environment Configuration
See **Table 12** (§13.5).

## Appendix E — Figures and Screenshots
Insert captured screenshots of: (E1) Home page; (E2) Shop with filters; (E3) Plant detail; (E4) Cart; (E5) Checkout (COD); (E6) Order tracking stepper; (E7) Admin dashboard; (E8) Admin inventory with add/edit modal; (E9) Admin orders; (E10) Admin review moderation. Number each as **Figure N** with an italic title and a `*Note.*` line.

---

*End of `report.md` — FloraFetch Master Technical Report (v1.0).*
