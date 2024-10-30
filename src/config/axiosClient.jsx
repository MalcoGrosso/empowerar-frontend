import axios from 'axios';

const API_URL = 'http://localhost:3000/api';  // URL de tu backend

// Crear una instancia de axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Esto permite que las cookies se envíen con las solicitudes (si las usas)
});

export default api;