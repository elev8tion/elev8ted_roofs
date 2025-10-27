#!/bin/bash

# Elev8ted Roofs - Development Server Startup Script

echo "🚀 Starting Elev8ted Roofs Development Environment..."
echo ""

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Virtual environment not found. Please run:"
    echo "   cd backend && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Node modules not found. Please run:"
    echo "   cd frontend && npm install"
    exit 1
fi

# Start Backend
echo "🐍 Starting FastAPI Backend on http://localhost:8000..."
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start Frontend
echo "⚛️  Starting React Frontend on http://localhost:5174..."
cd frontend
npm run dev -- --port 5174 &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Development servers started successfully!"
echo ""
echo "📍 Backend API: http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/api/docs"
echo "📍 Frontend App: http://localhost:5174"
echo ""
echo "⚙️  To configure API keys, edit:"
echo "   - backend/.env (Google Maps & OpenAI keys)"
echo "   - frontend/.env (API URL & Google Maps key)"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '👋 Shutting down servers...'; exit" INT TERM

# Keep script running
wait
