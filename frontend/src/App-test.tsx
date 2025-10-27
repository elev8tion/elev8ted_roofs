import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import { setAddress } from './store/roofSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { address } = useSelector((state: RootState) => state.roof);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <h1>ELEV8TED ROOFS</h1>
            <p className="tagline">AI-Powered Roof Estimation</p>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="address-section fade-in">
          <div className="card address-card">
            <h2>Enter Property Address</h2>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
              Enter the address to begin your roof estimation
            </p>
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                className="input"
                placeholder="123 Main St, City, State ZIP"
                value={address}
                onChange={(e) => dispatch(setAddress(e.target.value))}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                Find Property
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Elev8ted Roofs | AI-Powered Roofing Estimations</p>
      </footer>
    </div>
  );
}

export default App;
