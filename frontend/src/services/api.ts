import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Point {
  x: number;
  y: number;
}

export interface GeocodeResponse {
  address: string;
  formatted_address: string;
  latitude: number;
  longitude: number;
  success: boolean;
  error?: string;
}

export interface MeasurementResponse {
  area_sq_ft: number;
  estimated_pitch: number;
  pitch_multiplier: number;
  perimeter: number;
  point_count: number;
}

export interface CostEstimateResponse {
  area_sq_ft: number;
  pitch_degrees: number;
  pitch_multiplier: number;
  material_cost: number;
  labor_cost: number;
  repair_cost: number;
  subtotal: number;
  total: number;
  cost_per_sqft: number;
}

export interface AIAnalysisResponse {
  success: boolean;
  complexity_rating?: number;
  recommendations?: string[];
  material_suggestions?: string[];
  timeline_estimate?: number;
  considerations?: string[];
  confidence: number;
  error?: string;
}

export const addressAPI = {
  geocode: async (address: string): Promise<GeocodeResponse> => {
    const response = await api.post<GeocodeResponse>('/api/v1/address/geocode', {
      address,
    });
    return response.data;
  },
};

export const measurementAPI = {
  calculate: async (
    points: Point[],
    scaleFactor: number = 1.0
  ): Promise<MeasurementResponse> => {
    const response = await api.post<MeasurementResponse>(
      '/api/v1/measurement/calculate',
      {
        points,
        scale_factor: scaleFactor,
        building_type: 'residential',
      }
    );
    return response.data;
  },

  estimateCost: async (
    area: number,
    pitch: number,
    hasDamage: boolean = false
  ): Promise<CostEstimateResponse> => {
    const response = await api.post<CostEstimateResponse>(
      '/api/v1/measurement/estimate-cost',
      {
        area_sq_ft: area,
        pitch_degrees: pitch,
        has_damage: hasDamage,
      }
    );
    return response.data;
  },

  getPricingDefaults: async () => {
    const response = await api.get('/api/v1/measurement/pricing-defaults');
    return response.data;
  },
};

export const aiAPI = {
  analyze: async (
    address: string,
    area: number,
    pitch: number,
    notes?: string
  ): Promise<AIAnalysisResponse> => {
    const response = await api.post<AIAnalysisResponse>('/api/v1/ai/analyze', {
      address,
      area_sq_ft: area,
      pitch_degrees: pitch,
      user_notes: notes,
    });
    return response.data;
  },

  status: async () => {
    const response = await api.get('/api/v1/ai/status');
    return response.data;
  },
};

export const configAPI = {
  getConfig: async () => {
    const response = await api.get('/api/config');
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },
};

export default api;
