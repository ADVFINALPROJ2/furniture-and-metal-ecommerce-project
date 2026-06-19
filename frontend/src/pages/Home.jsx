import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/shared/ProductCard';

const CATEGORIES = ['All', 'Furniture', 'Metalwork', 'Office Furniture', 'Custom Orders', 'Decor', 'Other'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await axios.get('/api/products', { params });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSearch = e => { e.preventDefault(); fetchProducts(); };

  const handleCategoryChange = val => { setCategory(val); setTimeout(fetchProducts, 50); };

  return (
    <div>
      {/* Hero */}
      <div style={styles.hero}>
        <div className="container">
          <h1 style={styles.heroTitle}>Addis Ababa's Furniture<br />& Metalworks Market</h1>
          <p style={styles.heroSub}>Discover handcrafted pieces from local artisans and workshops</p>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              placeholder="Search for wooden table, metal shelf, sofa..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" className="btn btn-primary" style={styles.searchBtn}>Search</button>
          </form>
        </div>
      </div>

      <div className="container page">
        {/* Filters */}
        <div style={styles.filterRow}>
          <div style={styles.categories}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => handleCategoryChange(c)}
                className="btn btn-sm"
                style={{ ...styles.catBtn, ...(category === c ? styles.catActive : {}) }}>
                {c}
              </button>
            ))}
          </div>
          <div style={styles.priceFilter}>
            <input placeholder="Min ETB" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={styles.priceInput} type="number" />
            <span style={{ color: '#7A6A58', fontSize: 13 }}>–</span>
            <input placeholder="Max ETB" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={styles.priceInput} type="number" />
            <button onClick={fetchProducts} className="btn btn-outline btn-sm">Apply</button>
          </div>
        </div>

        {/* Results */}
        <div style={styles.resultsHeader}>
          <p style={styles.count}>{loading ? '...' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}</p>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty">
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  hero: { background: 'linear-gradient(135deg, #1A1208 0%, #3D2B10 100%)', padding: '64px 0 56px', position: 'relative', overflow: 'hidden' },
  heroTitle: { fontSize: 40, fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: 14 },
  heroSub: { color: '#C8B8A8', fontSize: 17, marginBottom: 32 },
  searchForm: { display: 'flex', gap: 12, maxWidth: 600 },
  searchInput: { flex: 1, background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: 10, padding: '12px 18px', fontSize: 15, outline: 'none' },
  searchBtn: { padding: '12px 28px', fontSize: 15, flexShrink: 0 },
  filterRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  categories: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  catBtn: { background: '#fff', border: '1.5px solid #E8DDD4', color: '#7A6A58', borderRadius: 20 },
  catActive: { background: '#C8622A', color: '#fff', border: '1.5px solid #C8622A' },
  priceFilter: { display: 'flex', alignItems: 'center', gap: 8 },
  priceInput: { width: 110, padding: '8px 12px' },
  resultsHeader: { marginBottom: 20 },
  count: { color: '#7A6A58', fontSize: 14 },
};

export default Home;
