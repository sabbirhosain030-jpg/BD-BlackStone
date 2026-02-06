$response = Invoke-RestMethod -Uri 'http://localhost:3000/api/seed-admin' -Method Get
Write-Host "========================================" -ForegroundColor Green
Write-Host "Admin Seed Result:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
$response | ConvertTo-Json -Depth 10
Write-Host ""
Write-Host "Credentials:" -ForegroundColor Yellow
Write-Host "Email: $($response.credentials.email)" -ForegroundColor Cyan
Write-Host "Password: $($response.credentials.password)" -ForegroundColor Cyan
