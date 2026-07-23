import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Call the refresh endpoint directly to avoid circular dependency with authService
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken
        });
        
        const { access_token, refresh_token: new_refresh_token } = response.data.data;
        
        localStorage.setItem('access_token', access_token);
        if (new_refresh_token) {
           localStorage.setItem('refresh_token', new_refresh_token);
        }
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or invalid, log out
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('auth-unauthorized'));
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
