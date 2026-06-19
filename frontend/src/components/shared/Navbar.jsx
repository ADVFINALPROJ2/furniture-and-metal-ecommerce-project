import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/" style={styles.logo}>
          🪑 <span style={styles.logoText}>Selam Market</span>
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Browse</Link>
          {!user && <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>}
          {user?.role === 'buyer' && <>
            <Link to="/orders" style={styles.link}>My Orders</Link>
          </>}
          {user?.role === 'seller' && <>
            <Link to="/seller/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/seller/products/new" className="btn btn-primary btn-sm">+ List Product</Link>
          </>}
          {user?.role === 'admin' && <>
            <Link to="/admin" style={styles.link}>Admin</Link>
          </>}
          {user && <div style={styles.userMenu}>
            <span style={styles.userName}>{user.name}</span>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
          </div>}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: '#1A1208', padding: '0 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' },
  inner: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' },
  logoText: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 20, color: '#fff', letterSpacing: '-0.3px' },
  links: { display: 'flex', alignItems: 'center', gap: 20 },
  link: { color: '#C8B8A8', fontSize: 14, fontWeight: 500, transition: 'color 0.15s' },
  userMenu: { display: 'flex', alignItems: 'center', gap: 10 },
  userName: { color: '#fff', fontSize: 14, fontWeight: 500 },
};

export default Navbar;
