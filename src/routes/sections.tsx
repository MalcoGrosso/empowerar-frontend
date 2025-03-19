import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import RoleProtectedRoute from 'src/components/RoleProtectedRoute'; // Importar el componente
import { AlertProvider } from 'src/context/AlertProvider';
import { UserProvider } from 'src/context/UserProvider';
import { ProyectosProvider } from 'src/context/ProyectosProvider';
import { ReclamosProvider } from 'src/context/reclamosProvider';
import { MensajeReclamosProvider } from 'src/context/mensajeReclamosProvider';
import { MantenimientosProvider } from 'src/context/mantenimientoProvider';
import { MantenimientoFormulario, MantenimientosUsuarios } from 'src/sections/mantenimientos/views';
import { MantenimientosTabla } from 'src/sections/mantenimientos/views/mantenimientoTabla';
import { MantenimientosMiUsuarioTabla } from 'src/sections/mantenimientos/views/mantenimientosMiUsuarioTabla';
import { MantenimientoAdmin } from 'src/sections/mantenimientos/views/mantenimientosAdmin/mantenimientosProyectosAdmin';
import { MantenimientosUsuariosAdmin } from 'src/sections/mantenimientos/views/mantenimientosAdmin/mantenimientosUsuariosAdmin';
import { MantenimientosTablaAdmin } from 'src/sections/mantenimientos/views/mantenimientosAdmin/mantenimientoTablaAdmin';
import { MantenimientoFormularioAdmin } from 'src/sections/mantenimientos/views/mantenimientosAdmin/mantenimientosAdmin';
import { PagosProvider } from 'src/context/pagosProvider';
import { Pagos } from 'src/sections/pagos/pagosVistaUsuario';
import { PagosAdmin } from 'src/sections/pagos/admin/pagosTablaAdmin';
import { MantenimientoVista } from '../sections/mantenimientos/views/mantenimientosVistaUsuario';






// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const LandingPage = lazy(() => import('src/pages/landingPage'));
export const ProyectoPage = lazy(() => import('src/pages/proyectos'));
export const ProyectosVistaDetalle = lazy(() => import('src/pages/proyectosVistaDetalle')); // Importar el nuevo componente
export const ReclamosView = lazy(() => import('src/pages/reclamosView'));
export const ReclamosVistaDetalle = lazy(() => import('src/pages/reclamosVistaDetalle'));
export const MantenimientosProyectos = lazy(() => import('src/pages/mantenimientosProyectos'));


// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      path: 'landing',
      element: <LandingPage />,
    },
    {
      path: '*',
      element: <Navigate to="/landing" replace />,
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: 'dashboard',
      element: (
        <RoleProtectedRoute allowedRoles={['administrador', 'usuario', 'electricista']}> {/* Roles permitidos */}
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </RoleProtectedRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        { 
          path: 'user', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <UserProvider>
                <UserPage /> 
              </UserProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'proyectos', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <ProyectosProvider>
                <ProyectoPage /> 
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'proyectos/detalles/:id',  // Ruta para los detalles del proyecto
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <ProyectosProvider>
                <Suspense fallback={renderFallback}>
                  <ProyectosVistaDetalle />  {/* Componente para mostrar detalles del proyecto */}
                </Suspense>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'reclamos', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador', 'usuario']}>
              <ReclamosProvider>
                <ReclamosView /> 
              </ReclamosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'reclamos/detalle/:id',  // Ruta para los detalles del proyecto
          element: (
            <RoleProtectedRoute allowedRoles={['administrador', 'usuario']}>
              
              <ReclamosProvider>
                <UserProvider>
                  <MensajeReclamosProvider>
                    <Suspense fallback={renderFallback}>
                      <ReclamosVistaDetalle />  {/* Componente para mostrar detalles del proyecto */}
                    </Suspense>
                  </MensajeReclamosProvider>
                </UserProvider>
              </ReclamosProvider>
              
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientos', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador','usuario','electricista']}>
              <MantenimientosProvider>
                <MantenimientosProyectos /> 
              </MantenimientosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientos/detalles/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador','usuario','electricista']}>
              <ProyectosProvider>
                <MantenimientosUsuarios /> 
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientos/detalles/:id/tabla/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador','usuario','electricista']}>
              <ProyectosProvider>
                <MantenimientosProvider>
                  <AlertProvider>
                  <MantenimientosTabla />
                  </AlertProvider> 
                </MantenimientosProvider>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientos/detalles/:id/tabla/:id/crearMantenimiento', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador','usuario','electricista']}>
              <ProyectosProvider>
                <MantenimientosProvider>
                  <MantenimientoFormulario /> 
                </MantenimientosProvider>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientos/detalles/:id/tabla/:id/ver/:id/:mantenimientoId', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador','usuario','electricista']}>
              <ProyectosProvider>
                <MantenimientosProvider>
                  <MantenimientoFormulario /> 
                </MantenimientosProvider>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientos/detalles/:id/tabla/:id/editarMantenimiento/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador','usuario','electricista']}>
              <ProyectosProvider>
                <MantenimientosProvider>
                  <MantenimientoFormulario /> 
                </MantenimientosProvider>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientos/usuarioLogueado', 
          element: (
            <RoleProtectedRoute allowedRoles={['usuario']}>
                <MantenimientosProvider>
                  <MantenimientosMiUsuarioTabla /> 
                </MantenimientosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientos/usuarioLogueado/vista/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['usuario']}>
                <MantenimientosProvider>
                  <MantenimientoVista /> 
                </MantenimientosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientosAdmin', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
                <ProyectosProvider>
                  <MantenimientoAdmin /> 
                </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientosAdmin/detalles/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <ProyectosProvider>
                <MantenimientosUsuariosAdmin /> 
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientosAdmin/detalles/:id/tabla/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <ProyectosProvider>
                <MantenimientosProvider>
                  <AlertProvider>
                  <MantenimientosTablaAdmin />
                  </AlertProvider> 
                </MantenimientosProvider>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientosAdmin/detalles/:id/tabla/:id/verAdmin/:id/:mantenimientoId', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <ProyectosProvider>
                <MantenimientosProvider>
                  <MantenimientoFormularioAdmin /> 
                </MantenimientosProvider>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'mantenimientosAdmin/detalles/:id/tabla/:id/editarMantenimientoAdmin/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <ProyectosProvider>
                <MantenimientosProvider>
                  <MantenimientoFormularioAdmin /> 
                </MantenimientosProvider>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'pagos', 
          element: (
            <RoleProtectedRoute allowedRoles={['usuario']}>
                <PagosProvider>
                  <Pagos /> 
                </PagosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'pagosAdmin', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
                <ProyectosProvider>
                  <MantenimientoAdmin /> 
                </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'pagosAdmin/detalles/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <ProyectosProvider>
                <MantenimientosUsuariosAdmin /> 
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { 
          path: 'pagosAdmin/detalles/:id/tabla/:id', 
          element: (
            <RoleProtectedRoute allowedRoles={['administrador']}>
              <ProyectosProvider>
                <PagosProvider>
                  <AlertProvider>
                  <PagosAdmin />
                  </AlertProvider> 
                </PagosProvider>
              </ProyectosProvider>
            </RoleProtectedRoute>
          )
        },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: '404',
      element: <Page404 />, // Página de acceso no autorizado
    },
  ]);
}
