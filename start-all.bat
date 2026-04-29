@echo off
echo ================================
echo  Shakes & Fidget Clone - Startet Spiel
echo ================================
echo.

echo [1/3] Starte Backend (Port 3000)...
cd server
start "Backend" cmd /k "npm start"
cd ..

echo [2/3] Warte 5 Sekunden auf Backend...
timeout /t 5 /nobreak >nul

echo [3/3] Starte Frontend (Port 5173)...
start "Frontend" cmd /k "npm run dev"

echo.
echo ================================
echo  FERTIG! 
echo  Browser oeffnen: http://localhost:5173
echo ================================
echo.
timeout /t 3 /nobreak >nul
start http://localhost:5173
