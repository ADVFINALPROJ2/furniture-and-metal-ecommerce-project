const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

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
const path = require('path');
const { authenticate, requireRole } = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts } = require('../controllers/productController');
const { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus } = require('../controllers/orderController');
const { createReview, getSellerReviews, getProductReviews } = require('../controllers/reviewController');
const { getAllUsers, setUserStatus, getStats } = require('../controllers/adminController');

const router = express.Router();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);

router.get('/products', getProducts);
router.get('/products/seller/mine', authenticate, requireRole('seller'), getMyProducts);
router.get('/products/:id', getProduct);
router.post('/products', authenticate, requireRole('seller'), upload.single('image'), createProduct);
router.put('/products/:id', authenticate, requireRole('seller'), upload.single('image'), updateProduct);
router.delete('/products/:id', authenticate, requireRole('seller'), deleteProduct);

router.post('/orders', authenticate, requireRole('buyer'), placeOrder);
router.get('/orders/mine', authenticate, requireRole('buyer'), getMyOrders);
router.get('/orders/seller', authenticate, requireRole('seller'), getSellerOrders);
router.patch('/orders/:id/status', authenticate, requireRole('seller'), updateOrderStatus);

router.post('/reviews', authenticate, requireRole('buyer'), createReview);
router.get('/reviews/seller/:sellerId', getSellerReviews);
router.get('/reviews/product/:productId', getProductReviews);

router.get('/admin/users', authenticate, requireRole('admin'), getAllUsers);
router.patch('/admin/users/:id/status', authenticate, requireRole('admin'), setUserStatus);
router.get('/admin/stats', authenticate, requireRole('admin'), getStats);

module.exports = router;
