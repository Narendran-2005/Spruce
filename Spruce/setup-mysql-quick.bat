@echo off
echo ========================================
echo    Spruce MySQL Quick Setup
echo ========================================
echo.

echo This script will help you set up MySQL for Spruce project.
echo.

REM Check if MySQL is installed
echo Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: MySQL command line client not found
    echo Please make sure MySQL is installed and added to PATH
    echo.
    echo Download MySQL from: https://dev.mysql.com/downloads/mysql/
    pause
    exit /b 1
)

echo MySQL found ✓
echo.

echo Step 1: Creating database and user...
echo Please enter your MySQL root password when prompted.
echo.

REM Run the SQL setup script
mysql -u root -p < setup-mysql-db.sql

if %errorlevel% equ 0 (
    echo.
    echo ✓ Database setup completed successfully!
    echo.
    echo Step 2: Testing connection...
    call test-mysql-connection.bat
    echo.
    echo Step 3: Starting backend with MySQL...
    echo Press any key to start the backend...
    pause >nul
    call start-backend-mysql.bat
) else (
    echo.
    echo ✗ Database setup failed!
    echo Please check your MySQL root password and try again.
    echo.
    echo Manual setup:
    echo 1. Open MySQL Workbench or command line
    echo 2. Run the commands in setup-mysql-db.sql
    echo 3. Then run: start-backend-mysql.bat
    echo.
    pause
)






