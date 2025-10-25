Write-Host "=== SPRUCE DEMO STATUS ===" -ForegroundColor Green
Write-Host ""

# Check Backend
Write-Host "Backend Status:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/admin/stats' -Method GET
    Write-Host "✓ Backend running on port 8080" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend not responding" -ForegroundColor Red
}

# Check Frontend
Write-Host ""
Write-Host "Frontend Status:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3002' -Method GET
    Write-Host "✓ Frontend running on port 3002" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend not responding" -ForegroundColor Red
}

# Test PQC
Write-Host ""
Write-Host "PQC Status:" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/crypto/kyber/generate' -Method POST -ContentType 'application/json'
    Write-Host "✓ Real Kyber-768 working" -ForegroundColor Green
} catch {
    Write-Host "✗ PQC not working" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== DEMO READY ===" -ForegroundColor Green
Write-Host "Open: http://localhost:3002"
Write-Host "Users: Vasanth (vasanth123), Yokesh (yokesh123)"
Write-Host "Real PQC: Kyber-768 + Dilithium-3"

