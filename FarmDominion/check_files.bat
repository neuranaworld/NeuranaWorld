@echo off
chcp 65001 >nul
echo ========================================
echo 🔍 FARM DOMINION v2 - DOSYA KONTROLÜ
echo ========================================
echo.

set MISSING=0
set TOTAL=0

echo 📁 ANA DOSYALAR
echo ----------------

set /a TOTAL+=1
if exist "index.html" (
    echo ✅ index.html
) else (
    echo ❌ index.html - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "README.md" (
    echo ✅ README.md
) else (
    echo ❌ README.md - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "QUICKSTART.txt" (
    echo ✅ QUICKSTART.txt
) else (
    echo ❌ QUICKSTART.txt - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "DEVELOPMENT_SUMMARY.md" (
    echo ✅ DEVELOPMENT_SUMMARY.md
) else (
    echo ❌ DEVELOPMENT_SUMMARY.md - EKSİK!
    set /a MISSING+=1
)

echo.
echo 📁 JS KLASÖRÜ
echo -------------

set /a TOTAL+=1
if exist "js\main.js" (
    echo ✅ js\main.js
) else (
    echo ❌ js\main.js - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "js\world.js" (
    echo ✅ js\world.js
) else (
    echo ❌ js\world.js - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "js\terrain.js" (
    echo ✅ js\terrain.js
) else (
    echo ❌ js\terrain.js - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "js\buildings.js" (
    echo ✅ js\buildings.js
) else (
    echo ❌ js\buildings.js - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "js\audio.js" (
    echo ✅ js\audio.js
) else (
    echo ❌ js\audio.js - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "js\settings.js" (
    echo ✅ js\settings.js
) else (
    echo ❌ js\settings.js - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "js\utils.js" (
    echo ✅ js\utils.js
) else (
    echo ❌ js\utils.js - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "js\three_module.js" (
    echo ✅ js\three_module.js
) else (
    echo ❌ js\three_module.js - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "js\PointerLockControls.js" (
    echo ✅ js\PointerLockControls.js
) else (
    echo ❌ js\PointerLockControls.js - EKSİK!
    set /a MISSING+=1
)

echo.
echo 📁 ASSETS/TEXTURES KLASÖRÜ
echo ---------------------------

set /a TOTAL+=1
if exist "assets\textures\grass.jpg" (
    echo ✅ assets\textures\grass.jpg
) else (
    echo ❌ assets\textures\grass.jpg - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\textures\rock.jpg" (
    echo ✅ assets\textures\rock.jpg
) else (
    echo ❌ assets\textures\rock.jpg - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\textures\water.jpg" (
    echo ✅ assets\textures\water.jpg
) else (
    echo ❌ assets\textures\water.jpg - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\textures\dirt.jpg" (
    echo ✅ assets\textures\dirt.jpg
) else (
    echo ❌ assets\textures\dirt.jpg - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\textures\wood.jpg" (
    echo ✅ assets\textures\wood.jpg
) else (
    echo ❌ assets\textures\wood.jpg - EKSİK!
    set /a MISSING+=1
)

echo.
echo 📁 ASSETS/AUDIO KLASÖRÜ
echo ------------------------

set /a TOTAL+=1
if exist "assets\audio\ambient.mp3" (
    echo ✅ assets\audio\ambient.mp3
) else (
    echo ❌ assets\audio\ambient.mp3 - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\audio\birds.mp3" (
    echo ✅ assets\audio\birds.mp3
) else (
    echo ❌ assets\audio\birds.mp3 - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\audio\wind.mp3" (
    echo ✅ assets\audio\wind.mp3
) else (
    echo ❌ assets\audio\wind.mp3 - EKSİK!
    set /a MISSING+=1
)

echo.
echo 📁 ASSETS/CONFIG DOSYALARI
echo ---------------------------

set /a TOTAL+=1
if exist "assets\buildings.txt" (
    echo ✅ assets\buildings.txt
) else (
    echo ❌ assets\buildings.txt - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\npcs.txt" (
    echo ✅ assets\npcs.txt
) else (
    echo ❌ assets\npcs.txt - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\terrain.txt" (
    echo ✅ assets\terrain.txt
) else (
    echo ❌ assets\terrain.txt - EKSİK!
    set /a MISSING+=1
)

set /a TOTAL+=1
if exist "assets\weather.txt" (
    echo ✅ assets\weather.txt
) else (
    echo ❌ assets\weather.txt - EKSİK!
    set /a MISSING+=1
)

echo.
echo ========================================
echo 📊 SONUÇ
echo ========================================
echo Toplam Dosya: %TOTAL%
echo Eksik Dosya: %MISSING%
echo.

if %MISSING%==0 (
    echo ✅ TÜM DOSYALAR MEVCUT!
    echo 🎮 Oyunu başlatabilirsiniz!
    echo.
    echo 🚀 Çalıştırmak için:
    echo    python -m http.server 8000
    echo    VEYA
    echo    npx http-server -p 8000
) else (
    echo ❌ %MISSING% DOSYA EKSİK!
    echo ⚠️  Lütfen eksik dosyaları tamamlayın.
)

echo.
pause
