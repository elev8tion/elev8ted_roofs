import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App-simple-working.tsx'

console.log('🚀 Elev8ted Roofs - Loading Application...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
} else {
  console.log('✅ Initializing React app...');

  try {
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
    console.log('✅ Application loaded successfully!');
  } catch (error: any) {
    console.error('❌ Error loading application:', error);
    rootElement.innerHTML = `
      <div style="background: #0a0a0f; color: white; padding: 2rem; min-height: 100vh;">
        <h1 style="color: #ef4444;">Application Error</h1>
        <pre style="color: #f59e0b;">${error.message}</pre>
      </div>
    `;
  }
}
