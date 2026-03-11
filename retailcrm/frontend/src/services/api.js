import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Attach JWT to every request automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(null, err => {
  if (err.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(err);
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const customerService = {
  list: (page, tag) => api.get('/customers', { params: { page, tag } }),
  get: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (q) => api.get('/customers/search', { params: { q } }),
};

export const interactionService = {
  list: (customerId, page) => api.get(`/customers/${customerId}/interactions`, { params: { page } }),
  create: (customerId, data) => api.post(`/customers/${customerId}/interactions`, data),
};

export const reminderService = {
  list: () => api.get('/reminders'),
  create: (data) => api.post('/reminders', data),
  complete: (id) => api.put(`/reminders/${id}/complete`),
};

export const analyticsService = {
  summary: () => api.get('/analytics/summary'),
  segments: () => api.get('/analytics/segments'),
};

export default api;
