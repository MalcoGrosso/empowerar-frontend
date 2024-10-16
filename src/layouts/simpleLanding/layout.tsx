import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import { useState } from 'react';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { useLanguage } from 'src/context/LanguageProvider'; // Hook para acceder al idioma

import { Main, CompactContent } from './main';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { MenuButton } from '../components/menu-button';
import { NavMobile } from './nav';
import { navData } from './components/dataDash';
import { _workspaces } from '../config-nav-workspace';

// ----------------------------------------------------------------------

export type SimpleLandingLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
  content?: {
    compact?: boolean;
  };
};

export function SimpleLandingLayout({ sx, children, header, content }: SimpleLandingLayoutProps) {
  const layoutQuery: Breakpoint = 'md';
  const theme = useTheme();
  const [navOpen, setNavOpen] = useState(false);

  // Hook para acceder al idioma y función para cambiarlo
  const { language } = useLanguage();

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Textos basados en el idioma seleccionado
  const texts = {
    home: language === 'es' ? 'Inicio' : 'Home',
    ourMission: language === 'es' ? 'Nuestra Misión' : 'Our Mission',
    howItWorks: language === 'es' ? 'Cómo Funciona' : 'How it Works',
    aboutUs: language === 'es' ? 'Sobre Nosotros' : 'About Us',
    testimonials: language === 'es' ? 'Testimonios' : 'Testimonials',
    contact: language === 'es' ? 'Contacto' : 'Contact',
  };

  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{ container: { maxWidth: false } }}
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
                  data={navData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  workspaces={_workspaces}
                />
              </>
            ),
            centerArea: (
              <Box display="flex" alignItems="center">
                <img
                  src="/assets/landing/EMPOWERAR.png"
                  alt="Logo"
                  style={{ width: '40px', height: '40px', marginRight: '8px' }}
                />
                <Typography>empowerar</Typography>
              </Box>
            ),
            rightArea: (
              <>
                <Box
                  sx={{
                    ml: -1,
                    [theme.breakpoints.down(layoutQuery)]: { display: 'none' },
                  }}
                >
                  <a
                    href="#home"
                    onClick={(e) => scrollToSection(e, 'home')}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {texts.home} 
                  </a>
                  <> / </>
                  <a
                    href="#ourMission"
                    onClick={(e) => scrollToSection(e, 'ourMission')}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {texts.ourMission} 
                  </a>
                  <> / </>
                  <a
                    href="#howItWorks"
                    onClick={(e) => scrollToSection(e, 'howItWorks')}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {texts.howItWorks} 
                  </a>
                  <> / </>
                  <a
                    href="#aboutUs"
                    onClick={(e) => scrollToSection(e, 'aboutUs')}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {texts.aboutUs} 
                  </a>
                  <> / </>
                  <a
                    href="#testimonials"
                    onClick={(e) => scrollToSection(e, 'testimonials')}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    {texts.testimonials} 
                  </a>
                  <> / </>
                  <a
                    href="#contact"
                    onClick={(e) => scrollToSection(e, 'contact')}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      fontSize: '1rem',
                      marginRight: '40px',
                      fontWeight: 'bold',
                    }}
                  >
                    {texts.contact}
                  </a>
                </Box>
              </>
            ),
          }}
        />
      }
      footerSection={null}
      cssVars={{
        '--layout-simple-content-compact-width': '448px',
      }}
      sx={sx}
    >
      <Main>
        {content?.compact ? (
          <CompactContent layoutQuery={layoutQuery}>{children}</CompactContent>
        ) : (
          children
        )}
      </Main>
    </LayoutSection>
  );
}
