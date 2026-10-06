@echo off
echo ========================================================
echo        STARTING LOVEFOOD FULLSTACK APPLICATION
echo ========================================================
echo.
echo 1. Starting Backend Server (Port 5000)...
start "LoveFood Backend (Port 5000)" cmd /k "cd server && npm run dev"

echo.
echo 2. Starting Frontend Client (Port 3000)...
start "LoveFood Frontend (Port 3000)" cmd /k "cd client && npm start"

echo.
echo Both Frontend and Backend are launching!
echo Backend API : http://localhost:5000
echo Frontend Web: http://localhost:3000
echo ========================================================
