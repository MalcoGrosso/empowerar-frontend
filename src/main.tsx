import ReactDOM from 'react-dom/client';
import { Suspense, StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './app';
import { LanguageProvider } from './context/LanguageProvider';
import { AlertProvider } from './context/AlertProvider';

import { LandingDataProvider } from './context/LandingDataProvider';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense>
          <AlertProvider>
          <LanguageProvider>
            <LandingDataProvider>
          <App />
            </LandingDataProvider>
          </LanguageProvider>
          </AlertProvider>
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);
