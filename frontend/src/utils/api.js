import axios from 'axios';

// Centralized API configuration — single axios instance shared across all frontend pages.
// Reads backend URL from env var, falls back to localhost for development.
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: BASE_URL });

// Generates full image URL from relative path; shows placeholder if missing.
export const imgUrl = (path, fallback = 'https://via.placeholder.com/300x200?text=No+Image') =>
  path ? `${BASE_URL}${path}` : fallback;

export default api;
