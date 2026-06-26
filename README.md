#  Selam Market — Furniture & Metalworks Marketplace

A full-stack web marketplace connecting local furniture makers and metalworkers in Addis Ababa with buyers.

**Team:** Heyor Henok · Kidus Deksios · Nahom Sisay · Thomas Kiflu  
**Course:** SWEN224 — BITS College · 2026

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT + bcrypt |

---

## Project Structure

```
furniture-marketplace/
├── backend/
│   ├── src/
│   │   ├── config/         # db.js, schema.sql
│   │   ├── controllers/    # auth, products, orders, reviews, admin
│   │   ├── middleware/     # JWT auth + role guard
│   │   └── routes/        # All API routes in one file
│   ├── uploads/           # Product images (auto-created)
│   ├── .env.example       # Copy this to .env and fill in values
│   └── package.json
└── frontend/
    └── src/
        ├── components/shared/  # Navbar, ProductCard
        ├── context/            # AuthContext (global user state)
        ├── pages/              # All page components
        ├── utils/              # api.js — axios instance + imgUrl helper
        └── App.jsx             # Routes and protected route wrapper
```

---

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/ADVFINALPROJ2/furniture-marketplace.git
cd furniture-marketplace
```

### 2. Set up PostgreSQL database
```bash
# Create the database
psql -U postgres -c "CREATE DATABASE furniture_marketplace;"

# Run the schema (creates all tables + seeds admin user)
psql -U postgres -d furniture_marketplace -f backend/src/config/schema.sql
```

### 3. Configure the backend
```bash
cd backend
npm install
cp .env.example .env
# Open .env and set your PostgreSQL password and a JWT secret
```



### 4. Start the backend
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 5. Start the frontend
```bash
cd ../frontend
npm install
npm start
# App opens at http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register as buyer or seller |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me |  | Get current user |
| GET | /api/products | — | Browse / search / filter |
| GET | /api/products/:id | — | Product detail |
| POST | /api/products | Seller | Add product |
| PUT | /api/products/:id | Seller | Edit product |
| DELETE | /api/products/:id | Seller | Delete product |
| GET | /api/products/seller/mine | Seller | My listings |
| POST | /api/orders | Buyer | Place order |
| GET | /api/orders/mine | Buyer | My orders |
| GET | /api/orders/seller | Seller | Incoming orders |
| PATCH | /api/orders/:id/status | Seller | Accept / reject |
| POST | /api/reviews | Buyer | Leave review |
| GET | /api/reviews/seller/:id | — | Seller reviews |
| GET | /api/admin/users | Admin | All users |
| PATCH | /api/admin/users/:id/status | Admin | Ban / reactivate user |
| GET | /api/admin/stats | Admin | Platform statistics |

---

## Deployment

- **Frontend:** Vercel (set `REACT_APP_API_URL` environment variable)
- **Backend:** Render Web Service (set all `.env` variables in dashboard)
- **Database:** Render PostgreSQL (free tier)
