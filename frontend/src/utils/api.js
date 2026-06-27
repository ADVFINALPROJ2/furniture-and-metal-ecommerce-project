import axios from 'axios';

// Centralized API configuration — single axios instance shared across all frontend pages.
// Reads backend URL from env var, falls back to localhost for development.
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: BASE_URL });

export const imgUrl = (path, fallback = 'https://via.placeholder.com/300x200?text=No+Image') => {
  if (!path) return fallback;
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

export default api;
