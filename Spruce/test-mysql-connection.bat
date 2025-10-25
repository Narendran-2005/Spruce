@echo off
echo ========================================
echo    Testing MySQL Connection
echo ========================================
echo.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

echo Testing connection to spruce_db...
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT 'MySQL Connection: SUCCESS' as status, NOW() as timestamp;"

if %errorlevel% equ 0 (
    echo.
    echo ✓ MySQL connection successful!
    echo.
    echo Checking tables...
    %MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SHOW TABLES;"
    echo.
    echo If you see tables (users, logs), the database is ready.
    echo If no tables, start the backend first: start-backend-mysql.bat
) else (
    echo.
    echo ✗ MySQL connection failed!
    echo.
    echo Troubleshooting:
    echo 1. Make sure MySQL service is running: net start mysql
    echo 2. Check if database 'spruce_db' exists
    echo 3. Verify username 'spruce_user' exists
    echo 4. Run setup-mysql-fixed.bat first
    echo.
)

echo.
pause