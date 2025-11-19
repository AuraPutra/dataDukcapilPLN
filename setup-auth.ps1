# Setup Script - Role-Based Authentication System

Write-Host "=== Setup Role-Based Authentication System ===" -ForegroundColor Green
Write-Host ""

# Step 1: Run migrations
Write-Host "Step 1: Running database migrations..." -ForegroundColor Cyan
php artisan migrate:fresh
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error running migrations!" -ForegroundColor Red
    exit 1
}
Write-Host "Migrations completed successfully!" -ForegroundColor Green
Write-Host ""

# Step 2: Seed users from CSV
Write-Host "Step 2: Seeding users from user.csv..." -ForegroundColor Cyan
php artisan db:seed --class=UserSeeder
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error seeding users!" -ForegroundColor Red
    exit 1
}
Write-Host "Users seeded successfully!" -ForegroundColor Green
Write-Host ""

Write-Host "=== Setup completed successfully! ===" -ForegroundColor Green
Write-Host ""
Write-Host "You can now login with:" -ForegroundColor Yellow
Write-Host "  Email: admin@admin.com" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "Or any other user from user.csv using:" -ForegroundColor Yellow
Write-Host "  Email: [USERNAME]@pln.co.id (e.g., PLNBKN@pln.co.id)" -ForegroundColor White
Write-Host "  Password: [USERNAME from CSV] (e.g., PLNBKN)" -ForegroundColor White
