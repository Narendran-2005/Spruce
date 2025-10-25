@echo off
echo ========================================
echo    Spruce Demo Setup Script
echo    Hybrid Post-Quantum Secure Messaging
echo ========================================
echo.

echo Checking system requirements...

REM Check Java
echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher from: https://adoptium.net/
    pause
    exit /b 1
) else (
    echo ✅ Java found
)

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✅ Node.js found
)

REM Check Maven
echo Checking Maven installation...
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Maven is not installed or not in PATH
    echo Please install Maven from: https://maven.apache.org/download.cgi
    pause
    exit /b 1
) else (
    echo ✅ Maven found
)

echo.
echo ✅ All requirements satisfied!
echo.

echo Setting up backend dependencies...
cd backend
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo ❌ ERROR: Backend setup failed
    pause
    exit /b 1
)
cd ..

echo.
echo Setting up frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ ERROR: Frontend setup failed
    pause
    exit /b 1
)
cd ..

echo.
echo ✅ Setup completed successfully!
echo.
echo ========================================
echo    Demo Setup Instructions
echo ========================================
echo.
echo 1. Start Backend Server (Laptop 3):
echo    run start-backend.bat
echo.
echo 2. Start Client A (Laptop 1 - Vasanth):
echo    run start-frontend.bat
echo.
echo 3. Start Client B (Laptop 2 - Yokesh):
echo    run start-frontend-b.bat
echo.
echo 4. Start Admin Console (Laptop 3):
echo    run start-admin.bat
echo.
echo ========================================
echo    Demo URLs
echo ========================================
echo.
echo Backend API:     http://localhost:8080
echo Client A:        http://localhost:3000
echo Client B:        http://localhost:3001
echo Admin Console:   http://localhost:3000/admin
echo.
echo ========================================
echo    Demo Flow
echo ========================================
echo.
echo 1. Register users 'vasanth' and 'yokesh'
echo 2. Start secure chat between users
echo 3. Observe hybrid handshake process
echo 4. Send encrypted messages
echo 5. Monitor logs in admin console
echo.

pause








