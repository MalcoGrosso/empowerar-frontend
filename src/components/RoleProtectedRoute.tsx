/* eslint-disable react/prop-types */

import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/hooks/useAuth';  // Asegúrate de ajustar la ruta

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];  // Roles permitidos para acceder a la ruta
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { role } = useAuth();
  if (!role) {
    // Si no hay rol, redirigimos a la página de login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    // Si el rol no está permitido, redirigimos a una página de error o no autorizado
    return <Navigate to="/404" />;
  }

  // Si el rol es válido, renderizamos la ruta protegida
  return <>{children}</>;
};

export default RoleProtectedRoute;
