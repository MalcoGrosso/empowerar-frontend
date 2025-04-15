import axios from 'axios';


// Crear una instancia de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Esto permite que las cookies se envíen con las solicitudes (si las usas)
});

export default api;