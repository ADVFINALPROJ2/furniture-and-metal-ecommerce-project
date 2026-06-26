const pool = require('../config/db');

/**
 * Retrieves all registered users from the database, excluding administrators.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id,name,email,role,phone,telegram,is_active,created_at FROM users WHERE role != 'admin' ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

/**
 * Updates a user's active status (ban or reactivate).
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const setUserStatus = async (req, res) => {
  const { is_active } = req.body;
  try {
    await pool.query('UPDATE users SET is_active=$1 WHERE id=$2', [is_active, req.params.id]);
    res.json({ message: `User ${is_active ? 'reactivated' : 'banned'}` });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

/**
 * Retrieves aggregate statistics for administrators, including total users, products, orders, and reviews,
 * along with the 10 most recent orders.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 */
const getStats = async (req, res) => {
  try {
    const [users, products, orders, reviews] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM users WHERE role!='admin'"),
      pool.query('SELECT COUNT(*) FROM products WHERE is_active=TRUE'),
      pool.query('SELECT COUNT(*) FROM orders'),
      pool.query('SELECT COUNT(*) FROM reviews'),
    ]);
    const recentOrders = await pool.query(`
      SELECT o.id, o.status, o.created_at, p.name AS product_name, u.name AS buyer_name
      FROM orders o JOIN products p ON p.id=o.product_id JOIN users u ON u.id=o.buyer_id
      ORDER BY o.created_at DESC LIMIT 10
    `);
    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalProducts: parseInt(products.rows[0].count),
      totalOrders: parseInt(orders.rows[0].count),
      totalReviews: parseInt(reviews.rows[0].count),
      recentOrders: recentOrders.rows,
    });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getAllUsers, setUserStatus, getStats };
