import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { getLocaleStateFromPath } from './types';
import { loadTranslationDictionary } from './utils/runtimeTranslations';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

const bootstrap = async () => {
  const initialRouteState = getLocaleStateFromPath(window.location.pathname);
  let initialDictionary;

  try {
    initialDictionary = await loadTranslationDictionary(initialRouteState.language);
  } catch (error) {
    console.error(`Failed to load initial translations for ${initialRouteState.language}:`, error);
  }

  root.render(
    <React.StrictMode>
      <App initialDictionary={initialDictionary} initialRouteState={initialRouteState} />
    </React.StrictMode>
  );
};

void bootstrap();
