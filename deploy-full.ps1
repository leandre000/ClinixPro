# ClinixPro Full Deployment Script
# This script will help you deploy both backend (Render) and frontend (Vercel)

Write-Host "🚀 Starting ClinixPro Full Deployment..." -ForegroundColor Green
Write-Host "This will deploy backend to Render and frontend to Vercel" -ForegroundColor Cyan

# Check if Git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not found. Initializing..." -ForegroundColor Red
    git init
    git add .
    git commit -m "Initial commit - ClinixPro deployment ready"
}

# Check if remote repository is set
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "⚠️  No remote repository found." -ForegroundColor Yellow
    Write-Host "Please create a GitHub repository and run:" -ForegroundColor White
    Write-Host "git remote add origin https://github.com/yourusername/clinixpro.git" -ForegroundColor Cyan
    Write-Host "git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to continue with deployment setup..." -ForegroundColor Yellow
    Read-Host
}

# Step 1: Backend Deployment (Render)
Write-Host ""
Write-Host "📋 Step 1: Backend Deployment to Render" -ForegroundColor Green
Write-Host "1. Go to https://render.com" -ForegroundColor White
Write-Host "2. Sign up/Login with your GitHub account" -ForegroundColor White
Write-Host "3. Click 'New +' and select 'Web Service'" -ForegroundColor White
Write-Host "4. Connect your GitHub repository" -ForegroundColor White
Write-Host "5. Configure the service:" -ForegroundColor White
Write-Host "   - Name: clinixpro-backend" -ForegroundColor Cyan
Write-Host "   - Root Directory: backend" -ForegroundColor Cyan
Write-Host "   - Environment: Java" -ForegroundColor Cyan
Write-Host "   - Build Command: ./mvnw clean install -DskipTests" -ForegroundColor Cyan
Write-Host "   - Start Command: java -jar target/*.jar" -ForegroundColor Cyan
Write-Host "6. Add Environment Variables:" -ForegroundColor White
Write-Host "   - SPRING_PROFILES_ACTIVE=production" -ForegroundColor Cyan
Write-Host "   - SERVER_PORT=8080" -ForegroundColor Cyan
Write-Host "   - SERVER_SERVLET_CONTEXT_PATH=/api" -ForegroundColor Cyan
Write-Host "   - JWT_SECRET=364115689b626958012b9d7feb17d295d8889060cd1806a1a42d155898d52188d1ceada7ed4709073cdd26572bdc" -ForegroundColor Cyan
Write-Host "7. Click 'Create Web Service'" -ForegroundColor White

Write-Host ""
Write-Host "Press any key after you've created the Render service..." -ForegroundColor Yellow
Read-Host

# Step 2: Database Setup (Render)
Write-Host ""
Write-Host "📋 Step 2: Database Setup" -ForegroundColor Green
Write-Host "1. In your Render dashboard, click 'New +' and select 'PostgreSQL'" -ForegroundColor White
Write-Host "2. Name it: clinixpro-db" -ForegroundColor White
Write-Host "3. Choose your plan (Free tier is fine for testing)" -ForegroundColor White
Write-Host "4. Click 'Create Database'" -ForegroundColor White
Write-Host "5. Copy the database URL and credentials" -ForegroundColor White
Write-Host "6. Go back to your backend service and add these environment variables:" -ForegroundColor White
Write-Host "   - SPRING_DATASOURCE_URL=<your-database-url>" -ForegroundColor Cyan
Write-Host "   - SPRING_DATASOURCE_USERNAME=<your-db-username>" -ForegroundColor Cyan
Write-Host "   - SPRING_DATASOURCE_PASSWORD=<your-db-password>" -ForegroundColor Cyan

Write-Host ""
Write-Host "Press any key after you've set up the database..." -ForegroundColor Yellow
Read-Host

# Step 3: Frontend Deployment (Vercel)
Write-Host ""
Write-Host "📋 Step 3: Frontend Deployment to Vercel" -ForegroundColor Green
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Sign up/Login with your GitHub account" -ForegroundColor White
Write-Host "3. Click 'New Project'" -ForegroundColor White
Write-Host "4. Import your GitHub repository" -ForegroundColor White
Write-Host "5. Configure the project:" -ForegroundColor White
Write-Host "   - Framework Preset: Next.js" -ForegroundColor Cyan
Write-Host "   - Root Directory: ./ (leave empty)" -ForegroundColor Cyan
Write-Host "   - Build Command: npm run build" -ForegroundColor Cyan
Write-Host "   - Output Directory: .next" -ForegroundColor Cyan
Write-Host "6. Add Environment Variables:" -ForegroundColor White
Write-Host "   - NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api" -ForegroundColor Cyan
Write-Host "   - NEXT_PUBLIC_APP_NAME=ClinixPro" -ForegroundColor Cyan
Write-Host "   - NEXT_PUBLIC_APP_VERSION=1.0.0" -ForegroundColor Cyan
Write-Host "   - NEXT_PUBLIC_JWT_SECRET=364115689b626958012b9d7feb17d295d8889060cd1806a1a42d155898d52188d1ceada7ed4709073cdd26572bdc" -ForegroundColor Cyan
Write-Host "   - NEXT_PUBLIC_ENCRYPTION_KEY=359a43f1f0aebced1cc364e6fef57e0e7cc6be4ffb9e2ed9e1315199c1cbbaff" -ForegroundColor Cyan
Write-Host "   - NEXT_PUBLIC_ENABLE_ANALYTICS=false" -ForegroundColor Cyan
Write-Host "   - NEXT_PUBLIC_ENABLE_DEBUG_MODE=false" -ForegroundColor Cyan
Write-Host "   - NEXT_PUBLIC_ENABLE_MOCK_DATA=false" -ForegroundColor Cyan
Write-Host "7. Click 'Deploy'" -ForegroundColor White

Write-Host ""
Write-Host "Press any key after you've created the Vercel project..." -ForegroundColor Yellow
Read-Host

# Step 4: Update CORS and URLs
Write-Host ""
Write-Host "📋 Step 4: Update Configuration" -ForegroundColor Green
Write-Host "1. Get your Vercel frontend URL" -ForegroundColor White
Write-Host "2. Go to your Render backend service" -ForegroundColor White
Write-Host "3. Add this environment variable:" -ForegroundColor White
Write-Host "   - SPRING_WEB_CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app" -ForegroundColor Cyan
Write-Host "4. Redeploy your backend service" -ForegroundColor White

Write-Host ""
Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
Write-Host "Your ClinixPro application should now be live!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Frontend: https://your-frontend-url.vercel.app" -ForegroundColor White
Write-Host "Backend: https://your-backend-url.onrender.com/api" -ForegroundColor White
Write-Host ""
Write-Host "Don't forget to test all features after deployment!" -ForegroundColor Yellow 