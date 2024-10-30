import { useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'src/routes/hooks'; // Asegúrate de que la importación sea correcta
import CryptoJS from 'crypto-js'; // Importar CryptoJS

interface TokenPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  exp: number; // Expiración del token
}

const secret = import.meta.env.VITE_PASS_SECRETA || '';

export const useAuth = () => {
  const router = useRouter(); // Obtener el router para redireccionar
  const encryptedToken = localStorage.getItem('token'); // Obtener el token encriptado

  const logout = useCallback(() => {
    // Eliminar el token del localStorage
    localStorage.removeItem('token');
    // Redirigir al usuario a la página de inicio de sesión
    router.push('/sign-in');
  }, [router]);

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true; // Sin token, consideramos que ha expirado
    const decryptedToken = CryptoJS.AES.decrypt(token, secret).toString(CryptoJS.enc.Utf8);
    const payload = JSON.parse(atob(decryptedToken.split('.')[1]));
    return payload.exp < Date.now() / 1000; // Comprueba si ha pasado la fecha de expiración
  };

  if (!encryptedToken || isTokenExpired(encryptedToken)) {
    logout(); // Llama a la función de logout si no hay token o si ha expirado
    return { role: null, firstName: null, lastName: null, email: null, logout };  // Si no hay token
  }

  try {
    // Desencriptar el token
    const decryptedToken = CryptoJS.AES.decrypt(encryptedToken, secret).toString(CryptoJS.enc.Utf8);

    // Decodificar el token desencriptado
    const decodedToken = jwtDecode<TokenPayload>(decryptedToken);
    return { 
      role: decodedToken.role, 
      firstName: decodedToken.firstName, 
      lastName: decodedToken.lastName,
      email: decodedToken.email,
      logout 
    }; // Extraer los datos del token decodificado
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return { role: null, firstName: null, lastName: null, email: null, logout }; // Si hay error
  }
};
