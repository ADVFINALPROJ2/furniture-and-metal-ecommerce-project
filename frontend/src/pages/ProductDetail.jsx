import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { imgUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { StarRating } from '../components/shared/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [orderMsg, setOrderMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pRes = await api.get(`/api/products/${id}`);
        setProduct(pRes.data);
        const rRes = await api.get(`/api/reviews/product/${id}`).catch(() => ({ data: [] }));
        setReviews(rRes.data);
      } catch {
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleOrder = async () => {
    if (!user) return navigate('/login');
    setOrdering(true);
    try {
      await api.post('/api/orders', { product_id: id });
      setOrderMsg('success');
    } catch (err) {
      setOrderMsg(err.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return null;

  const imageUrl = imgUrl(product.image_url, 'https://via.placeholder.com/600x400?text=No+Image');

  // Fix bug 2: if no reviews yet show no stars, not 2 stars
  const hasRating = product.review_count > 0;

  return (
    <div className="page">
      <div className="container">
        <div style={styles.grid}>
          <div style={styles.imgWrap}>
            <img src={imageUrl} alt={product.name} style={styles.img} />
          </div>

          <div style={styles.info}>
            <span style={styles.category}>{product.category}</span>
            <h1 style={styles.name}>{product.name}</h1>

            <div style={styles.ratingRow}>
              {hasRating ? (
                <>
                  <StarRating rating={Number(product.avg_rating)} />
                  <span style={styles.ratingText}>
                    {Number(product.avg_rating).toFixed(1)} ({product.review_count} review{product.review_count !== 1 ? 's' : ''})
                  </span>
                </>
              ) : (
                <span style={styles.noRating}>No reviews yet</span>
              )}
            </div>

            <p style={styles.price}>ETB {Number(product.price).toLocaleString()}</p>
            <p style={styles.desc}>{product.description || 'No description provided.'}</p>

            <div className="divider" />
            <div style={styles.sellerBox}>
              <h3 style={styles.sellerTitle}>Seller Info</h3>
              <p style={styles.sellerName}>🔨 {product.seller_name}</p>
              {product.seller_phone && <p style={styles.contact}>📞 {product.seller_phone}</p>}
              {product.seller_telegram && <p style={styles.contact}>✈️ Telegram: {product.seller_telegram}</p>}
            </div>
            <div className="divider" />

            {orderMsg === 'success' ? (
              <div className="alert alert-success">
                ✅ Order placed! Check <a href="/orders" style={{ color: 'var(--success)' }}>My Orders</a> for status.
              </div>
            ) : orderMsg ? (
              <div className="alert alert-error">{orderMsg}</div>
            ) : null}

            {user?.role === 'buyer' && orderMsg !== 'success' && (
              <button className="btn btn-primary btn-full" onClick={handleOrder} disabled={ordering} style={{ fontSize: 16, padding: '14px' }}>
                {ordering ? 'Placing Order...' : 'Place Order'}
              </button>
            )}
            {!user && (
              <button className="btn btn-primary btn-full" onClick={() => navigate('/login')} style={{ fontSize: 16, padding: '14px' }}>
                Login to Order
              </button>
            )}
          </div>
        </div>

        {/* Reviews section */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, marginBottom: 20 }}>
            Reviews {reviews.length > 0 && `(${reviews.length})`}
          </h2>
          {reviews.length === 0 ? (
            <p style={{ color: '#7A6A58' }}>No reviews yet for this seller.</p>
          ) : (
            <div style={styles.reviewList}>
              {reviews.map(r => (
                <div key={r.id} className="card" style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <strong>{r.buyer_name}</strong>
                    <StarRating rating={r.rating} />
                    <span style={{ color: '#7A6A58', fontSize: 12 }}>
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {r.comment && (
                    <p style={{ color: '#2D2015', fontSize: 14, marginTop: 8 }}>{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'start' },
  imgWrap: { borderRadius: 16, overflow: 'hidden', background: '#F0E8DF' },
  img: { width: '100%', display: 'block', objectFit: 'cover', maxHeight: 460 },
  info: { paddingTop: 8 },
  category: { display: 'inline-block', background: '#F5E6DA', color: '#C8622A', fontSize: 12, fontWeight: 600, padding: '3px 12px', borderRadius: 20, marginBottom: 12 },
  name: { fontSize: 30, fontWeight: 700, color: '#1A1208', marginBottom: 10, lineHeight: 1.2 },
  ratingRow: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  ratingText: { color: '#7A6A58', fontSize: 14 },
  noRating: { color: '#9B8B7A', fontSize: 14, fontStyle: 'italic' },
  price: { fontSize: 28, fontWeight: 700, color: '#C8622A', fontFamily: 'Syne, sans-serif', marginBottom: 16 },
  desc: { color: '#4A3C2E', fontSize: 15, lineHeight: 1.7 },
  sellerBox: { background: '#FAF7F4', borderRadius: 12, padding: '16px 18px' },
  sellerTitle: { fontSize: 13, fontWeight: 600, color: '#7A6A58', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 },
  sellerName: { fontSize: 16, fontWeight: 600, marginBottom: 6 },
  contact: { fontSize: 14, color: '#4A3C2E', marginBottom: 4 },
  reviewList: { display: 'flex', flexDirection: 'column', gap: 12 },
  reviewCard: { padding: '16px 20px' },
  reviewHeader: { display: 'flex', alignItems: 'center', gap: 12 },
};

export default ProductDetail;