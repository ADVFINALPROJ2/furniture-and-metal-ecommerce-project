#  Selam Market — Furniture & Metalworks Marketplace

A full-stack web marketplace connecting local furniture makers and metalworkers in Addis Ababa with buyers.

**Team:** Heyor Henok · Kidus Deksios · Nahom Sisay · Thomas Kiflu  
**Course:** SWEN224 — BITS College · 2026

---
## Deployment
https://furniture-and-metal-ecommerce-proje.vercel.app/
link for the deployed website 
vercel for frontend,
render for backend, 
cloudnary for database image store 
## Project Description

Selam Market is a full-stack web marketplace built to connect local furniture makers 
and metalworkers in Addis Ababa with buyers. The platform gives sellers a digital 
storefront to showcase their products 24/7 and reach customers beyond their physical 
shop location. Buyers can discover local products, compare options in one place, and 
rely on reviews to choose trustworthy sellers.

The system was built as an MVP (Minimum Viable Product) with three user roles: 
Buyers who browse and order products, Sellers who manage listings and handle orders, 
and an Admin who monitors platform activity and manages users.

## The Problem it Solves

In many local markets like Addis Ababa, furniture and metalwork sellers rely on 
physical shops, word of mouth, and scattered social media posts. Buyers have limited 
product visibility, cannot easily compare options, and lack trust in unknown sellers. 
There is no centralized platform dedicated to this industry. Selam Market addresses 
this gap by providing a structured, searchable, and review-backed digital marketplace 
specifically for furniture and metalworks.

## Key Features

- **User authentication** — Register and login as Buyer, Seller, or Admin with JWT-based sessions
- **Product listings** — Sellers can add, edit, and delete products with images, prices, and categories
- **Search and filter** — Buyers can search by keyword and filter by category and price range
- **Order system** — Buyers place orders, sellers accept or reject them, buyers track status
- **Review system** — Buyers rate and review sellers after accepted orders
- **Admin dashboard** — Monitor platform activity, manage users, ban rule violators
- **Persistent image uploads** — Product images stored on Cloudinary for permanent availability
- **Responsive design** — Works on mobile and slow 3G/4G connections
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
furniture-and-metal-ecommerce-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── schema.sql
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── authController.js
│   │   │   ├── orderController.js
│   │   │   ├── productController.js
│   │   │   └── reviewController.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── routes/
│   │       └── index.js
│   ├── uploads/
│   │   └── .gitkeep
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── components/
│       │   └── shared/
│       │       ├── Navbar.jsx
│       │       └── ProductCard.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── Admin.jsx
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── MyOrders.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── ProductForm.jsx
│       │   ├── Register.jsx
│       │   └── SellerDashboard.jsx
│       ├── utils/
│       │   └── api.js
│       ├── App.jsx
│       ├── index.css
│       └── index.js
├── .gitignore
└── README.md
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

