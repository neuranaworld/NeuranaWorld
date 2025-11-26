@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

echo HTML dosyaları oluşturuluyor...

cd Oyunlar\Aksiyon
for %%f in (*.js) do (
    echo ^<!DOCTYPE html^> > index_%%~nf.html
    echo ^<html lang="tr"^> >> index_%%~nf.html
    echo ^<head^> >> index_%%~nf.html
    echo     ^<meta charset="UTF-8"^> >> index_%%~nf.html
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> index_%%~nf.html
    echo     ^<title^>%%~nf^</title^> >> index_%%~nf.html
    echo     ^<style^>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#1a1a2e}canvas{border:2px solid #fff}^</style^> >> index_%%~nf.html
    echo ^</head^> >> index_%%~nf.html
    echo ^<body^> >> index_%%~nf.html
    echo     ^<canvas id="gameCanvas"^>^</canvas^> >> index_%%~nf.html
    echo     ^<script src="%%f"^>^</script^> >> index_%%~nf.html
    echo ^</body^> >> index_%%~nf.html
    echo ^</html^> >> index_%%~nf.html
    echo Oluşturuldu: Aksiyon/index_%%~nf.html
)
cd ..\..

cd Oyunlar\Bulmaca
for %%f in (*.js) do (
    echo ^<!DOCTYPE html^> > index_%%~nf.html
    echo ^<html lang="tr"^> >> index_%%~nf.html
    echo ^<head^> >> index_%%~nf.html
    echo     ^<meta charset="UTF-8"^> >> index_%%~nf.html
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> index_%%~nf.html
    echo     ^<title^>%%~nf^</title^> >> index_%%~nf.html
    echo     ^<style^>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#1a1a2e}canvas{border:2px solid #fff}^</style^> >> index_%%~nf.html
    echo ^</head^> >> index_%%~nf.html
    echo ^<body^> >> index_%%~nf.html
    echo     ^<canvas id="gameCanvas"^>^</canvas^> >> index_%%~nf.html
    echo     ^<script src="%%f"^>^</script^> >> index_%%~nf.html
    echo ^</body^> >> index_%%~nf.html
    echo ^</html^> >> index_%%~nf.html
    echo Oluşturuldu: Bulmaca/index_%%~nf.html
)
cd ..\..

cd Oyunlar\Strateji
for %%f in (*.js) do (
    echo ^<!DOCTYPE html^> > index_%%~nf.html
    echo ^<html lang="tr"^> >> index_%%~nf.html
    echo ^<head^> >> index_%%~nf.html
    echo     ^<meta charset="UTF-8"^> >> index_%%~nf.html
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> index_%%~nf.html
    echo     ^<title^>%%~nf^</title^> >> index_%%~nf.html
    echo     ^<style^>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#1a1a2e}canvas{border:2px solid #fff}^</style^> >> index_%%~nf.html
    echo ^</head^> >> index_%%~nf.html
    echo ^<body^> >> index_%%~nf.html
    echo     ^<canvas id="gameCanvas"^>^</canvas^> >> index_%%~nf.html
    echo     ^<script src="%%f"^>^</script^> >> index_%%~nf.html
    echo ^</body^> >> index_%%~nf.html
    echo ^</html^> >> index_%%~nf.html
    echo Oluşturuldu: Strateji/index_%%~nf.html
)
cd ..\..

cd Oyunlar\Macera
for %%f in (*.js) do (
    echo ^<!DOCTYPE html^> > index_%%~nf.html
    echo ^<html lang="tr"^> >> index_%%~nf.html
    echo ^<head^> >> index_%%~nf.html
    echo     ^<meta charset="UTF-8"^> >> index_%%~nf.html
    echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> index_%%~nf.html
    echo     ^<title^>%%~nf^</title^> >> index_%%~nf.html
    echo     ^<style^>body{margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#1a1a2e}canvas{border:2px solid #fff}^</style^> >> index_%%~nf.html
    echo ^</head^> >> index_%%~nf.html
    echo ^<body^> >> index_%%~nf.html
    echo     ^<canvas id="gameCanvas"^>^</canvas^> >> index_%%~nf.html
    echo     ^<script src="%%f"^>^</script^> >> index_%%~nf.html
    echo ^</body^> >> index_%%~nf.html
    echo ^</html^> >> index_%%~nf.html
    echo Oluşturuldu: Macera/index_%%~nf.html
)
cd ..\..

echo.
echo Tamamlandı! Tüm HTML dosyaları oluşturuldu.
pause