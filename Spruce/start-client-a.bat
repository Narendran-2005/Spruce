@echo off
echo ========================================
echo    Spruce Client A (System 2)
echo ========================================
echo.

REM Get client IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set CLIENT_IP=%%a
    goto :found
)
:found

echo Client A IP Address: %CLIENT_IP%
echo.

REM Prompt for server IP
set /p SERVER_IP="Enter Server IP Address (e.g., 192.168.1.100): "

echo.
echo Client A will connect to server at: http://%SERVER_IP%:8080
echo Client A will be available at: http://%CLIENT_IP%:3000
echo.

REM Set environment variable for server URL
set VITE_API_BASE_URL=http://%SERVER_IP%:8080/api

echo Starting Client A...
cd frontend
npm run dev -- --port 3000 --host

pause






