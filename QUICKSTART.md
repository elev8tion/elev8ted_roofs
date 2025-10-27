# Elev8ted Roofs - Quick Start Guide

## 🎯 Project Status

✅ **Backend:** FastAPI running on http://localhost:8000
✅ **Frontend:** React app running on http://localhost:5174
✅ **All core features implemented and ready for testing**

---

## 🚀 Current Server Status

Both development servers are currently running:

- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/api/docs
- **Frontend App:** http://localhost:5174

Open your browser and navigate to http://localhost:5174 to see the application!

---

## 🔑 Adding API Keys (Required for Full Functionality)

### 1. Google Maps API Key

To enable address geocoding and satellite imagery:

1. Get your API key from: https://console.cloud.google.com/
2. Enable these APIs:
   - Geocoding API
   - Maps Static API
   - Maps JavaScript API

3. Add to `backend/.env`:
```env
GOOGLE_MAPS_API_KEY=your_actual_key_here
```

4. Add to `frontend/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_key_here
```

### 2. OpenAI API Key (Optional - for AI Features)

To enable AI-powered roof analysis:

1. Get your API key from: https://platform.openai.com/api-keys
2. Add to `backend/.env`:
```env
OPENAI_API_KEY=your_actual_key_here
OPENAI_MODEL=gpt-4o-mini
```

**Note:** The app works without API keys but will show mock data and warnings.

---

## 📋 How to Use the Application

### Step 1: Enter Address
- Type any US property address in the search box
- Example: "1600 Amphitheatre Parkway, Mountain View, CA"
- Click "Find Property"

### Step 2: Draw Roof Outline
- Click on the satellite image to mark roof corners
- Each click adds a point (minimum 3 points required)
- The first point is green, others are blue
- Click "Calculate" when done

### Step 3: View Results
- See instant measurements (area, pitch, perimeter)
- Get detailed cost breakdown (materials, labor, total)
- Receive AI-powered insights (if OpenAI key configured)

### Step 4: New Estimate
- Click "New Estimate" to start over
- Try different properties and roof shapes

---

## 🎨 Features Demo

### Without API Keys (Mock Mode)
- ✅ Full UI/UX experience
- ✅ Polygon drawing functionality
- ✅ Measurement calculations
- ✅ Cost estimates
- ⚠️  Uses demo coordinates
- ⚠️  No real satellite imagery
- ⚠️  No AI analysis

### With API Keys (Full Mode)
- ✅ Real address geocoding
- ✅ Actual satellite imagery
- ✅ Accurate measurements
- ✅ AI-powered recommendations
- ✅ Timeline estimates
- ✅ Material suggestions

---

## 🛠️ Restarting Servers

If you need to restart the servers:

```bash
# Use the convenient startup script
cd /Users/kcdacre8tor/airoofing-demo
./start-dev.sh
```

Or manually:

```bash
# Terminal 1 - Backend
cd /Users/kcdacre8tor/airoofing-demo/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Terminal 2 - Frontend
cd /Users/kcdacre8tor/airoofing-demo/frontend
npm run dev
```

---

## 📦 Deployment to Netlify

### Preparing for Production

1. **Add API Keys to .env files** (see above)

2. **Build Frontend:**
```bash
cd frontend
npm run build
```

3. **Deploy to Netlify:**
```bash
# Install Netlify CLI (if not installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

4. **Configure Environment Variables in Netlify:**
- Go to Site Settings → Environment Variables
- Add: `VITE_API_URL` = your backend API URL
- Add: `VITE_GOOGLE_MAPS_API_KEY` = your Google Maps key

### Deploying Backend

Choose one of these options:

- **Railway:** `railway up`
- **Render:** Connect GitHub repo
- **AWS Lambda:** Use Mangum adapter
- **Google Cloud Run:** `gcloud run deploy`

---

## 🔍 Testing the App

### Test Addresses
Try these addresses to test the application:

1. **Google HQ:** 1600 Amphitheatre Parkway, Mountain View, CA
2. **Empire State Building:** 350 5th Ave, New York, NY 10118
3. **Space Needle:** 400 Broad St, Seattle, WA 98109

### Test Workflow
1. Enter address → Should geocode successfully
2. Draw 4-6 points → Should create polygon
3. Click Calculate → Should show measurements
4. Check costs → Should display breakdown
5. View AI insights → Should show recommendations (if configured)

---

## 📊 Project Structure

```
airoofing-demo/
├── frontend/           # React + TypeScript + Vite
│   ├── src/
│   │   ├── App.tsx            # Main application
│   │   ├── store/             # Redux state management
│   │   └── services/          # API integration
│   └── .env                   # Frontend config
│
├── backend/            # FastAPI + Python
│   ├── app/
│   │   ├── main.py            # FastAPI app
│   │   ├── api/v1/endpoints/  # API endpoints
│   │   └── services/          # Business logic
│   └── .env                   # Backend config
│
├── start-dev.sh       # Convenient startup script
└── README.md          # Full documentation
```

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend not starting?
```bash
cd frontend
npm install
```

### Port already in use?
- Backend: Change port in `backend/app/main.py`
- Frontend: Vite will auto-select available port

### API calls failing?
- Check backend is running on port 8000
- Verify CORS settings in `backend/.env`
- Check browser console for errors

---

## 💡 Next Steps

1. **Add your API keys** to enable full functionality
2. **Test the application** with real addresses
3. **Customize pricing** in `backend/.env`:
   - `DEFAULT_MATERIAL_COST=3.50`
   - `DEFAULT_LABOR_COST=2.50`
4. **Review the code** and customize as needed
5. **Deploy to production** when ready

---

## 📞 Support

For issues or questions:
- Check the full README.md for detailed documentation
- Review API docs at http://localhost:8000/api/docs
- Inspect browser console for frontend errors
- Check terminal output for backend errors

---

**Built with ❤️ using React, FastAPI, Redux, and AI**

Enjoy your Elev8ted Roofs demo! 🏠✨
