# Boutik — Full Stack E-Commerce Website (MERN)

A complete e-commerce web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), developed following **Clean Code** principles and deployed to production with **MongoDB Atlas**, **Render**, and **Vercel**.

**Live demo:** `https://YOUR-APP.vercel.app`
**API health check:** `https://YOUR-SERVICE.onrender.com/api/health`

---

## Features

- **Product catalog** — paginated listing, full-text search, filtering by category and price range
- **Product details** — description, stock availability, customer reviews with 1–5 star ratings
- **Authentication** — registration, login, persistent session (JWT), `customer` / `admin` roles
- **Shopping cart** — add items, update quantities, remove items, local persistence
- **Checkout** — shipping address form, payment method selection, stock verification, automatic stock decrement
- **Order history** — "My orders" page with order statuses (pending, paid, shipped, delivered, cancelled)
- **Admin API** — product CRUD endpoints restricted to the admin role

## Tech Stack

| Layer | Technology |
|---|---|
| Database | MongoDB Atlas (free M0 cluster) |
| Backend | Node.js, Express.js, Mongoose, JWT, bcryptjs |
| Frontend | React 18, Vite, React Router, Axios, Context API |
| Testing | Node.js built-in test runner (`node --test`) |
| Hosting | Render (API) + Vercel (frontend) |

## Project Structure

```
ecommerce-mern/
├── backend/                 # REST API (Node.js / Express)
│   ├── config/db.js         # MongoDB connection
│   ├── models/              # Mongoose schemas (User, Product, Order)
│   ├── controllers/         # Business logic
│   ├── routes/              # Endpoint definitions
│   ├── middleware/          # JWT auth, centralized error handling
│   ├── utils/               # Pure, testable functions
│   ├── tests/               # Unit tests
│   └── seed/seeder.js       # Demo data (8 products + admin account)
└── frontend/                # React app (Vite)
    ├── vercel.json          # Rewrites /api/* to the Render backend + SPA fallback
    └── src/
        ├── api/             # Axios client + JWT interceptor
        ├── context/         # AuthContext, CartContext
        ├── components/      # Reusable components
        ├── pages/           # Catalog, product, cart, checkout, auth, orders
        └── styles/          # Global CSS (design tokens, responsive)
```

## API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Log in (returns a JWT) |
| GET | `/api/auth/me` | Authenticated | Current user profile |
| GET | `/api/products` | Public | List products (search, filters, pagination) |
| GET | `/api/products/:id` | Public | Product details |
| POST / PUT / DELETE | `/api/products` | Admin | Product CRUD |
| POST | `/api/products/:id/reviews` | Authenticated | Add a review |
| POST | `/api/orders` | Authenticated | Create an order |
| GET | `/api/orders/mine` | Authenticated | Current user's orders |
| PUT | `/api/orders/:id/pay` | Authenticated | Mark order as paid |
| GET | `/api/health` | Public | Health check |

---

## Step 1 — Database Setup (MongoDB Atlas)

A single Atlas cluster is used for both development and production — no local MongoDB installation required.

1. Created a free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and deployed a **free M0 cluster**.
2. **Database Access** — created a database user with a simple alphanumeric password (special characters would need URL-encoding in the connection string).
3. **Network Access** — added the rule **`0.0.0.0/0` (Allow access from anywhere)**. This is required because Render's servers use dynamic IP addresses. Access remains protected by the database username and password.
4. Retrieved the connection string via **Connect → Drivers → Node.js** and adapted it:
   - replaced `<db_password>` with the database user's password;
   - inserted the database name **`/ecommerce`** right before the `?`.

Final connection string format:

