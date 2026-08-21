import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3333/api',
});

// Interceptor para injetar o token JWT automaticamente em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@StockSync:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
