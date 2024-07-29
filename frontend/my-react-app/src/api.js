import axios from 'axios';

// Usa la variable de entorno con el prefijo VITE_
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // URL del backend Flask desde la variable de entorno
});

export default api;


