@echo off
chcp 65001 >nul
title Farm Dominion v2.1 - Otomatik Başlatıcı
color 0A

echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║     🌾 FARM DOMINION v2.1 - OTOMATIK BAŞLATICI 🌾    ║
echo ║                                                        ║
echo ╔════════════════════════════════════════════════════════╗
echo.

REM Klasör kontrolü
echo [1/5] 📁 Dosya kontrolü yapılıyor...
if not exist "index.html" (
    echo ❌ HATA: index.html bulunamadı!
    echo.
    echo Bu script'i FarmDominion klasörünün içinde çalıştırmalısınız.
    echo Konum: FarmDominion\BASLA T.bat
    echo.
    pause
    exit
)
echo ✅ Dosyalar bulundu!
echo.

REM Python kontrolü
echo [2/5] 🐍 Python kontrolü yapılıyor...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ HATA: Python bulunamadı!
    echo.
    echo Python kurulu değil. Kurulum için:
    echo 1. https://www.python.org/downloads/ adresine gidin
    echo 2. Python'u indirin ve kurun
    echo 3. Kurulumda "Add Python to PATH" seçeneğini işaretleyin
    echo 4. Bu script'i tekrar çalıştırın
    echo.
    pause
    exit
)
echo ✅ Python bulundu!
python --version
echo.

REM Port kontrolü
echo [3/5] 🔌 Port 8000 kontrolü yapılıyor...
netstat -ano | find ":8000" >nul
if %errorlevel% equ 0 (
    echo ⚠️  UYARI: Port 8000 kullanımda!
    echo.
    echo Port 8080 kullanılacak...
    set PORT=8080
) else (
    echo ✅ Port 8000 müsait!
    set PORT=8000
)
echo.

REM Sunucu başlatma
echo [4/5] 🚀 Web sunucusu başlatılıyor...
echo.
echo ┌─────────────────────────────────────────────────────┐
echo │ SUNUCU BİLGİLERİ                                    │
echo ├─────────────────────────────────────────────────────┤
echo │ Adres: http://localhost:%PORT%                      │
echo │ Port: %PORT%                                        │
echo │ Durum: Çalışıyor ✅                                 │
echo └─────────────────────────────────────────────────────┘
echo.
echo ⚠️  ÖNEMLİ:
echo    - Bu pencereyi KAPATMAYIN!
echo    - Sunucu durur ve oyun çalışmaz
echo    - Oyunu kapatmak için Ctrl+C basın
echo.

REM Tarayıcıyı aç
echo [5/5] 🌐 Tarayıcı açılıyor...
timeout /t 2 >nul
start http://localhost:%PORT%
echo ✅ Tarayıcı açıldı!
echo.

echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║            🎮 OYUN BAŞLATILDI! 🎮                     ║
echo ║                                                        ║
echo ║  Tarayıcınızda oyun yüklenecek...                     ║
echo ║  İlk yükleme 10-30 saniye sürebilir                   ║
echo ║                                                        ║
echo ║  ⚠️  Bu pencereyi KAPATMAYIN!                         ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Sunucu durdurmak için Ctrl+C basın...
echo.

REM Python sunucusunu başlat
python -m http.server %PORT%

REM Sunucu kapandığında
echo.
echo ═══════════════════════════════════════════════════════
echo 🛑 Sunucu durduruldu
echo ═══════════════════════════════════════════════════════
echo.
pause
