# Elev8ted Roofs - AI-Powered Roofing Estimation

A modern, AI-powered web application for instant roofing cost estimations using satellite imagery and machine learning.

## Features

- 🏠 **Address-Based Property Lookup** - Enter any US address to locate the property
- 🗺️ **Interactive Roof Drawing** - Draw roof polygons directly on satellite imagery
- 📏 **Automated Measurements** - Calculate roof area, pitch, and perimeter
- 💰 **Instant Cost Estimates** - Get material and labor cost breakdowns
- 🤖 **AI-Powered Insights** - Receive intelligent recommendations using GPT-4o-mini
- 🎨 **Modern Dark UI** - Professional, sleek interface with smooth animations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Vite** for fast development and building
- **Axios** for API calls
- Modern CSS with custom properties

### Backend
- **FastAPI** - High-performance Python web framework
- **OpenAI GPT-4o-mini** - Cost-effective AI analysis
- **Google Maps API** - Geocoding and satellite imagery
- **Shapely** - Geometric calculations
- **Pydantic** - Data validation

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- Google Maps API Key
- OpenAI API Key (for AI features)

### Installation

1. **Clone the repository**
```bash
cd /Users/kcdacre8tor/airoofing-demo
```

2. **Setup Backend**
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your API keys
```

3. **Setup Frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env if needed
```

### Running Locally

1. **Start Backend Server**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Backend will be available at: http://localhost:8000
API Documentation: http://localhost:8000/api/docs

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```

Frontend will be available at: http://localhost:5173

### Configuration

#### Backend (.env)

```env
# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Pricing (USD per square foot)
DEFAULT_MATERIAL_COST=3.50
DEFAULT_LABOR_COST=2.50
STEEP_ROOF_MULTIPLIER=1.25
DAMAGE_REPAIR_MULTIPLIER=1.15
```

#### Frontend (.env)

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Usage

1. **Enter Address** - Type a property address in the search box
2. **Draw Roof Outline** - Click on the satellite image to mark roof corners
3. **Calculate** - Click "Calculate" to get instant measurements and cost estimates
4. **Review AI Insights** - See AI-powered recommendations and timeline estimates
5. **New Estimate** - Click "New Estimate" to start over

## API Endpoints

### Address
- `POST /api/v1/address/geocode` - Geocode address to coordinates

### Measurement
- `POST /api/v1/measurement/calculate` - Calculate roof measurements
- `POST /api/v1/measurement/estimate-cost` - Generate cost estimate
- `GET /api/v1/measurement/pricing-defaults` - Get default pricing

### AI
- `POST /api/v1/ai/analyze` - Get AI-powered roof analysis
- `GET /api/v1/ai/status` - Check AI service status

## Deployment to Netlify

### Frontend Deployment

1. **Build for Production**
```bash
cd frontend
npm run build
```

2. **Deploy to Netlify**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

3. **Set Environment Variables** in Netlify Dashboard:
   - `VITE_API_URL` - Your backend API URL
   - `VITE_GOOGLE_MAPS_API_KEY` - Your Google Maps API key

### Backend Deployment

Deploy the FastAPI backend to:
- **Railway** - `railway up`
- **Render** - Connect GitHub repo
- **AWS Lambda** with Mangum adapter
- **Google Cloud Run** - `gcloud run deploy`

## Project Structure

```
airoofing-demo/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # Redux store and slices
│   │   ├── services/       # API service layer
│   │   ├── App.tsx         # Main application
│   │   └── index.css       # Global styles
│   └── package.json
│
└── backend/
    ├── app/
    │   ├── api/v1/endpoints/  # API endpoints
    │   ├── services/          # Business logic
    │   ├── core/              # Configuration
    │   └── main.py            # FastAPI app
    └── requirements.txt
```

## Cost Calculation Formula

```
Material Cost = Area × Material Rate × Waste Factor (1.1)
Labor Cost = Area × Labor Rate × Pitch Multiplier
Total = Material + Labor + Repairs (if any)
```

Pitch Multipliers:
- 0-25°: 1.0x
- 26-35°: 1.15x
- 36-45°: 1.25x
- 45°+: 1.5x

## Development

### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend Scripts
```bash
uvicorn app.main:app --reload  # Development server
python -m pytest                # Run tests
python -m black app/            # Format code
```

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Create an issue on GitHub
- Email: support@elev8tedroofs.com

## Acknowledgments

- Google Maps API for satellite imagery
- OpenAI for AI-powered insights
- FastAPI and React communities

---

Built with ❤️ by the Elev8ted Roofs Team
