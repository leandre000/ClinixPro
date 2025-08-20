# ClinixPro Render Backend Test Script
# Test your deployed backend on Render

param(
    [string]$BackendUrl = "https://clinixpro-backend.onrender.com"
)

Write-Host "🧪 ClinixPro Render Backend Test Script" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

$apiUrl = "$BackendUrl/api"

Write-Host "🔗 Testing backend at: $apiUrl" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$apiUrl/health" -Method Get -TimeoutSec 30
    Write-Host "   ✅ Health Check: $($healthResponse.status)" -ForegroundColor Green
    Write-Host "   📅 Timestamp: $($healthResponse.timestamp)" -ForegroundColor Cyan
    Write-Host "   🗄️  Database: $($healthResponse.database)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Health Check Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: CORS Preflight
Write-Host "2️⃣ Testing CORS Configuration..." -ForegroundColor Yellow
try {
    $corsResponse = Invoke-WebRequest -Uri "$apiUrl/health" -Method Options -TimeoutSec 30
    $corsHeaders = $corsResponse.Headers
    
    if ($corsHeaders.'Access-Control-Allow-Origin') {
        Write-Host "   ✅ CORS Origin: $($corsHeaders.'Access-Control-Allow-Origin')" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  CORS Origin header not found" -ForegroundColor Yellow
    }
    
    if ($corsHeaders.'Access-Control-Allow-Methods') {
        Write-Host "   ✅ CORS Methods: $($corsHeaders.'Access-Control-Allow-Methods')" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  CORS Methods header not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ CORS Test Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Response Time
Write-Host "3️⃣ Testing Response Time..." -ForegroundColor Yellow
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    $response = Invoke-WebRequest -Uri "$apiUrl/health" -Method Get -TimeoutSec 30
    $stopwatch.Stop()
    
    $responseTime = $stopwatch.ElapsedMilliseconds
    Write-Host "   ✅ Response Time: ${responseTime}ms" -ForegroundColor Green
    
    if ($responseTime -lt 1000) {
        Write-Host "   🚀 Excellent performance!" -ForegroundColor Green
    } elseif ($responseTime -lt 3000) {
        Write-Host "   ⚡ Good performance" -ForegroundColor Yellow
    } else {
        Write-Host "   🐌 Slow response time" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Response Time Test Failed: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: SSL Certificate
Write-Host "4️⃣ Testing SSL Certificate..." -ForegroundColor Yellow
try {
    $sslTest = Invoke-WebRequest -Uri "$apiUrl/health" -Method Get -TimeoutSec 30
    if ($sslTest.BaseResponse.ResponseUri.Scheme -eq "https") {
        Write-Host "   ✅ HTTPS enabled" -ForegroundColor Green
        Write-Host "   🔒 SSL Certificate: Valid" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  HTTP only (no SSL)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ SSL Test Failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Frontend Integration Test:" -ForegroundColor Cyan
Write-Host "   Update your frontend with this API URL:" -ForegroundColor White
Write-Host "   NEXT_PUBLIC_API_URL=$apiUrl" -ForegroundColor Green

Write-Host ""
Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Deploy frontend to Vercel" -ForegroundColor White
Write-Host "2. Update environment variables" -ForegroundColor White
Write-Host "3. Test full application" -ForegroundColor White

Write-Host ""
Write-Host "✨ Backend testing complete!" -ForegroundColor Green
