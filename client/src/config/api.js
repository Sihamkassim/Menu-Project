import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redirect to login if we get 401 on protected routes
    if (error.response?.status === 401) {
      // Don't redirect if already on login page
      if (!window.location.pathname.includes('/admin/login')) {
        localStorage.removeItem('token');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

// Menu API
export const menuAPI = {
  getAll: (params) => api.get('/menu', { params }),
  getById: (id) => api.get(`/menu/${id}`),
  getCategories: () => api.get('/menu/categories'),
  create: (data) => api.post('/menu', data),
  update: (id, data) => api.put(`/menu/${id}`, data),
  delete: (id) => api.delete(`/menu/${id}`),
};

// Order API
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  getByOrderNumber: (orderNumber) => api.get(`/orders/tracking/${orderNumber}`),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  delete: (id) => api.delete(`/orders/${id}`),
  getStats: () => api.get('/orders/stats'),
};

export default api;
