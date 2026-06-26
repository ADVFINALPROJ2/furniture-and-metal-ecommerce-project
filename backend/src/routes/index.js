const express = require('express');
const multer = require('multer');
const path = require('path');
const { authenticate, requireRole } = require('../middleware/auth');
const { register, login, getMe } = require('../controllers/authController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', authenticate, getMe);

module.exports = router;
