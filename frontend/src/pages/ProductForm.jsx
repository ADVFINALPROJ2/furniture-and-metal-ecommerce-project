import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { imgUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Furniture', 'Metalwork', 'Office Furniture', 'Custom Orders', 'Decor', 'Other'];

const ProductForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Furniture' });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/login'); return; }
    if (isEdit) {
      api.get(`/api/products/${id}`).then(res => {
        const p = res.data;
        setForm({ name: p.name, description: p.description || '', price: p.price, category: p.category });
        if (p.image_url) setPreview(imgUrl(p.image_url));
      }).catch(() => navigate('/seller/dashboard'));
    }
  }, [id, user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price || !form.category) return setError('Name, price and category are required');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append('image', image);
      if (isEdit) {
        await api.put(`/api/products/${id}`, data);
      } else {
        await api.post('/api/products', data);
      }
      navigate('/seller/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={styles.card}>
        <h1 style={styles.title}>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input name="name" placeholder="e.g. Solid Wood Dining Table" value={form.name} onChange={handleChange} required />
          </div>
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Price (ETB) *</label>
              <input name="price" type="number" placeholder="5000" value={form.price} onChange={handleChange} required min="1" />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" placeholder="Describe your product..." value={form.description} onChange={handleChange} rows={4} style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group">
            <label>Product Image</label>
            <div style={styles.uploadArea} onClick={() => document.getElementById('imgInput').click()}>
              {preview ? (
                <img src={preview} alt="preview" style={styles.previewImg} />
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <span style={{ fontSize: 36 }}>📷</span>
                  <span style={{ fontSize: 14, color: '#7A6A58' }}>Click to upload image</span>
                  <span style={{ fontSize: 12, color: '#9B8B7A' }}>Max 5MB</span>
                </div>
              )}
              <input id="imgInput" type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button type="button" className="btn btn-outline btn-full" onClick={() => navigate('/seller/dashboard')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  card: { background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(26,18,8,0.10)', padding: '40px 36px', width: '100%', maxWidth: 560 },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 24 },
  row: { display: 'flex', gap: 16 },
  uploadArea: { border: '2px dashed #E8DDD4', borderRadius: 12, cursor: 'pointer', overflow: 'hidden', minHeight: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F4' },
  uploadPlaceholder: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 24 },
  previewImg: { width: '100%', maxHeight: 240, objectFit: 'cover', display: 'block' },
};

export default ProductForm;
