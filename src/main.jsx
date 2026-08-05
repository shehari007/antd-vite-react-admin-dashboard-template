import React from 'react';
import ReactDOM from 'react-dom/client';
// Self hosted so the first paint does not wait on fonts.googleapis.com, which
// also keeps the app working offline and avoids sending visitor IP addresses to
// a third party.
import '@fontsource-variable/inter';
import App from './App.jsx';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ThemeModeProvider } from '@/context/ThemeModeContext.jsx';
import { AuthProvider } from '@/context/AuthContext.jsx';
import '@/i18n';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeModeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeModeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
