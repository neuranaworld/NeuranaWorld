@echo off
REM NeuranaWorld Backend Startup Script (Windows)

echo 🧠 Starting NeuranaWorld Backend Server...
echo =========================================

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Copying from .env.example...
    copy .env.example .env
    echo ✅ .env file created. Please edit it with your API keys.
)

REM Check if virtual environment exists
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔄 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update requirements
echo 📥 Installing/updating dependencies...
pip install -r requirements.txt --quiet

REM Start the server
echo.
echo 🚀 Starting FastAPI server...
echo 📍 Server will be available at: http://localhost:8000
echo 📍 API docs: http://localhost:8000/docs
echo 📍 Frontend (if running): http://localhost:5173
echo.

REM Run with uvicorn
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
