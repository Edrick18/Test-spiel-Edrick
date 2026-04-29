@echo off
echo ================================
echo  Shakes & Fidget Clone - Online fuer Tester
echo ================================
echo.

echo [1/4] Starte Backend (Port 3000)...
cd server
start "Backend" cmd /k "npm start"
cd ..
timeout /t 5 /nobreak >nul

echo [2/4] Starte Frontend (Port 5173)...
start "Frontend" cmd /k "npm run dev"
timeout /t 5 /nobreak >nul

echo [3/4] Erstelle Online-Tunnel...
echo Deine Tester-URL erscheint gleich im "Tunnel" Fenster!
start "Tunnel" cmd /k "lt --port 5173"

echo.
echo ================================
echo  WICHTIG FUER TESTER:
echo ================================
echo 1. Sende ihnen die URL aus dem "Tunnel" Fenster
echo 2. Tester oeffnen die URL
echo 3. Klicken auf "Click to Continue"
echo 4. Spiel ist erreichbar!
echo.
echo Die URL sieht aus wie: https://xxx.loca.lt
echo ================================
echo.
pause
