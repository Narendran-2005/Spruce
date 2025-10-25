@echo off
echo ========================================
echo    Checking Spruce Database Tables
echo ========================================
echo.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

echo Checking if database exists...
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT 'Database connected!' as status;"

if %errorlevel% neq 0 (
    echo.
    echo ✗ Cannot connect to database!
    echo Please run setup-mysql-fixed.bat first
    pause
    exit /b 1
)

echo.
echo ✓ Database connected successfully!
echo.

echo Checking tables...
echo.
echo ========================================
echo    TABLES IN SPRUCE_DB
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SHOW TABLES;"

echo.
echo ========================================
echo    TABLE STRUCTURES
echo ========================================
echo.
echo --- USERS TABLE ---
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "DESCRIBE users;"

echo.
echo --- LOGS TABLE ---
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "DESCRIBE logs;"

echo.
echo ========================================
echo    SAMPLE DATA
echo ========================================
echo.
echo --- RECENT LOGS ---
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT timestamp, level, category, LEFT(message, 50) as message_preview FROM logs ORDER BY timestamp DESC LIMIT 5;"

echo.
echo --- REGISTERED USERS ---
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT username, created_at FROM users;"

echo.
echo ========================================
echo    TABLE CHECK COMPLETE
echo ========================================
echo.
echo If you see tables above, the backend has created them successfully!
echo If no tables, start the backend first: start-backend-mysql.bat
echo.
pause






