@echo off
echo ========================================
echo    Debug Message Decryption Issue
echo ========================================
echo.

set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

echo Checking recent logs for decryption errors...
echo.

echo ========================================
echo    RECENT CRYPTO LOGS
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT timestamp, level, category, message FROM logs WHERE category = 'CRYPTO' ORDER BY timestamp DESC LIMIT 10;"

echo.
echo ========================================
echo    RECENT MESSAGE LOGS
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT timestamp, level, category, message FROM logs WHERE category = 'MESSAGE' ORDER BY timestamp DESC LIMIT 10;"

echo.
echo ========================================
echo    RECENT SESSION LOGS
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT timestamp, level, category, message FROM logs WHERE category = 'SESSION' ORDER BY timestamp DESC LIMIT 10;"

echo.
echo ========================================
echo    RECENT HANDSHAKE LOGS
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT timestamp, level, category, message FROM logs WHERE category = 'HANDSHAKE' ORDER BY timestamp DESC LIMIT 10;"

echo.
echo ========================================
echo    MESSAGE PACKETS
echo ========================================
%MYSQL_PATH% -u spruce_user -pspruce_password_2024 spruce_db -e "SELECT sender, recipient, timestamp, LEFT(encrypted_content, 50) as content_preview FROM message_packets ORDER BY timestamp DESC LIMIT 5;" 2>nul

echo.
echo ========================================
echo    DEBUG COMPLETE
echo ========================================
echo.
echo Look for error messages in the logs above.
echo Common issues:
echo - Key derivation mismatch
echo - Base64 encoding/decoding errors
echo - Session key not properly established
echo - AES-GCM decryption failures
echo.
pause






