import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { imgUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Admin dashboard — platform overview with stats, recent orders, and user management (ban/reactivate).
const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/login'); return; }
    fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, uRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
      ]);
      setStats(sRes.data);
      setUsers(uRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const toggleUser = async (userId, currentStatus) => {
    const action = currentStatus ? 'Ban' : 'Reactivate';
    if (!window.confirm(`${action} this user?`)) return;
    await api.patch(`/api/admin/users/${userId}/status`, { is_active: !currentStatus });
    setUsers(users.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
  };

  return (
    <div className="page">
      <div className="container">
        <h1 style={styles.title}>Admin Dashboard</h1>

        {/* Stats cards */}
        {stats && (
          <div style={styles.statsGrid}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥' },
              { label: 'Active Products', value: stats.totalProducts, icon: '📦' },
              { label: 'Total Orders', value: stats.totalOrders, icon: '🛒' },
              { label: 'Reviews', value: stats.totalReviews, icon: '⭐' },
            ].map(s => (
              <div key={s.label} className="card" style={styles.statCard}>
                <span style={{ fontSize: 32 }}>{s.icon}</span>
                <span style={styles.statVal}>{s.value}</span>
                <span style={styles.statLbl}>{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={styles.tabs}>
          {['overview', 'users'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...styles.tab, ...(tab === t ? styles.tabActive : {}) }}>
              {t === 'overview' ? '📊 Recent Orders' : `👥 Manage Users (${users.length})`}
            </button>
          ))}
        </div>

        {loading ? <div className="loading">Loading...</div> : tab === 'overview' ? (
          <div>
            <h2 style={styles.sectionTitle}>Recent Orders</h2>
            {stats?.recentOrders?.length === 0 ? (
              <div className="empty"><h3>No orders yet</h3></div>
            ) : (
              <div style={styles.table}>
                <div style={styles.thead}>
                  <span>Product</span><span>Buyer</span><span>Date</span><span>Status</span>
                </div>
                {stats?.recentOrders?.map(o => (
                  <div key={o.id} style={styles.trow}>
                    <span style={{ fontWeight: 500 }}>{o.product_name}</span>
                    <span style={{ color: '#7A6A58' }}>{o.buyer_name}</span>
                    <span style={{ color: '#7A6A58', fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString()}</span>
                    <span><span className={`badge badge-${o.status}`}>{o.status}</span></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 style={styles.sectionTitle}>All Users</h2>
            <div style={styles.table}>
              <div style={styles.thead}>
                <span>Name</span><span>Email</span><span>Role</span><span>Joined</span><span>Action</span>
              </div>
              {users.map(u => (
                <div key={u.id} style={{ ...styles.trow, opacity: u.is_active ? 1 : 0.5 }}>
                  <span style={{ fontWeight: 500 }}>{u.name}</span>
                  <span style={{ color: '#7A6A58', fontSize: 13 }}>{u.email}</span>
                  <span><span className={`badge badge-${u.role}`}>{u.role}</span></span>
                  <span style={{ color: '#7A6A58', fontSize: 13 }}>{new Date(u.created_at).toLocaleDateString()}</span>
                  <span>
                    <button
                      onClick={() => toggleUser(u.id, u.is_active)}
                      className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}>
                      {u.is_active ? 'Ban' : 'Reactivate'}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  title: { fontSize: 28, fontWeight: 700, marginBottom: 28 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 },
  statCard: { padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  statVal: { fontSize: 32, fontWeight: 700, color: '#C8622A', fontFamily: 'Syne, sans-serif' },
  statLbl: { fontSize: 13, color: '#7A6A58', fontWeight: 500 },
  tabs: { display: 'flex', gap: 8, marginBottom: 24 },
  tab: { padding: '10px 20px', borderRadius: 10, border: '1.5px solid #E8DDD4', background: '#fff', color: '#7A6A58', fontWeight: 500, fontSize: 14, cursor: 'pointer' },
  tabActive: { background: '#1A1208', color: '#fff', border: '1.5px solid #1A1208' },
  sectionTitle: { fontSize: 18, fontWeight: 600, marginBottom: 16 },
  table: { background: '#fff', borderRadius: 12, border: '1px solid #E8DDD4', overflow: 'hidden' },
  thead: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', padding: '12px 20px', background: '#FAF7F4', fontSize: 12, fontWeight: 600, color: '#7A6A58', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E8DDD4' },
  trow: { display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', padding: '14px 20px', borderBottom: '1px solid #F0E8DF', alignItems: 'center', fontSize: 14 },
};

export default Admin;
