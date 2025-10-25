# Spruce MySQL Setup - PowerShell Version
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Spruce MySQL Setup (PowerShell)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set MySQL path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

Write-Host "Using MySQL at: $mysqlPath" -ForegroundColor Yellow
Write-Host ""

# Check if MySQL exists
if (-not (Test-Path $mysqlPath)) {
    Write-Host "ERROR: MySQL not found at expected location" -ForegroundColor Red
    Write-Host "Please check your MySQL installation" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "MySQL found ✓" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Creating database and user..." -ForegroundColor Yellow
Write-Host "Please enter your MySQL root password when prompted." -ForegroundColor Yellow
Write-Host ""

# Read the SQL file content
$sqlContent = Get-Content "setup-mysql-db.sql" -Raw

# Run the SQL commands
try {
    $sqlContent | & $mysqlPath -u root -p
    
    Write-Host ""
    Write-Host "✓ Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Step 2: Testing connection..." -ForegroundColor Yellow
    Write-Host "Testing connection to spruce_db..."
    
    $testQuery = "SELECT 'Connection successful!' as status, NOW() as timestamp;"
    $testResult = & $mysqlPath -u spruce_user -pspruce_password_2024 spruce_db -e $testQuery
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL connection test successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Step 3: Starting backend with MySQL..." -ForegroundColor Yellow
        Write-Host "Press any key to start the backend..."
        Read-Host
        & ".\start-backend-mysql.bat"
    } else {
        Write-Host "✗ Connection test failed!" -ForegroundColor Red
        Write-Host "Please check the database setup." -ForegroundColor Red
        Read-Host "Press Enter to exit"
    }
} catch {
    Write-Host ""
    Write-Host "✗ Database setup failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual setup:" -ForegroundColor Yellow
    Write-Host "1. Open MySQL Workbench" -ForegroundColor White
    Write-Host "2. Connect to your MySQL server" -ForegroundColor White
    Write-Host "3. Run the commands in setup-mysql-db.sql" -ForegroundColor White
    Write-Host "4. Then run: start-backend-mysql.bat" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
}






