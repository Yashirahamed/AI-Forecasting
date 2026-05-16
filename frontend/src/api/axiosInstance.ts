import axios from 'axios';
import { auth } from '../firebase/firebaseConfig';

// Axios instance with base URL and automatic Firebase ID token injection
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to add the Firebase ID token to the Authorization header
axiosInstance.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle 401 Unauthorized errors (e.g., expired token)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle session expiration
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
