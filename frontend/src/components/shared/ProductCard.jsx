import React from 'react';
import { Link } from 'react-router-dom';
import { imgUrl } from '../../utils/api';

const StarRating = ({ rating }) => {
  const stars = Math.round(Number(rating));
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= stars ? '#F59E0B' : '#D1C4B0' }}>★</span>
      ))}
    </span>
  );
};

const ProductCard = ({ product }) => {
  const imageUrl = imgUrl(product.image_url);
  const hasRating = Number(product.review_count) > 0;

  return (
    <Link to={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={styles.card}>
        <div style={styles.imgWrap}>
          <img src={imageUrl} alt={product.name} style={styles.img} />
          <span style={styles.category}>{product.category}</span>
        </div>
        <div style={styles.body}>
          <h3 style={styles.name}>{product.name}</h3>
          <p style={styles.seller}>by {product.seller_name}</p>
          <div style={styles.footer}>
            <span style={styles.price}>ETB {Number(product.price).toLocaleString()}</span>
            {hasRating ? (
              <div style={styles.rating}>
                <StarRating rating={product.avg_rating} />
                <span style={styles.reviewCount}>({product.review_count})</span>
              </div>
            ) : (
              <span style={styles.noRating}>No reviews</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const styles = {
  card: { transition: 'transform 0.18s, box-shadow 0.18s', cursor: 'pointer', height: '100%' },
  imgWrap: { position: 'relative', paddingTop: '65%', background: '#F0E8DF', overflow: 'hidden' },
  img: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' },
  category: { position: 'absolute', top: 10, left: 10, background: 'rgba(26,18,8,0.75)', color: '#fff', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500 },
  body: { padding: '14px 16px 16px' },
  name: { fontSize: 15, fontWeight: 600, color: '#1A1208', marginBottom: 4, lineHeight: 1.3, fontFamily: 'Syne, sans-serif' },
  seller: { fontSize: 12, color: '#7A6A58', marginBottom: 10 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: 700, color: '#C8622A', fontFamily: 'Syne, sans-serif' },
  rating: { display: 'flex', alignItems: 'center', gap: 4 },
  reviewCount: { fontSize: 11, color: '#7A6A58' },
  noRating: { fontSize: 11, color: '#9B8B7A', fontStyle: 'italic' },
};

export { StarRating };
export default ProductCard;