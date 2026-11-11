@echo off
echo ===================================================
echo       SEO Pilot - Starting Standalone Mobile App
echo ===================================================
echo.
cd /d "%~dp0mobile"
set "PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%"

echo 1. Launching Mobile App Simulator in Browser...
start "" "http://localhost:3000/mobile"

echo.
echo 2. Starting Expo Mobile Dev Server...
echo Press 'a' for Android, 'w' for Web, or scan QR code with Expo Go app on your phone!
echo.
call npx expo start --web
pause
