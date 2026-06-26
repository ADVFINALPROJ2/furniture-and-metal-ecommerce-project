import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/shared/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import SellerDashboard from './pages/SellerDashboard';
import ProductForm from './pages/ProductForm';
import MyOrders from './pages/MyOrders';
import Admin from './pages/Admin';
import './index.css';

// Route guard that redirects unauthenticated users to login
// and enforces role-based access (buyer, seller, admin).
const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/orders" element={<ProtectedRoute role="buyer"><MyOrders /></ProtectedRoute>} />
      <Route path="/seller/dashboard" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
      <Route path="/seller/products/new" element={<ProtectedRoute role="seller"><ProductForm /></ProtectedRoute>} />
      <Route path="/seller/products/:id/edit" element={<ProtectedRoute role="seller"><ProductForm /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
