const express = require('express');
const { authenticate, requireRole } = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');

const router = express.Router();

// AUTH
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);

module.exports = router;
