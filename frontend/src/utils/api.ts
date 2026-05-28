import axios from 'axios';

// Relative baseURL so requests flow through the CRA dev proxy in development
// and through the reverse proxy (Apache/Nginx) at <domain>/ctomop in prod.
// PUBLIC_URL is the subpath prefix (or "" at root) baked at build time.
const api = axios.create({
  baseURL: `${process.env.PUBLIC_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
  
  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  return config;
});

export default api;