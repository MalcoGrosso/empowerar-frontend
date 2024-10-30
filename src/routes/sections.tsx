import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import RoleProtectedRoute from 'src/components/RoleProtectedRoute'; // Importar el componente
import { UserProvider } from 'src/context/UserProvider';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const LandingPage = lazy(() => import('src/pages/landingPage'));
export const ProyectoPage = lazy(() => import('src/pages/proyectos'));


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
        <RoleProtectedRoute allowedRoles={['administrador', 'usuario']}> {/* Roles permitidos */}
          <DashboardLayout>
            <Suspense fallback={renderFallback}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </RoleProtectedRoute>
      ),
      children: [
        { element: <HomePage />, index: true },
        { path: 'user', element:(
          
          <RoleProtectedRoute allowedRoles={['administrador']}>
            <UserProvider>
                <UserPage /> 
            </UserProvider>
            
          </RoleProtectedRoute>
        
        
        
        )
        },
        { path: 'proyectos', element:(
          
          <RoleProtectedRoute allowedRoles={['administrador']}>
            <UserProvider>
                <ProyectoPage /> 
            </UserProvider>
            
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