import axios from 'axios';

const BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

// Add JWT access token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle expired access token
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh_token')
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh_token');

        const response = await axios.post(
          `${BASE_URL}/auth/refresh/`,
          { refresh }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem('access_token', newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        window.location.href = '/login';

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// Login
export const login = (username, password) =>
  api.post('/auth/login/', {
    username,
    password,
  });


// Register
export const register = (username, email, password, password2) =>
  api.post('/auth/register/', {
    username,
    email,
    password,
    password2,
  });


// Current user
export const fetchMe = () =>
  api.get('/auth/me/');


// Contacts
export const fetchContacts = (search = '') =>
  api.get('/contacts/', {
    params: search ? { search } : {},
  });

export const fetchContact = (id) =>
  api.get(`/contacts/${id}/`);

export const createContact = (payload) =>
  api.post('/contacts/', payload);

export const updateContact = (id, payload) =>
  api.put(`/contacts/${id}/`, payload);

export const deleteContact = (id) =>
  api.delete(`/contacts/${id}/`);

export default api;