import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { OfflineBanner } from './app/OfflineBanner';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="agrilens-theme">
      <ToastProvider>
        <OfflineBanner />
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
