@echo off
echo ================================
echo  Shakes & Fidget Clone - Online Bereitsteller
echo ================================
echo.

echo [1/4] Installiere Tunnel-Tools...
call npm install -g localtunnel
if errorlevel 1 (
  echo WARNUNG: localtunnel konnte nicht installiert werden
  echo Versuche ngrok...
  call npm install -g ngrok
)

echo.
echo [2/4] Starte Backend...
start "Backend" cmd /k "cd server && npm run dev"

echo [3/4] Warte auf Backend (3 Sek)...
timeout /t 3 /nobreak > nul

echo [4/4] Starte Frontend...
start "Frontend" cmd /k "npm run dev"

echo.
echo Warte 5 Sekunden für Frontend-Start...
timeout /t 5 /nobreak > nul

echo.
echo ================================
echo  Tunnel werden erstellt...
echo ================================
echo.

echo [Tunnel 1] Backend-Tunnel (Port 3000)...
start "Backend Tunnel" cmd /k "lt --port 3000"

echo [Tunnel 2] Frontend-Tunnel (Port 5173)...
timeout /t 2 /nobreak > nul
start "Frontend Tunnel" cmd /k "lt --port 5173"

echo.
echo ================================
echo  FERTIG! URLs werden in den Tunnel-Fenstern angezeigt
echo ================================
echo.
echo 1. Kopiere die Frontend-URL (z.B. https://abc123.loca.lt)
echo 2. Sende diese URL an deine Playtester
echo 3. Sie müssen in src/main-simple.js die API_BASE auf
echo    die Backend-Tunnel-URL ändern
echo.
echo Tipp: In den Tunnel-Fenstern stehen die URLs!
echo.
pause
