@echo off
echo ========================================
echo    Test Registration Flow
echo ========================================
echo.

echo Testing backend connectivity...
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:8080/api/admin/stats' -Method GET | Select-Object StatusCode } catch { Write-Host 'Backend not running' }"

echo.
echo Testing registration endpoint...
powershell -Command "try { $body = @{ username='testuser'; password='testpass'; x25519PublicKey='testkey'; kyberPublicKey='testkey'; dilithiumPublicKey='testkey' } | ConvertTo-Json; Invoke-WebRequest -Uri 'http://localhost:8080/api/auth/register' -Method POST -Body $body -ContentType 'application/json' | Select-Object StatusCode, Content } catch { Write-Host 'Registration failed:' $_.Exception.Message }"

echo.
echo ========================================
echo    Test Complete
echo ========================================
pause

