import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './lib/webpush';

// Register Service Worker for Web Push in background
registerServiceWorker();

// Gracefully handle dynamic import chunk errors caused by Vite HMR or deployments
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
