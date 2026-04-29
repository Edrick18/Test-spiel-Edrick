@echo off
echo ================================
echo  Shakes & Fidget Clone - Starter
echo ================================
echo.

if not exist node_modules (
  echo Installiere Frontend-Abhängigkeiten...
  call npm install
)

if not exist server\node_modules (
  echo Installiere Backend-Abhängigkeiten...
  cd server
  call npm install
  cd ..
)

echo.
echo 1. Starte Backend-Server...
start "Backend" cmd /k "cd server && npm run dev"

echo 2. Warte 3 Sekunden...
timeout /t 3 /nobreak > nul

echo 3. Starte Frontend-Server...
start "Frontend" cmd /k "npm run dev"

echo.
echo ================================
echo  Fertig! 
echo  - Backend: http://localhost:3000
echo  - Frontend: http://localhost:5173
echo ================================
echo.
echo Öffne http://localhost:5173 im Browser!
echo.
pause
