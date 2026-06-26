const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate, requireRole } = require('../middleware/auth');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require('../controllers/productController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProducts);
router.get('/seller/mine', authenticate, requireRole('seller'), getMyProducts);
router.get('/:id', getProduct);
router.post('/', authenticate, requireRole('seller'), upload.single('image'), createProduct);
router.put('/:id', authenticate, requireRole('seller'), upload.single('image'), updateProduct);
router.delete('/:id', authenticate, requireRole('seller'), deleteProduct);

module.exports = router;
