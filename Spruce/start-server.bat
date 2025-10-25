@echo off
echo ========================================
echo    Spruce Server (Multi-System Setup)
echo ========================================
echo.

REM Get server IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set SERVER_IP=%%a
    goto :found
)
:found

echo Server IP Address: %SERVER_IP%
echo.
echo This server will accept connections from:
echo - Client A: http://[CLIENT_A_IP]:3000
echo - Client B: http://[CLIENT_B_IP]:3001
echo - Admin: http://%SERVER_IP%:8080/admin
echo.

REM Set MySQL environment variables
set SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/spruce_db
set SPRING_DATASOURCE_DRIVER=com.mysql.cj.jdbc.Driver
set SPRING_DATASOURCE_USERNAME=spruce_user
set SPRING_DATASOURCE_PASSWORD=spruce_password_2024
set SPRING_JPA_DDL_AUTO=update
set SPRING_JPA_DIALECT=org.hibernate.dialect.MySQL8Dialect

echo Starting Spruce Server...
echo Backend will be available at: http://%SERVER_IP%:8080
echo.

cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=server

pause






