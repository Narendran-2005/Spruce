@echo off
echo ========================================
echo    Checking Data Persistence
echo ========================================
echo.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

echo Checking if backend is running...
curl -s http://localhost:8080/api/admin/stats >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Backend is not running!
    echo Please start backend first: start-backend-mysql.bat
    pause
    exit /b 1
)

echo ✓ Backend is running!
echo.

echo Checking MySQL database...
echo.
echo ========================================
echo    DATABASE TABLES
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SHOW TABLES;"

echo.
echo ========================================
echo    RECENT LOGS
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT timestamp, level, category, LEFT(message, 50) as message_preview FROM logs ORDER BY timestamp DESC LIMIT 10;"

echo.
echo ========================================
echo    REGISTERED USERS
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT username, created_at FROM users;"

echo.
echo ========================================
echo    MESSAGE PACKETS
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT sender, recipient, timestamp FROM message_packets ORDER BY timestamp DESC LIMIT 5;" 2>nul

echo.
echo ========================================
echo    DATA PERSISTENCE CHECK COMPLETE
echo ========================================
echo.
echo If you see data above, MySQL is working correctly!
echo If no data, register a user in the frontend first.
echo.
pause






