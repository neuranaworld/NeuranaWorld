@echo off
chcp 65001 >nul

echo Oyun sayfaları oluşturuluyor...

for /r "Oyunlar" %%f in (*.js) do (
    set "jsfile=%%f"
    set "htmlfile=%%~dpfindex.html"
    
    if not exist "!htmlfile!" (
        echo ^<!DOCTYPE html^> > "!htmlfile!"
        echo ^<html lang="tr"^> >> "!htmlfile!"
        echo ^<head^> >> "!htmlfile!"
        echo     ^<meta charset="UTF-8"^> >> "!htmlfile!"
        echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^> >> "!htmlfile!"
        echo     ^<title^>%%~nf^</title^> >> "!htmlfile!"
        echo     ^<style^> >> "!htmlfile!"
        echo         body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #1a1a2e; } >> "!htmlfile!"
        echo         canvas { border: 2px solid #fff; } >> "!htmlfile!"
        echo     ^</style^> >> "!htmlfile!"
        echo ^</head^> >> "!htmlfile!"
        echo ^<body^> >> "!htmlfile!"
        echo     ^<canvas id="gameCanvas"^>^</canvas^> >> "!htmlfile!"
        echo     ^<script src="%%~nxf"^>^</script^> >> "!htmlfile!"
        echo ^</body^> >> "!htmlfile!"
        echo ^</html^> >> "!htmlfile!"
        
        echo Oluşturuldu: %%~dpfindex.html
    )
)

echo Tamamlandı!
pause