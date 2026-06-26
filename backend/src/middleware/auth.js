const jwt = require('jsonwebtoken');

// Stub authentication middleware to be implemented
const authenticate = (req, res, next) => {
  next();
};

// Stub role check middleware to be implemented
const requireRole = (...roles) => (req, res, next) => {
  next();
};

module.exports = { authenticate, requireRole };
