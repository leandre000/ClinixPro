# Add Environment Variables to Vercel
Write-Host "Adding environment variables to Vercel..." -ForegroundColor Green

# Environment variables to add
$envVars = @{
    "NEXT_PUBLIC_API_URL" = "http://localhost:8080/api"
    "NEXT_PUBLIC_APP_NAME" = "ClinixPro"
    "NEXT_PUBLIC_APP_VERSION" = "1.0.0"
    "NEXT_PUBLIC_JWT_SECRET" = "364115689b626958012b9d7feb17d295d8889060cd1806a1a42d155898d52188d1ceada7ed4709073cdd26572bdc"
    "NEXT_PUBLIC_ENCRYPTION_KEY" = "359a43f1f0aebced1cc364e6fef57e0e7cc6be4ffb9e2ed9e1315199c1cbbaff"
    "NEXT_PUBLIC_ENABLE_ANALYTICS" = "false"
    "NEXT_PUBLIC_ENABLE_DEBUG_MODE" = "true"
    "NEXT_PUBLIC_ENABLE_MOCK_DATA" = "true"
}

# Add each environment variable
foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding $key = $value" -ForegroundColor Yellow
    
    # Create a temporary file with the value
    $value | Out-File -FilePath "temp_value.txt" -Encoding UTF8
    
    # Add the environment variable
    echo $value | vercel env add $key production
    
    # Clean up
    Remove-Item "temp_value.txt" -ErrorAction SilentlyContinue
}

Write-Host "Environment variables added successfully!" -ForegroundColor Green
Write-Host "Now deploying to Vercel..." -ForegroundColor Cyan

# Deploy to Vercel
vercel --prod 