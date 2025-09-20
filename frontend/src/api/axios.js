import axios from 'axios';

// 1. 👇 PASTE YOUR DEPLOYED BACKEND URL HERE
//    Make sure it includes the '/api' at the end.
const DEPLOYED_URL = 'https://secure-print-app-1-0.onrender.com';

// 2. Update the baseURL for the main 'api' instance
const api = axios.create({
  baseURL: DEPLOYED_URL,
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

// 3. Also update the baseURL for the separate 'printApi' instance
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
