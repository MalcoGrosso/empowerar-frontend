import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProyectosView } from 'src/sections/Proyectos/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Proyectos - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProyectosView />
    </>
  );
}
