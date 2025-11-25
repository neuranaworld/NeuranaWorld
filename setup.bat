@echo off
chcp 65001 >nul
color 0A
echo.
echo ================================================
echo    🧠 NEURANAWORLD KURULUM SCRIPTI
echo ================================================
echo.
echo Klasör yapısı oluşturuluyor...
timeout /t 2 >nul

REM Ana klasörü kontrol et
if not exist "NeuranaWorld123" (
    mkdir NeuranaWorld123
    echo ✓ NeuranaWorld123 klasörü oluşturuldu
) else (
    echo ℹ NeuranaWorld123 klasörü zaten mevcut
)

cd NeuranaWorld123

REM Arayüz klasörleri
if not exist "Arayuz" mkdir Arayuz
cd Arayuz
if not exist "AnaSayfa" mkdir AnaSayfa
if not exist "Hakkimizda" mkdir Hakkimizda
if not exist "Iletisim" mkdir Iletisim
cd ..
echo ✓ Arayüz klasörleri oluşturuldu

REM Oyunlar klasörleri
if not exist "Oyunlar" mkdir Oyunlar
cd Oyunlar
if not exist "Aksiyon" mkdir Aksiyon
if not exist "Strateji" mkdir Strateji
if not exist "Bulmaca" mkdir Bulmaca
if not exist "Macera" mkdir Macera
if not exist "Spor" mkdir Spor
cd ..
echo ✓ Oyunlar klasörleri oluşturuldu

REM Uygulamalar klasörleri
if not exist "Uygulamalar" mkdir Uygulamalar
cd Uygulamalar
if not exist "Uretkenlik" mkdir Uretkenlik
if not exist "Egitim" mkdir Egitim
if not exist "Araclar" mkdir Araclar
if not exist "Sosyal" mkdir Sosyal
cd ..
echo ✓ Uygulamalar klasörleri oluşturuldu

echo.
echo ================================================
echo    📁 KLASÖR YAPISI BAŞARIYLA OLUŞTURULDU!
echo ================================================
echo.
echo 📂 Ana Klasör: NeuranaWorld123
echo.
echo 🎨 Arayüz:
echo    └─ AnaSayfa, Hakkimizda, Iletisim
echo.
echo 🎮 Oyunlar:
echo    ├─ Aksiyon
echo    ├─ Strateji
echo    ├─ Bulmaca
echo    ├─ Macera
echo    └─ Spor
echo.
echo 💻 Uygulamalar:
echo    ├─ Uretkenlik
echo    ├─ Egitim
echo    ├─ Araclar
echo    └─ Sosyal
echo.
echo ================================================
echo.
echo 🚀 SONRAKİ ADIMLAR:
echo.
echo 1. Web dosyalarını (index.html, style.css, app.js)
echo    NeuranaWorld123 klasörüne kopyalayın
echo.
echo 2. TXT dosyalarınızı ilgili klasörlere ekleyin:
echo    - Oyunlar/Aksiyon/kartoyunlari.txt
echo    - Oyunlar/Bulmaca/zihingelistirme.txt
echo    - Oyunlar/Strateji/neuranamatch.txt
echo    - Oyunlar/Strateji/farming.txt
echo    - Oyunlar/Macera/mineworld.txt
echo    - Uygulamalar/Egitim/turkce.txt
echo    - Uygulamalar/Sosyal/neuranaverse.txt
echo.
echo 3. index.html dosyasını tarayıcıda açın
echo.
echo 4. GitHub'a yüklemek için:
echo    git init
echo    git add .
echo    git commit -m "İlk commit"
echo    git remote add origin [REPO-URL]
echo    git push -u origin main
echo.
echo ================================================
echo.
echo Klasör yapınız hazır! İyi çalışmalar! 🎉
echo.
pause
