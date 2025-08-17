# ClinixPro Vercel Deployment Script
# Run this script to deploy your frontend to Vercel

Write-Host "🚀 ClinixPro - Vercel Deployment" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI installation..." -ForegroundColor Yellow
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in
Write-Host "Checking Vercel login status..." -ForegroundColor Yellow
try {
    $vercelWhoami = vercel whoami
    Write-Host "✅ Logged in as: $vercelWhoami" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in. Please login first..." -ForegroundColor Red
    Write-Host "Run: vercel login" -ForegroundColor Yellow
    exit 1
}

# Build the project
Write-Host "Building project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "This will open a browser window for configuration..." -ForegroundColor Cyan

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "Your ClinixPro app is now live!" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Check the error messages above." -ForegroundColor Red
}

Write-Host "=================================" -ForegroundColor Green
Write-Host "Deployment script completed!" -ForegroundColor Green
