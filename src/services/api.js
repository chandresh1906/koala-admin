import axios from 'axios';

const api = axios.create({
  baseURL: 'https://koala-server-jh8n.onrender.com', // Assuming JSON Server runs on port 8000
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;