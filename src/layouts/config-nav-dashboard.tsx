import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Menu Principal',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Usuarios',
    path: '/dashboard/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Proyectos',
    path: '/dashboard/Proyectos',
    icon: icon('ic-folder'),
  },
  // {
  //   title: 'Product',
  //   path: '/dashboard/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },
  // {
  //   title: 'Blog',
  //   path: '/dashboard/blog',
  //   icon: icon('ic-blog'),
  // },
  
  {
    title: 'Reclamos',
    path: '/dashboard/Reclamos',
    icon: icon('ic-book'),
  },

  {
    title: 'Mantenimientos',
    path: '/dashboard/Mantenimientos',
    icon: icon('ic-note'),
  },

  {
    title: 'Mantenimiento',
    path: '/dashboard/mantenimientos/usuarioLogueado',
    icon: icon('ic-note'),
  },

  {
    title: 'MantenimientoAdmin',
    path: '/dashboard/mantenimientosAdmin',
    icon: icon('ic-note'),
  },

  {
    title: 'Pagos',
    path: '',
    icon: icon('ic-payment'),
  },
  
  

  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
  // {
  //   title: 'Landing Page',
  //   path: '/landing',
  //   icon: icon('ic-disabled'),
  // },
];
