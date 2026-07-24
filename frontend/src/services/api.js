import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add bearer token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (credentials) => axios.post(`${API_BASE_URL}/auth/login`, credentials),
  register: (data) => axios.post(`${API_BASE_URL}/auth/register`, data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (formData) => api.put('/auth/profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const eventsAPI = {
  getAll: () => api.get('/events'),
  create: (formData) => api.post('/events', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/events/${id}`),
};

export const partyAPI = {
  register: (preferences) => api.post('/party/register', preferences),
  getStatus: () => api.get('/party/status'),
  getAllRegistrations: () => api.get('/party/registrations'),
  saveWishlist: (song) => api.post('/party/wishlist', { song }),
  getWishlist: () => api.get('/party/wishlist'),
};

export const facultyAPI = {
  getAll: () => api.get('/faculty'),
  create: (formData) => api.post('/faculty', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/faculty/${id}`),
};

export const departmentsAPI = {
  getAll: () => api.get('/departments'),
};

export const announcementsAPI = {
  getAll: () => api.get('/announcements'),
  create: (data) => api.post('/announcements', data),
};

export const clubsAPI = {
  getAll: () => api.get('/clubs'),
  register: (clubName) => api.post('/clubs/register', { clubName })
};

export const resourcesAPI = {
  getAll: () => api.get('/resources'),
  upload: (formData) => api.post('/resources', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const feedbackAPI = {
  submit: (data) => api.post('/feedback', data),
  getAll: () => api.get('/feedback'),
};

export const chatAPI = {
  sendMessage: (message, history) => api.post('/chat', { message, history }),
  getHistory: () => api.get('/chat/history'),
};

export default {
  auth: authAPI,
  events: eventsAPI,
  party: partyAPI,
  faculty: facultyAPI,
  departments: departmentsAPI,
  announcements: announcementsAPI,
  clubs: clubsAPI,
  resources: resourcesAPI,
  feedback: feedbackAPI,
  chat: chatAPI,
};
