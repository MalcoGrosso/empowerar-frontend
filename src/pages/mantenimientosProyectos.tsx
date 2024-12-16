import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MantenimientosProyectos } from 'src/sections/mantenimientos/views/mantenimientosProyectos';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Mantenimientos - ${CONFIG.appName}`}</title>
      </Helmet>

      <MantenimientosProyectos />
    </>
  );
}
