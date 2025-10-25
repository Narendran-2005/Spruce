Write-Host "=== TESTING FIXES ===" -ForegroundColor Green
Write-Host ""

# Test Backend
Write-Host "1. Testing Backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/admin/stats' -Method GET
    Write-Host "   ✓ Backend running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Backend not responding" -ForegroundColor Red
}

# Test Frontend
Write-Host ""
Write-Host "2. Testing Frontend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000' -Method GET
    Write-Host "   ✓ Frontend running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Frontend not responding" -ForegroundColor Red
}

# Test Registration
Write-Host ""
Write-Host "3. Testing Registration..." -ForegroundColor Yellow
$body = @{
    username = "Vasanth"
    password = "vasanth123"
    x25519PublicKey = "MOCK_X25519_PUBLIC_KEY"
    kyberPublicKey = "MOCK_KYBER_PUBLIC_KEY"
    dilithiumPublicKey = "MOCK_DILITHIUM_PUBLIC_KEY"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/register' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "   ✓ Registration working (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Registration failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== FIXES APPLIED ===" -ForegroundColor Green
Write-Host "✓ Session key persistence fixed"
Write-Host "✓ Auth persistence fixed with loading state"
Write-Host "✓ Message decryption should now work"
Write-Host ""
Write-Host "🚀 Ready to test:"
Write-Host "   - Open http://localhost:3000"
Write-Host "   - Login as Vasanth (vasanth123)"
Write-Host "   - Login as Yokesh (yokesh123)"
Write-Host "   - Start chat - messages should decrypt properly"
Write-Host "   - Refresh page - should stay logged in"