```
mongodb+srv://USER:PASSWORD@cluster.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

> **Note:** if the database name is omitted, Mongoose writes to a default database called `test`. Data can be verified at any time in Atlas via **Browse Collections**.

## Step 2 — Local Development

### Backend

```bash
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI and JWT_SECRET
npm run seed              # 8 demo products + admin account
npm run dev               # API on http://localhost:5000
```

Seeded admin account: `admin@shop.local` / `admin123`.

### Frontend

```bash
cd frontend
npm install
npm run dev               # App on http://localhost:5173
```

In development, the Vite proxy forwards `/api` requests to the backend on port 5000.

### Tests

```bash
cd backend
npm test
```

## Step 3 — Source Control (GitHub)

```bash
git init
git add .
git commit -m "feat: full MERN e-commerce website"
git branch -M main
git remote add origin https://github.com/USERNAME/ecommerce-mern.git
git push -u origin main
```

The `.env` file is excluded by `.gitignore` and must **never** be committed — it contains the Atlas credentials and the JWT secret.

## Step 4 — Backend Deployment (Render)

1. On [render.com](https://render.com), created a **Web Service** connected to the GitHub repository.
2. Configuration:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
3. Environment variables:
   - `MONGO_URI` — the full Atlas connection string (with `/ecommerce`)
   - `JWT_SECRET` — a long random string
   - `CLIENT_URL` — the Vercel production URL (allowed CORS origin)
4. Verified the deployment: the logs show the MongoDB connection message, and `GET /api/health` returns `{"status":"ok"}`.

> **Troubleshooting encountered:** the first deploy failed with *"Could not connect to any servers in your MongoDB Atlas cluster… IP that isn't whitelisted"*. Fix: add the `0.0.0.0/0` rule in Atlas **Network Access** (found inside the *project*, under Security — not at the organization level), then trigger **Manual Deploy → Deploy latest commit** on Render.

## Step 5 — Frontend Deployment (Vercel)

1. Added `frontend/vercel.json` with two rewrite rules:

```json
{
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://YOUR-SERVICE.onrender.com/api/:path*" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

   - the first rule proxies all `/api/*` calls to the Render backend (replacing the Vite dev proxy);
   - the second is the SPA fallback so React Router routes survive a page refresh.

2. On [vercel.com](https://vercel.com), imported the GitHub repository with **Root Directory set to `frontend`** (Vite is auto-detected).
3. Updated `CLIENT_URL` on Render with the final Vercel production URL.

> **Troubleshooting encountered:** `/api/products` and `/api/auth/register` initially returned **404** from Vercel. Cause: the rewrite rule was not applied — `vercel.json` must live inside `frontend/`, be pushed to GitHub, and contain the real Render URL. Every push to `main` triggers an automatic Vercel redeploy.

## Production Architecture

```
Browser
   │
   ▼
Vercel (React static build)
   │   /api/* rewritten to ──►  Render (Express API)
   │                                │
   ▼                                ▼
React Router (SPA)            MongoDB Atlas (ecommerce db)
```

**Note on the free tiers:** the Render free instance spins down after ~15 minutes of inactivity; the first request after idling may take 30–50 seconds. This is expected behavior.

## Clean Code Practices Applied

- **Meaningful names** — `calculateOrderTotal`, `verifyStockAndBuildItems`, `restoreSession`; no ambiguous `d`, `temp`, `data`
- **Single responsibility** — thin controllers; pricing logic isolated in `utils/pricing.js`; stock validation separated from order creation
- **Explicit error handling** — centralized error middleware, clear client-side messages, no silent failures
- **Pure functions** — `calculateOrderTotal`, `formatPrice`, `buildProductFilters`: deterministic and side-effect free
- **Modern JavaScript** — ES modules, `async/await`, destructuring, arrow functions, `filter`/`map`/`reduce`
- **Unit tests** — pure functions covered with the built-in Node test runner
- **Dependency awareness** — the DB connection receives its URI as a parameter; the HTTP client is centralized with a JWT interceptor

## Environment Variables Reference

| Variable | Where | Description |
|---|---|---|
| `MONGO_URI` | Local `.env` + Render | Atlas connection string, including `/ecommerce` |
| `JWT_SECRET` | Local `.env` + Render | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Local `.env` (optional) | Token lifetime, defaults to `7d` |
| `CLIENT_URL` | Render | Frontend origin allowed by CORS |
| `PORT` | Local `.env` (optional) | API port, defaults to 5000 (Render injects its own) |

---