import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Ubah jika backend dideploy di tempat lain
});

// Interceptor untuk menyisipkan token JWT otomatis ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
