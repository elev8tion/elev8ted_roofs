import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface GeocodedAddress {
  latitude: number;
  longitude: number;
  formatted_address: string;
  success: boolean;
  error?: string;
}

function App() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [geocoded, setGeocoded] = useState<GeocodedAddress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    console.log('Geocoding address:', address);

    try {
      const response = await axios.post(`${API_URL}/api/v1/address/geocode`, {
        address: address
      });

      console.log('Geocode response:', response.data);
      setGeocoded(response.data);

      if (!response.data.success && response.data.error) {
        setError(response.data.error);
      }
    } catch (err: any) {
      console.error('Error geocoding address:', err);
      setError(err.response?.data?.detail || 'Failed to geocode address');
    } finally {
      setLoading(false);
    }
  };

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
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="input"
                placeholder="123 Main St, City, State ZIP"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
                disabled={loading || !address.trim()}
              >
                {loading ? 'Locating...' : 'Find Property'}
              </button>
            </form>

            {error && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--error)',
                borderRadius: '8px',
                color: 'var(--error)'
              }}>
                ⚠️ {error}
              </div>
            )}

            {geocoded && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'var(--bg-elevated)',
                borderRadius: '12px',
                border: '1px solid var(--border-light)',
                animation: 'fadeIn 0.5s ease'
              }}>
                <h3 style={{ marginTop: 0, color: 'var(--accent-primary)' }}>
                  ✅ Property Located!
                </h3>
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                    <strong>Address:</strong> {geocoded.formatted_address}
                  </p>
                  <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                    <strong>Coordinates:</strong> {geocoded.latitude.toFixed(6)}, {geocoded.longitude.toFixed(6)}
                  </p>
                </div>

                <div style={{
                  marginTop: '1.5rem',
                  padding: '1rem',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '8px',
                  textAlign: 'center'
                }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
                    🎨 Canvas drawing feature coming next...
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    Click points on satellite image to draw roof outline
                  </p>
                </div>

                {!geocoded.success && (
                  <p style={{
                    color: 'var(--warning)',
                    fontSize: '0.85rem',
                    marginTop: '1rem',
                    padding: '0.5rem',
                    background: 'rgba(245, 158, 11, 0.1)',
                    borderRadius: '6px'
                  }}>
                    💡 Add Google Maps API key to backend/.env for real satellite imagery
                  </p>
                )}
              </div>
            )}
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
