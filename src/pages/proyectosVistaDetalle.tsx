import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProyectosVistaDetalle } from 'src/sections/Proyectos/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Detalle Proyecto - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProyectosVistaDetalle />
    </>
  );
}
