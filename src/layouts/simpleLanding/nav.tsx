import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import { useLanguage } from 'src/context/LanguageProvider'; // Hook para acceder al idioma

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';
import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    titleEn: string;
    titleEs: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  // Hook para acceder al idioma y función para cambiarlo
  const { language } = useLanguage();
  const pathname = usePathname();


  const localizedData = data.map((item) => ({
    ...item,
    title: language === 'en' ? item.titleEn : item.titleEs, // Asumiendo que tienes 'titleEn' y 'titleEs' en tus datos
  }));

  return (
    <>
      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
                <>
                  <Scrollbar fillContent>
                    <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
                      <Box component="ul" gap={0.5} display="flex" flexDirection="column">
                        {localizedData.map((item) => {
                          const isActived = item.path === pathname;
            
                          return (
                            <ListItem disableGutters disablePadding key={item.title}>
                              <ListItemButton
                                disableGutters
                                href={item.path}
                                sx={{
                                  pl: 2,
                                  py: 1,
                                  gap: 2,
                                  pr: 1.5,
                                  borderRadius: 0.75,
                                  typography: 'body2',
                                  fontWeight: 'fontWeightMedium',
                                  color: 'var(--layout-nav-item-color)',
                                  minHeight: 'var(--layout-nav-item-height)',
                                  ...(isActived && {
                                    fontWeight: 'fontWeightSemiBold',
                                    bgcolor: 'var(--layout-nav-item-active-bg)',
                                    color: 'var(--layout-nav-item-active-color)',
                                    '&:hover': {
                                      bgcolor: 'var(--layout-nav-item-hover-bg)',
                                    },
                                  }),
                                }}
                              >
                                <Box component="span" flexGrow={1}>
                                  {item.title}
                                </Box>
                                {item.info && item.info}
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </Box>
                    </Box>
                  </Scrollbar>
                </>
          </Box>
        </Box>
      </Scrollbar>

    </>
  );
}
