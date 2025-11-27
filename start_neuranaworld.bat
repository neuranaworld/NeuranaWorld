@echo off
REM NeuranaWorld Quick Start Script
echo.
echo ========================================
echo   🧠 NeuranaWorld Başlatılıyor...
echo ========================================
echo.

REM Frontend başlat (yeni pencerede)
echo 📦 Frontend başlatılıyor...
start "NeuranaWorld Frontend" cmd /k "npm run dev"

REM 3 saniye bekle
timeout /t 3 /nobreak > nul

REM Backend başlat (yeni pencerede)
echo 🔧 Backend başlatılıyor...
start "NeuranaWorld Backend" cmd /k "cd backend && start_server.bat"

echo.
echo ✅ NeuranaWorld başlatıldı!
echo.
echo 📍 Frontend: http://localhost:5173
echo 📍 Backend:  http://localhost:8000
echo 📍 API Docs: http://localhost:8000/docs
echo.
echo Her iki pencere de açıldı. Kapatmak için pencereleri kapatın.
echo.
pause
