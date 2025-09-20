import axios from 'axios';

// The corrected URL with the '/api' prefix
const DEPLOYED_URL = 'https://secure-print-app-1-0.onrender.com/api';

const api = axios.create({
  baseURL: DEPLOYED_URL,
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    config.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return config;
});

export default api;

export const printApi = axios.create({
  baseURL: DEPLOYED_URL,
});

printApi.interceptors.request.use((config) => {
  const sessionToken = localStorage.getItem('printSessionToken');
  if (sessionToken) {
    config.headers.Authorization = `Bearer ${sessionToken}`;
  }
  return config;
});
