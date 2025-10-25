@echo off
echo ========================================
echo    Spruce Demo Test Script
echo    Verifying System Components
echo ========================================
echo.

echo Testing backend server...
curl -s http://localhost:8080/api/admin/stats >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Backend server not responding on port 8080
    echo Please start the backend server first: start-backend.bat
    pause
    exit /b 1
) else (
    echo ✅ Backend server is running
)

echo.
echo Testing frontend client A...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Frontend client A not responding on port 3000
    echo Please start client A: start-frontend.bat
    pause
    exit /b 1
) else (
    echo ✅ Frontend client A is running
)

echo.
echo Testing frontend client B...
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Frontend client B not responding on port 3001
    echo Please start client B: start-frontend-b.bat
    pause
    exit /b 1
) else (
    echo ✅ Frontend client B is running
)

echo.
echo Testing admin console...
curl -s http://localhost:3000/admin >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Admin console not accessible
    echo Please start admin console: start-admin.bat
    pause
    exit /b 1
) else (
    echo ✅ Admin console is accessible
)

echo.
echo ========================================
echo    Demo Test Results
echo ========================================
echo.
echo ✅ All components are running successfully!
echo.
echo Demo URLs:
echo - Client A:     http://localhost:3000
echo - Client B:     http://localhost:3001
echo - Admin:        http://localhost:3000/admin
echo - Backend API:  http://localhost:8080
echo.
echo ========================================
echo    Demo Instructions
echo ========================================
echo.
echo 1. Open Client A (http://localhost:3000)
echo 2. Register user 'vasanth' with password 'password123'
echo 3. Open Client B (http://localhost:3001)
echo 4. Register user 'yokesh' with password 'password123'
echo 5. Start chat between users
echo 6. Monitor logs in Admin Console
echo.

pause








