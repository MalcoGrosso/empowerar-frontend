import api from '../config/axiosClient'




// Interceptor para agregar token en los headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');  // Obtén el token del localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Función para iniciar sesión
export const loginUser = async (credentials: { email: string; password: string }) => {
  const response = await api.post('/login', credentials);
  const { token } = response.data;
  localStorage.setItem('token', token);  // Guardar el token en el localStorage
  return response.data;
};

// Función para obtener el perfil del usuario
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};