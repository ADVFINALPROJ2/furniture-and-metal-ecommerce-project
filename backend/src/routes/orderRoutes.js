const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const {
  placeOrder,
  getMyOrders,
  getSellerOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', authenticate, requireRole('buyer'), placeOrder);
router.get('/mine', authenticate, requireRole('buyer'), getMyOrders);
router.get('/seller', authenticate, requireRole('seller'), getSellerOrders);
router.patch('/:id/status', authenticate, requireRole('seller'), updateOrderStatus);

module.exports = router;
