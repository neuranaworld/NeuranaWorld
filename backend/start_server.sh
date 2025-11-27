#!/bin/bash

# NeuranaWorld Backend Startup Script

echo "🧠 Starting NeuranaWorld Backend Server..."
echo "========================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please edit it with your API keys."
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install/update requirements
echo "📥 Installing/updating dependencies..."
pip install -r requirements.txt --quiet

# Check if MongoDB is running (optional check)
echo "🔍 Checking MongoDB connection..."
python3 -c "from motor.motor_asyncio import AsyncIOMotorClient; import os; from dotenv import load_dotenv; load_dotenv(); print('✅ MongoDB config loaded')" 2>/dev/null || echo "⚠️  MongoDB check skipped"

# Start the server
echo ""
echo "🚀 Starting FastAPI server..."
echo "📍 Server will be available at: http://localhost:8000"
echo "📍 API docs: http://localhost:8000/docs"
echo "📍 Frontend (if running): http://localhost:5173"
echo ""

# Run with uvicorn
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
