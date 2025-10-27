import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import AddressAutocomplete from './components/AddressAutocomplete';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface GeocodedAddress {
  latitude: number;
  longitude: number;
  formatted_address: string;
  success: boolean;
  error?: string;
}

interface Point {
  x: number;
  y: number;
}

function App() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiDetecting, setAiDetecting] = useState(false);
  const [geocoded, setGeocoded] = useState<GeocodedAddress | null>(null);
  const [satelliteImage, setSatelliteImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [measurement, setMeasurement] = useState<any>(null);
  const [costEstimate, setCostEstimate] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    setLoading(true);
    setError(null);
    setPoints([]);
    setMeasurement(null);
    setCostEstimate(null);
    setShowResults(false);
    setSatelliteImage(null);

    try {
      // Step 1: Geocode the address
      console.log('🔍 Geocoding address:', address);
      const geocodeResponse = await axios.post(`${API_URL}/api/v1/address/geocode`, {
        address: address
      });

      console.log('✅ Geocode response:', geocodeResponse.data);
      setGeocoded(geocodeResponse.data);

      if (!geocodeResponse.data.success && geocodeResponse.data.error) {
        setError(geocodeResponse.data.error);
        setLoading(false);
        return;
      }

      // Step 2: Fetch satellite image
      console.log('🛰️ Fetching satellite image...');
      const satelliteResponse = await axios.post(`${API_URL}/api/v1/satellite/image`, {
        latitude: geocodeResponse.data.latitude,
        longitude: geocodeResponse.data.longitude,
        zoom: 20,
        width: 800,
        height: 600
      });

      if (!satelliteResponse.data.success) {
        console.log('⚠️ Satellite image not available:', satelliteResponse.data.error);
        setError(satelliteResponse.data.error || 'Unable to fetch satellite imagery');
        setLoading(false);
        // Still show the canvas for manual drawing
        return;
      }

      console.log('✅ Satellite image received');
      setSatelliteImage(satelliteResponse.data.image_base64);

      // Step 3: AI Roof Detection
      setLoading(false);
      setAiDetecting(true);
      console.log('🤖 Starting AI roof detection...');

      try {
        const roofResponse = await axios.post(`${API_URL}/api/v1/roof/detect`, {
          latitude: geocodeResponse.data.latitude,
          longitude: geocodeResponse.data.longitude,
          image_base64: satelliteResponse.data.image_base64
        });

        console.log('✅ AI detected roof:', roofResponse.data);

        if (roofResponse.data.success && roofResponse.data.polygon_points) {
          // Convert normalized coordinates to canvas coordinates
          const canvasPoints = roofResponse.data.polygon_points.map((p: any) => ({
            x: p.x * 800,
            y: p.y * 600
          }));
          setPoints(canvasPoints);
          console.log('✅ Roof outline auto-populated with', canvasPoints.length, 'points');
        } else {
          console.log('⚠️ AI detection returned no points, manual drawing enabled');
        }
      } catch (aiError: any) {
        console.log('⚠️ AI detection failed, manual drawing enabled:', aiError.message);
      }

    } catch (err: any) {
      console.error('❌ Error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to process address');
    } finally {
      setLoading(false);
      setAiDetecting(false);
    }
  };

  const handleCalculate = async () => {
    if (points.length < 3) {
      setError('Draw at least 3 points to create a polygon');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const measurementRes = await axios.post(`${API_URL}/api/v1/measurement/calculate`, {
        points: points,
        scale_factor: 0.3,
        building_type: 'residential'
      });
      setMeasurement(measurementRes.data);

      const costRes = await axios.post(`${API_URL}/api/v1/measurement/estimate-cost`, {
        area_sq_ft: measurementRes.data.area_sq_ft,
        pitch_degrees: measurementRes.data.estimated_pitch,
        has_damage: false
      });
      setCostEstimate(costRes.data);
      setShowResults(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPoints([]);
    setMeasurement(null);
    setCostEstimate(null);
    setShowResults(false);
    setGeocoded(null);
    setSatelliteImage(null);
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
        {/* Address Input */}
        {!geocoded && (
          <div className="address-section fade-in">
            <div className="card address-card">
              <h2>Enter Property Address</h2>
              <p style={{ color: 'var(--text-tertiary)', marginBottom: '2rem' }}>
                AI will automatically detect the roof from satellite imagery
              </p>
              <form onSubmit={handleSubmit}>
                <AddressAutocomplete
                  value={address}
                  onChange={setAddress}
                  onSelect={(selectedAddress) => {
                    setAddress(selectedAddress);
                    // Auto-submit when address is selected from dropdown
                    setTimeout(() => {
                      const form = document.querySelector('form');
                      if (form) form.requestSubmit();
                    }, 100);
                  }}
                  disabled={loading}
                  placeholder="Start typing an address..."
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ marginTop: '1rem' }}
                  disabled={loading || !address.trim()}
                >
                  {loading ? '🔍 Analyzing...' : 'Find Property'}
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
            </div>
          </div>
        )}

        {/* Canvas Drawing with AI Detection */}
        {geocoded && !showResults && (
          <div className="drawing-section fade-in">
            <div className="drawing-header">
              <div>
                <h3>
                  {aiDetecting ? '🤖 AI Detecting Roof...' :
                   points.length > 0 ? '✅ Roof Detected - Review & Calculate' :
                   '✏️ Draw Roof Outline'}
                </h3>
                <p className="text-muted" style={{ color: 'var(--text-tertiary)' }}>
                  {geocoded.formatted_address}
                </p>
              </div>
              <div className="drawing-controls">
                <button className="btn btn-secondary" onClick={handleClear}>
                  Start Over
                </button>
                {points.length > 0 && (
                  <button
                    className="btn btn-primary"
                    onClick={handleCalculate}
                    disabled={points.length < 3 || loading}
                  >
                    {loading ? 'Calculating...' : `Calculate (${points.length} points)`}
                  </button>
                )}
              </div>
            </div>

            <div className="canvas-container card">
              <RoofCanvas
                points={points}
                onPointAdd={(point) => setPoints([...points, point])}
                onPointMove={(index, point) => {
                  const newPoints = [...points];
                  newPoints[index] = point;
                  setPoints(newPoints);
                }}
                latitude={geocoded.latitude}
                longitude={geocoded.longitude}
                satelliteImage={satelliteImage}
              />
            </div>

            {aiDetecting && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(99, 102, 241, 0.1)',
                border: '1px solid var(--accent-primary)',
                borderRadius: '8px',
                color: 'var(--accent-primary)',
                textAlign: 'center'
              }}>
                🤖 AI is analyzing the satellite image and detecting the roof outline...
              </div>
            )}

            {points.length > 0 && !aiDetecting && (
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid var(--success)',
                borderRadius: '8px',
                color: 'var(--success)',
                textAlign: 'center'
              }}>
                ✅ AI detected the roof! Click points to adjust or click Calculate to continue
              </div>
            )}

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
          </div>
        )}

        {/* Results */}
        {showResults && measurement && costEstimate && (
          <div className="results-section fade-in">
            <div className="results-header">
              <div>
                <h3>Estimate Results</h3>
                <p style={{ color: 'var(--text-tertiary)' }}>{geocoded?.formatted_address}</p>
              </div>
              <button className="btn btn-secondary" onClick={handleClear}>
                New Estimate
              </button>
            </div>

            <div className="results-grid">
              {/* Measurements Card */}
              <div className="card result-card">
                <h4>Measurements</h4>
                <div className="metric">
                  <span className="metric-label">Roof Area</span>
                  <span className="metric-value">{measurement.area_sq_ft.toFixed(0)} sq ft</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Estimated Pitch</span>
                  <span className="metric-value">{measurement.estimated_pitch}°</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Perimeter</span>
                  <span className="metric-value">{measurement.perimeter.toFixed(0)} ft</span>
                </div>
              </div>

              {/* Cost Estimate Card */}
              <div className="card result-card cost-card">
                <h4>Cost Estimate</h4>
                <div className="metric">
                  <span className="metric-label">Materials</span>
                  <span className="metric-value">${costEstimate.material_cost.toLocaleString()}</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Labor</span>
                  <span className="metric-value">${costEstimate.labor_cost.toLocaleString()}</span>
                </div>
                <div className="metric total-metric">
                  <span className="metric-label">Total Estimate</span>
                  <span className="metric-value total-value">
                    ${costEstimate.total.toLocaleString()}
                  </span>
                </div>
                <div className="metric-footer">
                  ${costEstimate.cost_per_sqft.toFixed(2)}/sq ft
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>© 2025 Elev8ted Roofs | AI-Powered Roofing Estimations</p>
      </footer>
    </div>
  );
}

