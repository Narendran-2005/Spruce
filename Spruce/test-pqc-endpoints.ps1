Write-Host "Testing PQC Endpoints..."
Write-Host ""

# Test Kyber key generation
Write-Host "1. Testing Kyber key generation..."
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/crypto/kyber/generate' -Method POST -ContentType 'application/json'
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host ""

# Test Dilithium key generation
Write-Host "2. Testing Dilithium key generation..."
try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/crypto/dilithium/generate' -Method POST -ContentType 'application/json'
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "PQC endpoint testing complete."

