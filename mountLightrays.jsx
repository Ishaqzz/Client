import React from 'react';
import ReactDOM from 'react-dom/client';
import LightRays from './lightrays.jsx';

const rootElement = document.getElementById('lightrays-root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <LightRays
        raysOrigin="top-center"
        raysColor="#60a5fa"
        raysSpeed={1}
        lightSpread={1}
        rayLength={2}
        pulsating={true}
        followMouse={true}
        mouseInfluence={0.2}
      />
    </React.StrictMode>
  );
}
