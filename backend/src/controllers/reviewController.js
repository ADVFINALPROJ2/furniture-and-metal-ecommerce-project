const pool = require('../config/db');

// POST /api/reviews — buyer reviews seller after accepted order
const createReview = async (req, res) => {
  const { order_id, rating, comment } = req.body;
  if (!order_id || !rating) return res.status(400).json({ message: 'order_id and rating are required' });
  if (rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be 1-5' });
  try {
    const order = await pool.query(`
      SELECT o.*, p.seller_id FROM orders o
      JOIN products p ON p.id=o.product_id
      WHERE o.id=$1 AND o.buyer_id=$2 AND o.status='accepted'
    `, [order_id, req.user.id]);
    if (!order.rows.length) return res.status(400).json({ message: 'Order not found or not accepted yet' });
    const result = await pool.query(
      'INSERT INTO reviews (buyer_id,seller_id,order_id,rating,comment) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.user.id, order.rows[0].seller_id, order_id, rating, comment || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'You already reviewed this order' });
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/reviews/seller/:sellerId
const getSellerReviews = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name AS buyer_name
      FROM reviews r JOIN users u ON u.id=r.buyer_id
      WHERE r.seller_id=$1
      ORDER BY r.created_at DESC
    `, [req.params.sellerId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT r.*, u.name AS buyer_name
      FROM reviews r
      JOIN users u ON u.id = r.buyer_id
      JOIN orders o ON o.id = r.order_id
      WHERE o.product_id = $1
      ORDER BY r.created_at DESC
    `, [req.params.productId]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { createReview, getSellerReviews, getProductReviews };
