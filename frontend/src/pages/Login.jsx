import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { imgUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';

// Login page — authenticates user via POST /api/auth/login, stores JWT via AuthContext,
// then redirects based on role (buyer → home, seller → dashboard, admin → admin panel).
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      login(res.data.token, res.data.user);
      const role = res.data.user.role;
      navigate(role === 'seller' ? '/seller/dashboard' : role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>🪑</div>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.sub}>Sign in to Selam Market</p>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.registerLink}>Don't have an account? <Link to="/register" style={{ color: 'var(--brand)', fontWeight: 500 }}>Create one</Link></p>
        <div className="divider" />
        <p style={styles.hint}>Admin demo: admin@marketplace.com / admin123</p>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #FAF7F4 0%, #F0E8DF 100%)' },
  card: { background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(26,18,8,0.12)', padding: '40px 36px', width: '100%', maxWidth: 400 },
  header: { marginBottom: 28, textAlign: 'center' },
  logo: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 28, fontWeight: 700, color: '#1A1208', marginBottom: 6 },
  sub: { color: '#7A6A58', fontSize: 15 },
  registerLink: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#7A6A58' },
  hint: { textAlign: 'center', fontSize: 12, color: '#9B8B7A' },
};

export default Login;
