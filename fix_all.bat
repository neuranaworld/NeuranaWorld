@echo off
setlocal enabledelayedexpansion

echo HTML dosyaları düzeltiliyor...

for /r Oyunlar %%f in (index_*.html) do (
    powershell -Command "(Get-Content '%%f') -replace '<script src=', '<script type=\"module\" src=' | Set-Content '%%f'"
    echo Düzeltildi: %%f
)

echo.
echo Tamamlandı!
pause