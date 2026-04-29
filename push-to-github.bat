@echo off
echo ================================
echo  Shakes & Fidget Clone - Push to GitHub
echo ================================
echo.

set /p GITHUB_USER=Gib hier DEINEN GitHub-Usernamen ein: 

echo.
echo [1/3] Initialisiere Git...
if not exist .git (
  git init
  echo Git initialisiert.
) else (
  echo Git bereits initialisiert.
)

echo.
echo [2/3] Erstelle .gitignore...
echo node_modules > .gitignore
echo dist >> .gitignore
echo .env >> .gitignore
echo *.db >> .gitignore
echo server\node_modules >> .gitignore
echo .gitignore erstellt.

echo.
echo [3/3] Pushe zu GitHub...
git add .
git commit -m "Ready for cloud deployment: Backend + Frontend"
git branch -M main
git remote add origin https://github.com/%GITHUB_USER%/shakes-fidget-clone.git
git push -u origin main

echo.
echo ================================
echo  FERTIG! 
echo  Repo: https://github.com/%GITHUB_USER%/shakes-fidget-clone
echo ================================
echo.
pause
