@echo off
echo ===============================
echo  Shakes & Fidget Clone - Online Server
echo ===============================
echo.

echo [1/3] Starte Backend (Port 3000)...
cd server
start "Backend" cmd /k "title Backend && node better-server.js"
cd ..
timeout /t 8 /nobreak >nul

echo [2/3] Starte Frontend (Port 5173)...
start "Frontend" cmd /k "title Frontend && npm run dev"
timeout /t 10 /nobreak >nul

echo [3/3] Erstelle ONLINE-Tunnel (NUR EINEN!)...
echo WICHTIG: Diese URL aendert sich NIE!
echo URL: https://shakes-game-edrick.loca.lt
echo.
start "Tunnel" cmd /k "title Tunnel && lt --port 5173 --subdomain shakes-game-edrick"

echo.
echo ===============================
echo  FERTIG! EINE Feste URL:
echo ===============================
echo.
echo URL: https://shakes-game-edrick.loca.lt
echo.
echo Tester muessen:
echo 1. URL oeffnen: https://shakes-game-edrick.loca.lt
echo 2. Klicken auf "Click to Continue" (NUR 1x!)
echo 3. Spiel ist erreichbar!
echo.
echo (Backend ist ueber den Tunnel mit drin!)
echo ===============================
echo.
pause
