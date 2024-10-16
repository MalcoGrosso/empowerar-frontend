import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { NotFoundView } from 'src/sections/error';

import { LandingPage } from 'src/sections/landingPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Landing Page - ${CONFIG.appName}`}</title>
      </Helmet>

      <LandingPage/>
    </>
  );
}