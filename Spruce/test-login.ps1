$body = @{
    username = "testuser"
    password = "testpass123"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/login' -Method POST -ContentType 'application/json' -Body $body
    Write-Host "Login Status: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Login Error: $($_.Exception.Message)"
    if ($_.Exception.Response) {
        $responseStream = $_.Exception.Response.GetResponseStream()
        $streamReader = New-Object System.IO.StreamReader($responseStream)
        $responseBody = $streamReader.ReadToEnd()
        Write-Host "Response Body: $responseBody"
    }
}
