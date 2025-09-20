import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // The proxy will handle this
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    config.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return config;
});

export default api;

// A separate instance for print sessions
export const printApi = axios.create({
  baseURL: '/api',
});

printApi.interceptors.request.use((config) => {
  const sessionToken = localStorage.getItem('printSessionToken');
  if (sessionToken) {
    config.headers.Authorization = `Bearer ${sessionToken}`;
  }
  return config;
});