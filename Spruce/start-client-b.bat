@echo off
echo ========================================
echo    Spruce Client B (System 3)
echo ========================================
echo.

REM Get client IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set CLIENT_IP=%%a
    goto :found
)
:found

echo Client B IP Address: %CLIENT_IP%
echo.

REM Prompt for server IP
set /p SERVER_IP="Enter Server IP Address (e.g., 192.168.1.100): "

echo.
echo Client B will connect to server at: http://%SERVER_IP%:8080
echo Client B will be available at: http://%CLIENT_IP%:3001
echo.

REM Set environment variable for server URL
set VITE_API_BASE_URL=http://%SERVER_IP%:8080/api

echo Starting Client B...
cd frontend
npm run dev -- --port 3001 --host

pause






