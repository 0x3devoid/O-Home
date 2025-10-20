
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { logger } from './utils/logger';

logger.log("index.tsx", "Application script loading.");

const rootElement = document.getElementById('root');
if (!rootElement) {
  logger.error("index.tsx", "Could not find root element to mount to. App cannot start.");
  throw new Error("Could not find root element to mount to");
}

logger.log("index.tsx", "Found root element. Creating React root.");
const root = ReactDOM.createRoot(rootElement);

logger.log("index.tsx", "Rendering App component within ErrorBoundary and StrictMode.");
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

logger.log("index.tsx", "Initial render complete.");
