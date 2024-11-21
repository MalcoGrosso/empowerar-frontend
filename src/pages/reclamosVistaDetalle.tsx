import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ReclamosVistaDetalle } from 'src/sections/Reclamos/view/reclamosVistaDetalle';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reclamos - ${CONFIG.appName}`}</title>
      </Helmet>

      <ReclamosVistaDetalle />
    </>
  );
}
