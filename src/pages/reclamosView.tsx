import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ReclamosUsuario } from 'src/sections/Reclamos/view/reclamosView';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reclamos - ${CONFIG.appName}`}</title>
      </Helmet>

      <ReclamosUsuario />
    </>
  );
}
