# ClinixPro Vercel Deployment Script
# This script will help you deploy your Next.js application to Vercel

Write-Host "🚀 Starting ClinixPro deployment to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI is installed: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
}

# Check if user is logged in
try {
    $whoami = vercel whoami
    Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green
} catch {
    Write-Host "❌ Not logged in. Please run: vercel login" -ForegroundColor Red
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
Write-Host "This will open an interactive prompt. Please follow the instructions:" -ForegroundColor Cyan
Write-Host "1. Choose 'yes' to set up and deploy" -ForegroundColor White
Write-Host "2. Select your scope" -ForegroundColor White
Write-Host "3. Choose 'no' to create a new project" -ForegroundColor White
Write-Host "4. Enter a project name (e.g., 'clinixpro')" -ForegroundColor White
Write-Host "5. Choose your preferred settings" -ForegroundColor White

vercel --prod

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "Your application should now be live at the URL provided above." -ForegroundColor Cyan 