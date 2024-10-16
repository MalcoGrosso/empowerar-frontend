import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    titleEn: 'Home',
    titleEs: 'Inicio',
    path: '#home',
    icon: icon('ic-user'),
  },
  {
    titleEn: 'Our Mission',
    titleEs: 'Nuestra Misión',
    path: '#ourMission',
    icon: icon('ic-user'),
  },
  {
    titleEn: 'How it Works',
    titleEs: 'Cómo Funciona',
    path: '#howItWorks',
    icon: icon('ic-user'),
  },
  {
    titleEn: 'About Us',
    titleEs: 'Sobre Nosotros',
    path: '#aboutUs',
    icon: icon('ic-blog'),
  },
  {
    titleEn: 'Testimonials',
    titleEs: 'Testimonios',
    path: '#testimonials',
    icon: icon('ic-lock'),
  },
  {
    titleEn: 'Contact',
    titleEs: 'Contacto',
    path: '#contact',
    icon: icon('ic-disabled'),
  },
];
