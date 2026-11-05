import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
import './styles/globals.css';
import App from './App';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
const container = document.getElementById('root')!;

const app = (
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Pre-rendered pages already contain markup, so hydrate them; the dev server and 404.html start empty.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
