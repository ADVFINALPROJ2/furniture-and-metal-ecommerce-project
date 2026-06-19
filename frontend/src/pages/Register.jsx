import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', phone: '', telegram: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/register', form);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'seller' ? '/seller/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.sub}>Join the Selam Market community</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="name" placeholder="Abebe Kebede" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="At least 6 characters" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>I am a...</label>
            <div style={styles.roleRow}>
              {['buyer', 'seller'].map(r => (
                <label key={r} style={{ ...styles.roleOption, ...(form.role === r ? styles.roleActive : {}) }}>
                  <input type="radio" name="role" value={r} checked={form.role === r} onChange={handleChange} style={{ display: 'none' }} />
                  <span style={styles.roleIcon}>{r === 'buyer' ? '🛍️' : '🔨'}</span>
                  <span style={styles.roleLabel}>{r === 'buyer' ? 'Buyer' : 'Seller'}</span>
                  <span style={styles.roleDesc}>{r === 'buyer' ? 'I want to shop' : 'I want to sell'}</span>
                </label>
              ))}
            </div>
          </div>
          {form.role === 'seller' && <>
            <div className="form-group">
              <label>Phone Number</label>
              <input name="phone" placeholder="+251 9xx xxx xxx" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Telegram Username</label>
              <input name="telegram" placeholder="@yourusername" value={form.telegram} onChange={handleChange} />
            </div>
          </>}
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p style={styles.loginLink}>Already have an account? <Link to="/login" style={{ color: 'var(--brand)', fontWeight: 500 }}>Sign in</Link></p>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FAF7F4 0%, #F0E8DF 100%)' },
  card: { background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(26,18,8,0.12)', padding: '40px 36px', width: '100%', maxWidth: 460 },
  header: { marginBottom: 28, textAlign: 'center' },
  title: { fontSize: 28, fontWeight: 700, color: '#1A1208', marginBottom: 6 },
  sub: { color: '#7A6A58', fontSize: 15 },
  roleRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  roleOption: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 12px', border: '2px solid #E8DDD4', borderRadius: 12, cursor: 'pointer', transition: 'all 0.15s', gap: 4 },
  roleActive: { borderColor: '#C8622A', background: '#FDF1EA' },
  roleIcon: { fontSize: 28 },
  roleLabel: { fontWeight: 600, fontSize: 15, fontFamily: 'Syne, sans-serif' },
  roleDesc: { fontSize: 12, color: '#7A6A58' },
  loginLink: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#7A6A58' },
};

export default Register;
