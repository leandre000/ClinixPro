# ClinixPro Render Deployment Script
# This script helps prepare and deploy your backend to Render

Write-Host "🚀 ClinixPro Render Deployment Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "backend/pom.xml")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "   Expected: backend/pom.xml" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Project structure verified" -ForegroundColor Green

# Check if backend can build locally
Write-Host "🔨 Testing backend build..." -ForegroundColor Yellow
Push-Location backend
try {
    if (Test-Path "mvnw") {
        Write-Host "   Using Maven wrapper..." -ForegroundColor Cyan
        & ./mvnw clean compile -q
    } else {
        Write-Host "   Using system Maven..." -ForegroundColor Cyan
        mvn clean compile -q
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Backend builds successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Backend build failed" -ForegroundColor Red
        Write-Host "   Please fix build issues before deploying" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Error during build test: $_" -ForegroundColor Red
    exit 1
} finally {
    Pop-Location
}

Write-Host ""
Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Push your code to GitHub" -ForegroundColor White
Write-Host "2. Go to https://dashboard.render.com/" -ForegroundColor White
Write-Host "3. Create a new Web Service" -ForegroundColor White
Write-Host "4. Connect your GitHub repository" -ForegroundColor White
Write-Host "5. Configure as Java service with root directory 'backend'" -ForegroundColor White
Write-Host "6. Set environment variables (see RENDER_DEPLOYMENT_GUIDE.md)" -ForegroundColor White
Write-Host "7. Create PostgreSQL database" -ForegroundColor White
Write-Host "8. Link database to service" -ForegroundColor White
Write-Host "9. Deploy!" -ForegroundColor White

Write-Host ""
Write-Host "📚 For detailed instructions, see: RENDER_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host "🔗 Render Dashboard: https://dashboard.render.com/" -ForegroundColor Cyan
Write-Host "🔗 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan

Write-Host ""
Write-Host "✨ Your ClinixPro backend is ready for Render deployment!" -ForegroundColor Green
