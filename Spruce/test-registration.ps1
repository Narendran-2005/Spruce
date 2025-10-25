$body = @{
    username = "testuser"
    password = "testpass123"
    x25519PublicKey = "MOCK_X25519_PUBLIC_KEY"
    kyberPublicKey = "MOCK_KYBER_PUBLIC_KEY"
    dilithiumPublicKey = "MOCK_DILITHIUM_PUBLIC_KEY"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/register' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "Registration Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Registration Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $responseStream = $_.Exception.Response.GetResponseStream()
        $streamReader = New-Object System.IO.StreamReader($responseStream)
        $responseBody = $streamReader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
