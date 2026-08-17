import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import { PrefsProvider } from './theme/prefs.js';
import './styles.css';

const root = document.getElementById('root');
if (!root) throw new Error('#root is missing from index.html');

createRoot(root).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
);
