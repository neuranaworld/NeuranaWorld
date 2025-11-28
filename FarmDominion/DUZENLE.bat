@echo off
chcp 65001 >nul
title Farm Dominion - Dosya Düzenleme
color 0E

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║     📁 FARM DOMINION - DOSYA DÜZENLEYİCİ 📁          ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo Bu script dağınık dosyaları düzenleyecek.
echo.
pause

REM Mevcut konum
echo [1/6] 📍 Konum tespit ediliyor...
cd
echo Şu anda buradasınız: %CD%
echo.

REM Ana klasör oluştur
echo [2/6] 📁 Ana klasör oluşturuluyor...
if not exist "FarmDominion" (
    mkdir FarmDominion
    echo ✅ FarmDominion klasörü oluşturuldu
) else (
    echo ℹ️  FarmDominion klasörü zaten var
)
echo.

REM Tüm dosyaları FarmDominion'a taşı
echo [3/6] 📦 Dosyalar taşınıyor...
echo.

REM HTML dosyası
if exist "index.html" (
    move "index.html" "FarmDominion\" >nul
    echo ✅ index.html taşındı
)

REM JS klasörü
if exist "js" (
    if not exist "FarmDominion\js" mkdir "FarmDominion\js"
    xcopy "js\*" "FarmDominion\js\" /E /Y >nul
    rmdir /S /Q "js"
    echo ✅ js klasörü taşındı
)

REM Assets klasörü
if exist "assets" (
    if not exist "FarmDominion\assets" mkdir "FarmDominion\assets"
    xcopy "assets\*" "FarmDominion\assets\" /E /Y >nul
    rmdir /S /Q "assets"
    echo ✅ assets klasörü taşındı
)

REM Biomlar klasörü
if exist "biomlar" (
    if not exist "FarmDominion\biomlar" mkdir "FarmDominion\biomlar"
    xcopy "biomlar\*" "FarmDominion\biomlar\" /E /Y >nul
    rmdir /S /Q "biomlar"
    echo ✅ biomlar klasörü taşındı
)

REM README ve diğer dosyalar
if exist "README.md" (
    move "README.md" "FarmDominion\" >nul
    echo ✅ README.md taşındı
)

if exist "KURULUM_REHBERI.md" (
    move "KURULUM_REHBERI.md" "FarmDominion\" >nul
    echo ✅ KURULUM_REHBERI.md taşındı
)

if exist "HIZLI_BASLANGIC.txt" (
    move "HIZLI_BASLANGIC.txt" "FarmDominion\" >nul
    echo ✅ HIZLI_BASLANGIC.txt taşındı
)

if exist "BASLAT.bat" (
    move "BASLAT.bat" "FarmDominion\" >nul
    echo ✅ BASLAT.bat taşındı
)

REM Diğer tüm .txt, .md, .bat dosyaları
for %%f in (*.txt *.md *.bat) do (
    if exist "%%f" (
        move "%%f" "FarmDominion\" >nul 2>&1
    )
)

echo.
echo [4/6] 🧹 Gereksiz dosyalar temizleniyor...
REM ZIP dosyasını sil (eğer varsa)
if exist "*.zip" (
    del "*.zip" >nul 2>&1
    echo ✅ ZIP dosyası silindi
)
echo.

REM Kontrol
echo [5/6] ✅ Kontrol ediliyor...
echo.
if exist "FarmDominion\index.html" (
    echo ✅ index.html → OK
) else (
    echo ❌ index.html → BULUNAMADI!
)

if exist "FarmDominion\js" (
    echo ✅ js klasörü → OK
) else (
    echo ❌ js klasörü → BULUNAMADI!
)

if exist "FarmDominion\BASLAT.bat" (
    echo ✅ BASLAT.bat → OK
) else (
    echo ❌ BASLAT.bat → BULUNAMADI!
)

echo.
echo [6/6] 🎉 İşlem tamamlandı!
echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║                                                        ║
echo ║  ✅ Tüm dosyalar düzenlendi!                          ║
echo ║                                                        ║
echo ║  📁 Konum: %CD%\FarmDominion                          ║
echo ║                                                        ║
echo ╚════════════════════════════════════════════════════════╝
echo.
echo ŞİMDİ NE YAPMALIYIM?
echo.
echo 1. FarmDominion klasörüne gir
echo 2. BASLAT.bat dosyasına çift tıkla
echo 3. Oyun başlasın!
echo.
echo Bu pencereyi kapatabilirsiniz.
echo.
pause
