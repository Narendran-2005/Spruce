@echo off
echo Starting Spruce Backend Server...
echo.

cd backend

echo Checking Java installation...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or higher
    pause
    exit /b 1
)

echo.
echo Starting Spring Boot application...
echo Server will be available at: http://localhost:8080
echo Admin logs at: http://localhost:8080/api/admin/logs
echo.

mvnw spring-boot:run

pause


