const pool = require('../config/db');

// GET /api/products — browse all, search, filter
const getProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  let query = `
    SELECT p.*, u.name AS seller_name, u.phone AS seller_phone, u.telegram AS seller_telegram,
      COALESCE(AVG(r.rating),0)::NUMERIC(3,1) AS avg_rating, COUNT(r.id) AS review_count
    FROM products p
    JOIN users u ON u.id = p.seller_id
    LEFT JOIN reviews r ON r.seller_id = p.seller_id
    WHERE p.is_active = TRUE AND u.is_active = TRUE
  `;
  const params = [];
  if (search) { params.push(`%${search}%`); query += ` AND (p.name ILIKE $${params.length} OR p.description ILIKE $${params.length})`; }
  if (category) { params.push(category); query += ` AND p.category = $${params.length}`; }
  if (minPrice) { params.push(minPrice); query += ` AND p.price >= $${params.length}`; }
  if (maxPrice) { params.push(maxPrice); query += ` AND p.price <= $${params.length}`; }
  query += ' GROUP BY p.id, u.name, u.phone, u.telegram ORDER BY p.created_at DESC';
  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, u.name AS seller_name, u.phone AS seller_phone, u.telegram AS seller_telegram,
        COALESCE(AVG(r.rating),0)::NUMERIC(3,1) AS avg_rating, COUNT(r.id) AS review_count
      FROM products p
      JOIN users u ON u.id = p.seller_id
      LEFT JOIN reviews r ON r.seller_id = p.seller_id
      WHERE p.id=$1 AND p.is_active=TRUE
      GROUP BY p.id, u.name, u.phone, u.telegram
    `, [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// POST /api/products — seller only
const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  if (!name || !price || !category) return res.status(400).json({ message: 'Name, price and category are required' });
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      'INSERT INTO products (seller_id,name,description,price,category,image_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [req.user.id, name, description, price, category, image_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

// PUT /api/products/:id — seller only (own products)
const updateProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  try {
    const check = await pool.query('SELECT * FROM products WHERE id=$1 AND seller_id=$2', [req.params.id, req.user.id]);
    if (!check.rows.length) return res.status(404).json({ message: 'Product not found or not yours' });
    const image_url = req.file ? `/uploads/${req.file.filename}` : check.rows[0].image_url;
    const result = await pool.query(
      'UPDATE products SET name=$1,description=$2,price=$3,category=$4,image_url=$5 WHERE id=$6 RETURNING *',
      [name || check.rows[0].name, description || check.rows[0].description, price || check.rows[0].price, category || check.rows[0].category, image_url, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// DELETE /api/products/:id — seller only
const deleteProduct = async (req, res) => {
  try {
    const check = await pool.query('SELECT id FROM products WHERE id=$1 AND seller_id=$2', [req.params.id, req.user.id]);
    if (!check.rows.length) return res.status(404).json({ message: 'Product not found or not yours' });
    await pool.query('UPDATE products SET is_active=FALSE WHERE id=$1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

// GET /api/products/seller/mine
const getMyProducts = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products WHERE seller_id=$1 ORDER BY created_at DESC', [req.user.id]);
    res.json(result.rows);
  } catch (err) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getMyProducts };
