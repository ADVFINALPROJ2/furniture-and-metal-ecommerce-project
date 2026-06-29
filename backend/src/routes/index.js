const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { authenticate, requireRole } = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts } = require('../controllers/productController');
const { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus } = require('../controllers/orderController');
const { createReview, getSellerReviews, getProductReviews } = require('../controllers/reviewController');
const { getAllUsers, setUserStatus, getStats } = require('../controllers/adminController');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'furniture-marketplace',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
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

// ADMIN
router.get('/admin/users', authenticate, requireRole('admin'), getAllUsers);
router.patch('/admin/users/:id/status', authenticate, requireRole('admin'), setUserStatus);
router.get('/admin/stats', authenticate, requireRole('admin'), getStats);

module.exports = router;
