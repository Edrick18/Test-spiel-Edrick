@echo off
echo ================================
echo  Shakes & Fidget Clone - Push to GitHub
echo ================================
echo.

set GITHUB_USER=Edrick18
set REPO_NAME=Test-spiel-Edrick

echo GitHub Username: %GITHUB_USER%
echo Repository: %REPO_NAME%
echo.

echo [1/4] Initialisiere Git...
if not exist .git (
  git init
  git config user.email "edrick18@github.com"
  git config user.name "Edrick18"
  echo Git initialisiert.
) else (
  echo Git bereits initialisiert.
)

echo.
echo [2/4] Erstelle .gitignore...
echo node_modules > .gitignore
echo dist >> .gitignore
echo .env >> .gitignore
echo *.db >> .gitignore
echo server\node_modules >> .gitignore
echo .gitignore erstellt.

echo.
echo [3/4] Fuege Dateien hinzu und committe...
git add .
git commit -m "Ready for cloud deployment: Backend + Frontend" 2>nul || echo Bereits committet.

echo.
echo [4/4] Pushe zu GitHub...
echo.
echo WICHTIG: Du brauchst einen Personal Access Token!
echo 1. Gehe zu: https://github.com/settings/tokens
echo 2. "Generate new token (classic)"
echo 3. Hake "repo" an
echo 4. Generate und kopiere den Token
echo.
set /p TOKEN=Gib hier deinen GitHub Token ein: 

git branch -M main
git remote set-url origin https://%GITHUB_USER%:%TOKEN%@github.com/%GITHUB_USER%/%REPO_NAME%.git
git push -u origin main

echo.
echo ================================
echo  FERTIG! 
echo  Repo: https://github.com/%GITHUB_USER%/%REPO_NAME%
echo ================================
echo.
pause
