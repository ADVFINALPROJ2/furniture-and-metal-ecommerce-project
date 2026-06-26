const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const {
  getAllUsers,
  setUserStatus,
  getStats,
} = require('../controllers/adminController');

const router = express.Router();

router.get('/users', authenticate, requireRole('admin'), getAllUsers);
router.patch('/users/:id/status', authenticate, requireRole('admin'), setUserStatus);
router.get('/stats', authenticate, requireRole('admin'), getStats);

module.exports = router;