// Canvas Component with Satellite Image and Point Editing
interface RoofCanvasProps {
  points: Point[];
  onPointAdd: (point: Point) => void;
  onPointMove: (index: number, point: Point) => void;
  latitude: number;
  longitude: number;
  satelliteImage: string | null;
}

function RoofCanvas({ points, onPointAdd, onPointMove, latitude, longitude, satelliteImage }: RoofCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

  // Load satellite image
  useEffect(() => {
    if (!satelliteImage) {
      setImage(null);
      return;
    }

    const img = new Image();
    img.onload = () => {
      console.log('✅ Satellite image loaded');
      setImage(img);
    };
    img.onerror = () => {
      console.error('❌ Failed to load satellite image');
    };
    img.src = `data:image/png;base64,${satelliteImage}`;
  }, [satelliteImage]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (image) {
      // Draw satellite image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } else {
      // Draw placeholder background
      ctx.fillStyle = '#1a1a22';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Inter';
      ctx.textAlign = 'center';
      ctx.fillText('Loading satellite image...', canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = '14px Inter';
      ctx.fillText(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`, canvas.width / 2, canvas.height / 2 + 10);
    }

    // Draw polygon
    if (points.length > 0) {
      // Draw filled polygon with transparency
      ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();

      // Draw polygon outline
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      if (points.length > 2) {
        ctx.closePath();
      }
      ctx.stroke();

      // Draw points
      points.forEach((point, i) => {
        // Outer ring for visibility on satellite image
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fill();

        // Inner colored circle
        ctx.fillStyle = i === 0 ? '#10b981' : '#6366f1';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Point number
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText((i + 1).toString(), point.x, point.y);
      });
    }
  }, [points, latitude, longitude, image]);

  const getPointAtPosition = (x: number, y: number): number | null => {
    for (let i = 0; i < points.length; i++) {
      const dx = x - points[i].x;
      const dy = y - points[i].y;
      if (Math.sqrt(dx * dx + dy * dy) < 10) {
        return i;
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const pointIndex = getPointAtPosition(x, y);
    if (pointIndex !== null) {
      setDraggingIndex(pointIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingIndex === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onPointMove(draggingIndex, { x, y });
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingIndex !== null) return; // Don't add point if we were dragging

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on existing point
    if (getPointAtPosition(x, y) !== null) return;

    onPointAdd({ x, y });
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        cursor: draggingIndex !== null ? 'grabbing' : 'crosshair',
        maxWidth: '100%',
        borderRadius: '8px'
      }}
    />
  );
}

export default App;
