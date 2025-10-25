$body = @{
    username = 'testuser'
    password = 'testpass123'
    x25519PublicKey = 'testkey123'
    kyberPublicKey = 'testkey456'
    dilithiumPublicKey = 'testkey789'
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/register' -Method POST -Body $body -ContentType 'application/json'
    Write-Host "Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}

