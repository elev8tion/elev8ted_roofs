import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from './store/store';
import {
  setAddress,
  setCoordinates,
  addPoint,
  clearPoints,
  setMeasurement,
  setCostEstimate,
  setAIAnalysis,
  setLoading,
  setError,
  setShowResults,
} from './store/roofSlice';
import { addressAPI, measurementAPI, aiAPI } from './services/api';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const {
    address,
    latitude,
    longitude,
    formattedAddress,
    points,
    measurement,
    costEstimate,
    aiAnalysis,
    loading,
    error,
    showResults,
  } = useSelector((state: RootState) => state.roof);

  const [canvasImage, setCanvasImage] = useState<string | null>(null);

  // Debug log
  console.log('App rendering:', { address, latitude, loading, error });

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const result = await addressAPI.geocode(address);
      dispatch(
        setCoordinates({
          lat: result.latitude,
          lng: result.longitude,
          formattedAddress: result.formatted_address,
        })
      );

      if (!result.success && result.error) {
        dispatch(setError(result.error));
      }

      const imageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${result.latitude},${result.longitude}&zoom=20&size=800x600&maptype=satellite&key=DEMO`;
      setCanvasImage(imageUrl);
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to geocode address'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCalculate = async () => {
    if (points.length < 3) {
      dispatch(setError('Draw at least 3 points to create a polygon'));
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const measurementResult = await measurementAPI.calculate(points, 0.3);
      dispatch(setMeasurement(measurementResult));

      const costResult = await measurementAPI.estimateCost(
        measurementResult.area_sq_ft,
        measurementResult.estimated_pitch
      );
      dispatch(setCostEstimate(costResult));

      try {
        const aiResult = await aiAPI.analyze(
          formattedAddress || address,
          measurementResult.area_sq_ft,
          measurementResult.estimated_pitch
        );
        dispatch(setAIAnalysis(aiResult));
      } catch (aiErr) {
        console.warn('AI analysis failed:', aiErr);
      }

      dispatch(setShowResults(true));
    } catch (err: any) {
      dispatch(setError(err.message || 'Calculation failed'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClear = () => {
    dispatch(clearPoints());
    dispatch(setShowResults(false));
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
        {!latitude && (
          <div className="address-section fade-in">
            <div className="card address-card">
              <h2>Enter Property Address</h2>
              <p className="text-muted">
                Enter the address to begin your roof estimation
              </p>
              <form onSubmit={handleAddressSubmit}>
                <input
                  type="text"
                  className="input"
                  placeholder="123 Main St, City, State ZIP"
                  value={address}
                  onChange={(e) => dispatch(setAddress(e.target.value))}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !address.trim()}
                >
                  {loading ? 'Locating...' : 'Find Property'}
                </button>
              </form>
              {error && <div className="error-message">{error}</div>}
            </div>
          </div>
        )}

        {latitude && !showResults && (
          <div className="drawing-section fade-in">
            <div className="drawing-header">
              <div>
                <h3>Draw Roof Outline</h3>
                <p className="text-muted">{formattedAddress || address}</p>
              </div>
              <div className="drawing-controls">
                <button className="btn btn-secondary" onClick={handleClear}>
                  Clear
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleCalculate}
                  disabled={points.length < 3 || loading}
                >
                  {loading ? 'Calculating...' : `Calculate (${points.length} points)`}
                </button>
              </div>
            </div>

            <div className="canvas-container card">
              <Canvas
                imageUrl={canvasImage}
                points={points}
                onPointAdd={(point) => dispatch(addPoint(point))}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        )}

        {showResults && measurement && costEstimate && (
          <div className="results-section fade-in">
            <div className="results-header">
              <div>
                <h3>Estimate Results</h3>
                <p className="text-muted">{formattedAddress || address}</p>
              </div>
              <button className="btn btn-secondary" onClick={handleClear}>
                New Estimate
              </button>
            </div>

            <div className="results-grid">
              <div className="card result-card">
                <h4>Measurements</h4>
                <div className="metric">
                  <span className="metric-label">Roof Area</span>
                  <span className="metric-value">
                    {measurement.area_sq_ft.toFixed(0)} sq ft
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Estimated Pitch</span>
                  <span className="metric-value">{measurement.estimated_pitch}°</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Perimeter</span>
                  <span className="metric-value">
                    {measurement.perimeter.toFixed(0)} ft
                  </span>
                </div>
              </div>

              <div className="card result-card cost-card">
                <h4>Cost Estimate</h4>
                <div className="metric">
                  <span className="metric-label">Materials</span>
                  <span className="metric-value">
                    ${costEstimate.material_cost.toLocaleString()}
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Labor</span>
                  <span className="metric-value">
                    ${costEstimate.labor_cost.toLocaleString()}
                  </span>
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

              {aiAnalysis && aiAnalysis.success && (
                <div className="card result-card ai-card">
                  <h4>AI Insights</h4>
                  {aiAnalysis.complexity_rating && (
                    <div className="metric">
                      <span className="metric-label">Complexity</span>
                      <span className="metric-value">
                        {aiAnalysis.complexity_rating}/10
                      </span>
                    </div>
                  )}
                  {aiAnalysis.timeline_estimate && (
                    <div className="metric">
                      <span className="metric-label">Timeline</span>
                      <span className="metric-value">
                        {aiAnalysis.timeline_estimate} days
                      </span>
                    </div>
                  )}
                  {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                    <div className="recommendations">
                      <h5>Recommendations</h5>
                      <ul>
                        {aiAnalysis.recommendations.slice(0, 3).map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="confidence">
                    Confidence: {(aiAnalysis.confidence * 100).toFixed(0)}%
                  </div>
                </div>
              )}
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

interface CanvasProps {
  imageUrl: string | null;
  points: { x: number; y: number }[];
  onPointAdd: (point: { x: number; y: number }) => void;
}

function Canvas({ imageUrl, points, onPointAdd }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const drawAll = () => {
      if (imageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setImageLoaded(true);
          drawPolygon(ctx, points);
        };
        img.onerror = () => {
          drawPlaceholder(ctx, canvas);
          drawPolygon(ctx, points);
        };
        img.src = imageUrl;
      } else {
        drawPlaceholder(ctx, canvas);
        drawPolygon(ctx, points);
      }
    };

    drawAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, points.length]);

  const drawPlaceholder = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.fillStyle = '#1a1a22';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Satellite view will appear here', canvas.width / 2, canvas.height / 2);
  };

  const drawPolygon = (ctx: CanvasRenderingContext2D, points: { x: number; y: number }[]) => {
    if (points.length === 0) return;

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

    points.forEach((point, i) => {
      ctx.fillStyle = i === 0 ? '#10b981' : '#6366f1';
      ctx.beginPath();
      ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    onPointAdd({ x, y });
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onClick={handleClick}
      style={{ cursor: 'crosshair' }}
    />
  );
}

export default App;
