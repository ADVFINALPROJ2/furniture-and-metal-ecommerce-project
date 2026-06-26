import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: BASE_URL });

export const imgUrl = (path, fallback = 'https://via.placeholder.com/300x200?text=No+Image') =>
  path ? `${BASE_URL}${path}` : fallback;

export default api;
