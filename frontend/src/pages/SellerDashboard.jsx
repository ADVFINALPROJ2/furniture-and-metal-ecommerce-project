import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { imgUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const SellerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/login'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, oRes] = await Promise.all([
        api.get('/api/products/seller/mine'),
        api.get('/api/orders/seller'),
      ]);
      setProducts(pRes.data);
      setOrders(oRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await api.delete(`/api/products/${id}`);
    setProducts(products.filter(p => p.id !== id));
  };

  const handleOrderStatus = async (orderId, status) => {
    await api.patch(`/api/orders/${orderId}/status`, { status });
    setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const pending = orders.filter(o => o.status === 'pending');

  return (
    <div className="page">
      <div className="container">
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Seller Dashboard</h1>
            <p style={styles.sub}>Welcome back, {user?.name}</p>
          </div>
          <Link to="/seller/products/new" className="btn btn-primary">+ Add Product</Link>
        </div>

        <div style={styles.stats}>
          {[
            { label: 'My Products', value: products.length, icon: '📦' },
            { label: 'Total Orders', value: orders.length, icon: '🛒' },
            { label: 'Pending', value: pending.length, icon: '⏳' },
            { label: 'Accepted', value: orders.filter(o => o.status === 'accepted').length, icon: '✅' },
          ].map(s => (
            <div key={s.label} className="card" style={styles.statCard}>
              <span style={styles.statIcon}>{s.icon}</span>
              <span style={styles.statValue}>{s.value}</span>
              <span style={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div style={styles.tabs}>
          {['products', 'orders'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
              {t === 'products' ? `📦 My Products (${products.length})` : `🛒 Orders (${orders.length})`}
            </button>
          ))}
        </div>

        {loading ? <div className="loading">Loading...</div> : tab === 'products' ? (
          <div>
            {products.length === 0 ? (
              <div className="empty"><h3>No products yet</h3><p>Start by adding your first product listing</p></div>
            ) : (
              <div style={styles.productTable}>
                {products.map(p => (
                  <div key={p.id} className="card" style={styles.productRow}>
                    <div style={styles.productImg}>
                      <img src={imgUrl(p.image_url, 'https://via.placeholder.com/60')} alt={p.name} style={styles.thumb} />
                    </div>
                    <div style={styles.productInfo}>
                      <strong style={{ fontFamily: 'Syne, sans-serif' }}>{p.name}</strong>
                      <span style={styles.productMeta}>{p.category} • ETB {Number(p.price).toLocaleString()}</span>
                    </div>
                    <div style={styles.productActions}>
                      <Link to={`/seller/products/${p.id}/edit`} className="btn btn-outline btn-sm">Edit</Link>
                      <button onClick={() => handleDelete(p.id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {orders.length === 0 ? (
              <div className="empty"><h3>No orders yet</h3><p>Orders from buyers will appear here</p></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {orders.map(o => (
                  <div key={o.id} className="card" style={styles.orderCard}>
                    <div style={styles.orderLeft}>
                      <img src={imgUrl(o.image_url, 'https://via.placeholder.com/56')} alt="" style={styles.orderThumb} />
                      <div>
                        <strong style={{ fontSize: 15 }}>{o.product_name}</strong>
                        <p style={styles.orderMeta}>ETB {Number(o.price).toLocaleString()}</p>
                        <p style={styles.orderMeta}>Buyer: {o.buyer_name}</p>
                        {o.buyer_phone && <p style={styles.orderMeta}>📞 {o.buyer_phone}</p>}
                        {o.buyer_telegram && <p style={styles.orderMeta}>✈️ {o.buyer_telegram}</p>}
                        <p style={styles.orderMeta}>{new Date(o.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div style={styles.orderRight}>
                      <span className={`badge badge-${o.status}`}>{o.status}</span>
                      {o.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <button onClick={() => handleOrderStatus(o.id, 'accepted')} className="btn btn-success btn-sm">Accept</button>
                          <button onClick={() => handleOrderStatus(o.id, 'rejected')} className="btn btn-danger btn-sm">Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title: { fontSize: 28, fontWeight: 700 },
  sub: { color: '#7A6A58', marginTop: 4 },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 },
  statCard: { padding: '20px 16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 28 },
  statValue: { fontSize: 28, fontWeight: 700, fontFamily: 'Syne, sans-serif', color: '#C8622A' },
  statLabel: { fontSize: 12, color: '#7A6A58', fontWeight: 500 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: { padding: '10px 20px', borderRadius: 10, border: '1.5px solid #E8DDD4', background: '#fff', color: '#7A6A58', fontWeight: 500, fontSize: 14, cursor: 'pointer' },
  tabActive: { background: '#1A1208', color: '#fff', border: '1.5px solid #1A1208' },
  productTable: { display: 'flex', flexDirection: 'column', gap: 10 },
  productRow: { display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px' },
  productImg: { flexShrink: 0 },
  thumb: { width: 56, height: 56, borderRadius: 8, objectFit: 'cover', background: '#F0E8DF' },
  productInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 },
  productMeta: { fontSize: 13, color: '#7A6A58' },
  productActions: { display: 'flex', gap: 8 },
  orderCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 20px' },
  orderLeft: { display: 'flex', gap: 14, alignItems: 'flex-start' },
  orderThumb: { width: 56, height: 56, borderRadius: 8, objectFit: 'cover', background: '#F0E8DF', flexShrink: 0 },
  orderMeta: { fontSize: 13, color: '#7A6A58', marginTop: 2 },
  orderRight: { textAlign: 'right' },
};

export default SellerDashboard;
