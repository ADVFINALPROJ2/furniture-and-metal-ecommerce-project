const pool = require('../config/db');

// POST /api/orders — buyer places order
const placeOrder = async (req, res) => {
  const { product_id } = req.body;
  if (!product_id) return res.status(400).json({ message: 'product_id is required' });
  try {
    const product = await pool.query('SELECT * FROM products WHERE id=$1 AND is_active=TRUE', [product_id]);
    if (!product.rows.length) return res.status(404).json({ message: 'Product not found' });
    if (product.rows[0].seller_id === req.user.id) return res.status(400).json({ message: 'You cannot order your own product' });
    const result = await pool.query(
      'INSERT INTO orders (buyer_id,product_id) VALUES ($1,$2) RETURNING *',
      [req.user.id, product_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

// GET /api/orders/mine — buyer sees their orders
const getMyOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, p.name AS product_name, p.price, p.image_url, p.category,
        u.name AS seller_name,
        EXISTS(SELECT 1 FROM reviews r WHERE r.order_id=o.id) AS reviewed
      FROM orders o
      JOIN products p ON p.id=o.product_id
      JOIN users u ON u.id=p.seller_id
      WHERE o.buyer_id=$1
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// GET /api/orders/seller — seller sees incoming orders
const getSellerOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT o.*, p.name AS product_name, p.price, p.image_url,
        u.name AS buyer_name, u.phone AS buyer_phone, u.telegram AS buyer_telegram
      FROM orders o
      JOIN products p ON p.id=o.product_id
      JOIN users u ON u.id=o.buyer_id
      WHERE p.seller_id=$1
      ORDER BY o.created_at DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// PATCH /api/orders/:id/status — seller accepts or rejects
const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  if (!['accepted', 'rejected'].includes(status)) return res.status(400).json({ message: 'Status must be accepted or rejected' });
  try {
    const check = await pool.query(`
      SELECT o.id FROM orders o
      JOIN products p ON p.id=o.product_id
      WHERE o.id=$1 AND p.seller_id=$2
    `, [req.params.id, req.user.id]);
    if (!check.rows.length) return res.status(404).json({ message: 'Order not found or not yours' });
    const result = await pool.query('UPDATE orders SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { placeOrder, getMyOrders, getSellerOrders, updateOrderStatus };
