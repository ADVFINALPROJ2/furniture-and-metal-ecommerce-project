import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={styles.footer}>
    <div className="container" style={styles.inner}>
      <div style={styles.brand}>
        <span style={styles.logo}>Selam Market</span>
        <p style={styles.tagline}>Furniture & Metalworks Marketplace</p>
      </div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Browse</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/register" style={styles.link}>Register</Link>
      </div>
      <p style={styles.copy}>&copy; {new Date().getFullYear()} Selam Market &mdash; SWEN224 BITS College</p>
    </div>
  </footer>
);

const styles = {
  footer: { background: '#1A1208', marginTop: 80, padding: '40px 0 24px' },
  inner: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' },
  brand: { display: 'flex', flexDirection: 'column', gap: 4 },
  logo: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, color: '#fff' },
  tagline: { color: '#8A7A6A', fontSize: 13 },
  links: { display: 'flex', gap: 24 },
  link: { color: '#C8B8A8', fontSize: 13, transition: 'color 0.15s' },
  copy: { color: '#6A5A4A', fontSize: 12, marginTop: 8 },
};

export default Footer;
