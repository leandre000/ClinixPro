# ClinixPro Database Reset Script (PowerShell)
# This script will reset your database and initialize it with secure user credentials

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ClinixPro Database Reset Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will reset your database and initialize it with secure user credentials." -ForegroundColor Yellow
Write-Host ""

Write-Host "Default users will be created with BCrypt hashed passwords:" -ForegroundColor Green
Write-Host "- Admin: admin@clinixpro.com (password: admin123)" -ForegroundColor White
Write-Host "- Doctor: doctor@clinixpro.com (password: doctor123)" -ForegroundColor White
Write-Host "- Pharmacist: pharmacist@clinixpro.com (password: pharmacist123)" -ForegroundColor White
Write-Host "- Receptionist: receptionist@clinixpro.com (password: receptionist123)" -ForegroundColor White
Write-Host ""

Write-Host "WARNING: This will delete all existing data!" -ForegroundColor Red
Write-Host ""

$confirm = Read-Host "Are you sure you want to continue? (y/N)"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "Database reset cancelled." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Resetting database..." -ForegroundColor Green
Write-Host ""

# Check if PostgreSQL is running
try {
    $pgCheck = & pg_isready -U postgres 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "PostgreSQL not accessible"
    }
} catch {
    Write-Host "ERROR: PostgreSQL is not running or not accessible." -ForegroundColor Red
    Write-Host "Please start PostgreSQL and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Reset the database
try {
    & psql -U postgres -f reset-database.sql
    if ($LASTEXITCODE -ne 0) {
        throw "Database reset failed"
    }
} catch {
    Write-Host ""
    Write-Host "ERROR: Database reset failed!" -ForegroundColor Red
    Write-Host "Please check your PostgreSQL installation and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Database reset completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start the ClinixPro application." -ForegroundColor Green
Write-Host ""

Read-Host "Press Enter to exit" 