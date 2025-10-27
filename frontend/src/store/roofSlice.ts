import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Point {
  x: number;
  y: number;
}

export interface RoofMeasurement {
  area_sq_ft: number;
  estimated_pitch: number;
  pitch_multiplier: number;
  perimeter: number;
}

export interface CostEstimate {
  area_sq_ft: number;
  pitch_degrees: number;
  material_cost: number;
  labor_cost: number;
  repair_cost: number;
  subtotal: number;
  total: number;
  cost_per_sqft: number;
}

export interface AIAnalysis {
  success: boolean;
  complexity_rating?: number;
  recommendations?: string[];
  material_suggestions?: string[];
  timeline_estimate?: number;
  considerations?: string[];
  confidence: number;
  error?: string;
}

interface RoofState {
  // Address data
  address: string;
  latitude: number | null;
  longitude: number | null;
  formattedAddress: string;

  // Drawing data
  points: Point[];
  scaleFactor: number;

  // Measurements
  measurement: RoofMeasurement | null;
  costEstimate: CostEstimate | null;
  aiAnalysis: AIAnalysis | null;

  // UI state
  isDrawing: boolean;
  showResults: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: RoofState = {
  address: '',
  latitude: null,
  longitude: null,
  formattedAddress: '',
  points: [],
  scaleFactor: 1.0,
  measurement: null,
  costEstimate: null,
  aiAnalysis: null,
  isDrawing: false,
  showResults: false,
  loading: false,
  error: null,
};

const roofSlice = createSlice({
  name: 'roof',
  initialState,
  reducers: {
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setCoordinates: (
      state,
      action: PayloadAction<{ lat: number; lng: number; formattedAddress: string }>
    ) => {
      state.latitude = action.payload.lat;
      state.longitude = action.payload.lng;
      state.formattedAddress = action.payload.formattedAddress;
    },
    addPoint: (state, action: PayloadAction<Point>) => {
      state.points.push(action.payload);
    },
    clearPoints: (state) => {
      state.points = [];
      state.measurement = null;
      state.costEstimate = null;
      state.aiAnalysis = null;
      state.showResults = false;
    },
    setScaleFactor: (state, action: PayloadAction<number>) => {
      state.scaleFactor = action.payload;
    },
    setMeasurement: (state, action: PayloadAction<RoofMeasurement>) => {
      state.measurement = action.payload;
    },
    setCostEstimate: (state, action: PayloadAction<CostEstimate>) => {
      state.costEstimate = action.payload;
    },
    setAIAnalysis: (state, action: PayloadAction<AIAnalysis>) => {
      state.aiAnalysis = action.payload;
    },
    setDrawing: (state, action: PayloadAction<boolean>) => {
      state.isDrawing = action.payload;
    },
    setShowResults: (state, action: PayloadAction<boolean>) => {
      state.showResults = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setAddress,
  setCoordinates,
  addPoint,
  clearPoints,
  setScaleFactor,
  setMeasurement,
  setCostEstimate,
  setAIAnalysis,
  setDrawing,
  setShowResults,
  setLoading,
  setError,
  reset,
} = roofSlice.actions;

export default roofSlice.reducer;
