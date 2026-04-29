@echo off
echo Starte Shakes & Fidget Clone...
echo.

echo Starte Backend...
start "Backend" cmd /k "cd /d "%~dp0server" && npm run dev"

timeout /t 3 /nobreak > nul

echo Starte Frontend...
start "Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo Frontend und Backend werden gestartet...
echo Browser öffnet sich automatisch unter http://localhost:5173
pause