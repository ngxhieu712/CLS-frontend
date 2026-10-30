import axios from 'axios';
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const http = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status as number | undefined;
    if (status === 401) {
      if (!['/login', '/register', '/forgot-password'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
