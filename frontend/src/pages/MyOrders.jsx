import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { imgUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/shared/ProductCard';

const ReviewModal = ({ order, onClose, onDone }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setLoading(true);
    try {
      await api.post('/api/reviews', { order_id: order.id, rating, comment });
      onDone();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally { setLoading(false); }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.modalTitle}>Rate {order.seller_name}</h2>
        <p style={{ color: '#7A6A58', marginBottom: 20, fontSize: 14 }}>for order: {order.product_name}</p>
        {error && <div className="alert alert-error">{error}</div>}
        <div style={styles.starRow}>
          {[1,2,3,4,5].map(s => (
            <span key={s} onClick={() => setRating(s)} style={{ fontSize: 36, cursor: 'pointer', color: s <= rating ? '#F59E0B' : '#D1C4B0', transition: 'color 0.1s' }}>★</span>
          ))}
        </div>
        <div className="form-group" style={{ marginTop: 16 }}>
          <label>Comment (optional)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Share your experience..." style={{ resize: 'none' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button onClick={onClose} className="btn btn-outline btn-full">Cancel</button>
          <button onClick={submit} className="btn btn-primary btn-full" disabled={loading}>{loading ? 'Submitting...' : 'Submit Review'}</button>
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'buyer') { navigate('/login'); return; }
    api.get('/api/orders/mine').then(res => setOrders(res.data)).finally(() => setLoading(false));
  }, [user]);

  const handleReviewDone = () => {
    setReviewOrder(null);
    setOrders(orders.map(o => o.id === reviewOrder.id ? { ...o, reviewed: true } : o));
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <h1 style={styles.title}>My Orders</h1>
        {loading ? <div className="loading">Loading...</div> : orders.length === 0 ? (
          <div className="empty"><h3>No orders yet</h3><p>Browse products and place your first order</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {orders.map(o => (
              <div key={o.id} className="card" style={styles.orderCard}>
                <img src={imgUrl(o.image_url, 'https://via.placeholder.com/64')} alt="" style={styles.thumb} />
                <div style={styles.orderInfo}>
                  <strong style={{ fontSize: 16, fontFamily: 'Syne, sans-serif' }}>{o.product_name}</strong>
                  <p style={styles.meta}>Seller: {o.seller_name}</p>
                  <p style={styles.meta}>ETB {Number(o.price).toLocaleString()}</p>
                  <p style={styles.meta}>{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div style={styles.orderStatus}>
                  <span className={`badge badge-${o.status}`}>{o.status}</span>
                  {o.status === 'accepted' && !o.reviewed && (
                    <button onClick={() => setReviewOrder(o)} className="btn btn-outline btn-sm" style={{ marginTop: 10 }}>Leave Review</button>
                  )}
                  {o.reviewed && <p style={{ fontSize: 12, color: '#2E7D51', marginTop: 8 }}>✅ Reviewed</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {reviewOrder && <ReviewModal order={reviewOrder} onClose={() => setReviewOrder(null)} onDone={handleReviewDone} />}
    </div>
  );
};

const styles = {
  title: { fontSize: 28, fontWeight: 700, marginBottom: 28 },
  orderCard: { display: 'flex', gap: 16, padding: '16px 20px', alignItems: 'center' },
  thumb: { width: 64, height: 64, borderRadius: 10, objectFit: 'cover', background: '#F0E8DF', flexShrink: 0 },
  orderInfo: { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 },
  meta: { fontSize: 13, color: '#7A6A58' },
  orderStatus: { textAlign: 'right', flexShrink: 0 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(26,18,8,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)' },
  modal: { background: '#fff', borderRadius: 16, padding: '32px 28px', maxWidth: 420, width: '90%', boxShadow: '0 16px 60px rgba(0,0,0,0.2)' },
  modalTitle: { fontSize: 22, fontWeight: 700, marginBottom: 4 },
  starRow: { display: 'flex', gap: 8, justifyContent: 'center' },
};

export default MyOrders;
