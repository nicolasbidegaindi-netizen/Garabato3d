import React from 'react';
import { createRoot } from 'react-dom/client';
import { GarabatearPage } from './GarabatearPage';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GarabatearPage />
  </React.StrictMode>
);
