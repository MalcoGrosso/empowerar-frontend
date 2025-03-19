import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { useAuth } from 'src/hooks/useAuth'; // Importar useAuth
import { _langs, _notifications } from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { navData as navDataConfig } from '../config-nav-dashboard';  // Importar la estructura base de navData
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { LanguagePopover } from '../components/language-popover';
import { NotificationsPopover } from '../components/notifications-popover';

// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const { role, id } = useAuth();  // Llamamos a useAuth aquí
  const [navOpen, setNavOpen] = useState(false);

  const layoutQuery: Breakpoint = 'lg';

  const navData = navDataConfig.filter((item) => {
    // Ocultar ciertas rutas basadas en el rol
    if (role === 'usuario' && (item.title === 'Proyectos' || item.title === 'Usuarios' || item.title === 'Mantenimientos' || item.title === 'MantenimientoAdmin' || item.title === 'PagosAdmin')) {
      return false; // No mostrar estas rutas si el rol es 'usuario'
    }
  
    if (role === 'electricista' && (item.title === 'Mantenimiento' || item.title === 'MantenimientoAdmin' || item.title === 'Proyectos' || item.title === 'Usuarios' || item.title === 'Reclamos' )) {
      return false; // No mostrar la ruta de 'Mantenimiento' si el rol es 'electricista'
    }

    if (role === 'administrador' && (item.title === 'Mantenimiento' || item.title === 'Mantenimientos' || item.title === 'Pagos' )) {
      return false; // No mostrar la ruta de 'Mantenimiento' si el rol es 'electricista'
    }
  
    return true;
  }).map((item) => {
    // Cambiar dinámicamente el path de acuerdo al rol
    if (role === 'administrador' && item.title === 'MantenimientoAdmin') {
      return { ...item, title: 'Mantenimientos' };
    }

    if (role === 'usuario' && item.title === 'Mantenimiento') {
      return { ...item, title: 'Mantenimientos' };
    }

    if (role === 'usuario' && item.title === 'Mantenimiento') {
      return { ...item, path: '/dashboard/mantenimientos/usuarioLogueado' };
    }
  
    if (role === 'electricista' && item.title === 'Mantenimientos') {
      return { ...item, path: '/dashboard/Mantenimientos' };
    }

    if (role === 'administrador' && item.title === 'MantenimientosAdmin') {
      return { ...item, path: '/dashboard/mantenimientosAdmin' };
    }

    if (role === 'administrador' && item.title === 'PagosAdmin') {
      return { ...item, title: 'Pagos' };
    }
  
  
    return item; // Retornar el ítem sin cambios si no se aplica ningún ajuste
  });

  console.log('sdsdds',navData);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={navData}  // Aquí pasamos el navData filtrado
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  workspaces={_workspaces}
                />
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <AccountPopover />
              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={navData} layoutQuery={layoutQuery} workspaces={_workspaces} />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
