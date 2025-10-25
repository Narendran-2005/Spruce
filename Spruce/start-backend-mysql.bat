@echo off
echo ========================================
echo    Spruce Backend - MySQL Configuration
echo ========================================
echo.

REM Check if MySQL service is running
echo Checking MySQL service...
sc query mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL service not found or not running
    echo Please start MySQL service first
    echo Run as Administrator: net start mysql
    pause
    exit /b 1
)

echo MySQL service is running ✓
echo.

REM Set MySQL environment variables
echo Setting MySQL configuration...
set MYSQL_URL=jdbc:mysql://localhost:3306/spruce_db
set MYSQL_DRIVER=com.mysql.cj.jdbc.Driver
set MYSQL_USERNAME=spruce_user
set MYSQL_PASSWORD=spruce_password_2024
set MYSQL_DDL_AUTO=update
set MYSQL_DIALECT=org.hibernate.dialect.MySQL8Dialect

echo Database URL: %MYSQL_URL%
echo Username: %MYSQL_USERNAME%
echo.

REM Navigate to backend directory
cd backend

echo Starting Spruce Backend with MySQL...
echo.
echo Backend will be available at: http://localhost:8080
echo Admin console: http://localhost:8080/admin
echo API endpoints: http://localhost:8080/api
echo.

REM Start the backend
mvn spring-boot:run

echo.
echo Backend stopped.
pause






