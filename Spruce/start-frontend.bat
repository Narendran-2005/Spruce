@echo off
echo Starting Spruce Frontend Client...
echo.

cd frontend

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Starting development server...
echo Client will be available at: http://localhost:3000
echo.

npm run dev

pause








