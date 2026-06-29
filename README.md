#  Selam Market — Furniture & Metalworks Marketplace

A full-stack web marketplace connecting local furniture makers and metalworkers in Addis Ababa with buyers.

**Team:** Heyor Henok · Kidus Deksios · Nahom Sisay · Thomas Kiflu  
**Course:** SWEN224 — BITS College · 2026

---
## Deployment
https://furniture-and-metal-ecommerce-proje.vercel.app/
link for the deployed website 
vercel for frontend 
render for backend 
cloudnary for database image store 

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

