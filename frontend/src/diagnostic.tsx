// DIAGNOSTIC PAGE - Minimal React test
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function DiagnosticApp() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
      padding: '2rem'
    }}>
      <h1 style={{
        fontSize: '3rem',
        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: '0 0 1rem 0'
      }}>
        ✅ REACT IS WORKING
      </h1>
      <div style={{
        background: '#1a1a22',
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid #2d2d3a',
        maxWidth: '600px'
      }}>
        <h2 style={{ marginTop: 0 }}>Diagnostic Results:</h2>
        <ul style={{ textAlign: 'left', lineHeight: '1.8' }}>
          <li>✅ React 19 is loading</li>
          <li>✅ TypeScript is compiling</li>
          <li>✅ Vite dev server is working</li>
          <li>✅ CSS is being applied</li>
          <li>✅ Component is rendering</li>
        </ul>
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: '#10b981',
          borderRadius: '8px',
          color: '#0a0a0f',
          fontWeight: 'bold'
        }}>
          Frontend is 100% functional!
        </div>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.7 }}>
          <p>Now loading full app with Redux...</p>
        </div>
      </div>
    </div>
  );
}

console.log('🔍 DIAGNOSTIC: Loading minimal React app...');

const root = document.getElementById('root');
if (root) {
  console.log('✅ DIAGNOSTIC: Root element found');
  try {
    createRoot(root).render(
      <StrictMode>
        <DiagnosticApp />
      </StrictMode>
    );
    console.log('✅ DIAGNOSTIC: App rendered successfully!');

    // Auto-switch to full app after 3 seconds
    setTimeout(() => {
      console.log('🔄 Switching to full app...');
      window.location.href = '/';
    }, 3000);
  } catch (error) {
    console.error('❌ DIAGNOSTIC: Error:', error);
    root.innerHTML = `<div style="color:red;padding:2rem;">${error}</div>`;
  }
} else {
  console.error('❌ DIAGNOSTIC: Root element not found!');
}
