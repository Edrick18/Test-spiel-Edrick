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

echo [1/4] Set Git identity...
git config user.email "edrick18@github.com"
git config user.name "Edrick18"
echo Git identity set.

echo.
echo [2/4] Add files and commit...
git add .
git commit -m "Auto-update: %date% %time%" 2>nul || echo Nothing new to commit.
echo Files committed.

echo.
echo [3/4] Push to GitHub...
echo WICHTIG: Gib beim Prompt deinen GitHub Token ein!
git branch -M main
git remote set-url origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
git push -u origin main

echo.
echo ================================
echo  PUSH COMPLETE!
echo  Repo: https://github.com/%GITHUB_USER%/%REPO_NAME%
echo ================================
echo.
pause
