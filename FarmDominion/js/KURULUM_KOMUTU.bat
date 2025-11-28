@echo off
echo ====================================
echo FARM DOMINION - WORLD.JS GUNCELLEME
echo ====================================
echo.

cd /d "%~dp0"

REM Yedek al
echo [1/3] Yedek aliniyor...
copy world.js world_OLD_BACKUP.js
echo Yedek alindi: world_OLD_BACKUP.js
echo.

REM Yeni dosyayi kopyala
echo [2/3] Yeni world.js kopyalaniyor...
copy /Y world_UPDATED_FINAL.js world.js
echo Yeni world.js yuklendi!
echo.

REM Kontrol
echo [3/3] Kontrol ediliyor...
if exist world.js (
    echo [OK] world.js basariyla guncellendi!
) else (
    echo [HATA] world.js bulunamadi!
)
echo.

echo ====================================
echo TAMAMLANDI!
echo ====================================
echo.
echo Simdi oyunu baslatabilirsin:
echo    BASLAT.bat
echo.
pause
