const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts } = require('../controllers/productController');
const { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus } = require('../controllers/orderController');
const { createReview, getSellerReviews, getProductReviews } = require('../controllers/reviewController');

const router = express.Router();

// Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// AUTH
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);

// PRODUCTS
router.get('/products', getProducts);
router.get('/products/seller/mine', authenticate, requireRole('seller'), getMyProducts);
router.get('/products/:id', getProduct);
router.post('/products', authenticate, requireRole('seller'), upload.single('image'), createProduct);
router.put('/products/:id', authenticate, requireRole('seller'), upload.single('image'), updateProduct);
router.delete('/products/:id', authenticate, requireRole('seller'), deleteProduct);

// ORDERS
router.post('/orders', authenticate, requireRole('buyer'), placeOrder);
router.get('/orders/mine', authenticate, requireRole('buyer'), getMyOrders);
router.get('/orders/seller', authenticate, requireRole('seller'), getSellerOrders);
router.patch('/orders/:id/status', authenticate, requireRole('seller'), updateOrderStatus);

// REVIEWS
router.post('/reviews', authenticate, requireRole('buyer'), createReview);
router.get('/reviews/seller/:sellerId', getSellerReviews);
router.get('/reviews/product/:productId', getProductReviews);

module.exports = router;
