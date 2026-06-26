const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const {
  createReview,
  getSellerReviews,
  getProductReviews,
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/', authenticate, requireRole('buyer'), createReview);
router.get('/seller/:sellerId', getSellerReviews);
router.get('/product/:productId', getProductReviews);

module.exports = router;
