# ClinixPro Deployment Environment Variables

## Frontend Environment Variables (for Vercel)

Copy these to your Vercel dashboard under Settings > Environment Variables:

```bash
# API Configuration (Update after backend deployment)
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
NEXT_PUBLIC_APP_NAME=ClinixPro
NEXT_PUBLIC_APP_VERSION=1.0.0

# Security Configuration (Generated secure secrets)
NEXT_PUBLIC_JWT_SECRET=364115689b626958012b9d7feb17d295d8889060cd1806a1a42d155898d52188d1ceada7ed4709073cdd26572bdc
NEXT_PUBLIC_ENCRYPTION_KEY=359a43f1f0aebced1cc364e6fef57e0e7cc6be4ffb9e2ed9e1315199c1cbbaff

# Feature Flags (Production settings)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

## Backend Environment Variables (for Render)

Copy these to your Render dashboard under Environment Variables:

```bash
# Database Configuration
SPRING_DATASOURCE_URL=jdbc:postgresql://your-database-url:5432/clinixpro
SPRING_DATASOURCE_USERNAME=your-db-username
SPRING_DATASOURCE_PASSWORD=your-db-password

# JWT Configuration
JWT_SECRET=364115689b626958012b9d7feb17d295d8889060cd1806a1a42d155898d52188d1ceada7ed4709073cdd26572bdc
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Server Configuration
SERVER_PORT=8080
SERVER_SERVLET_CONTEXT_PATH=/api

# CORS Configuration (Update with your frontend URL)
SPRING_WEB_CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
SPRING_WEB_CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS,PATCH
SPRING_WEB_CORS_ALLOWED_HEADERS=*
SPRING_WEB_CORS_ALLOW_CREDENTIALS=true

# Application Configuration
APP_NAME=ClinixPro
APP_VERSION=1.0.0
APP_ENVIRONMENT=production
```

## Important Notes:

1. **Update URLs**: Replace `your-backend-url.onrender.com` and `your-frontend-url.vercel.app` with your actual deployed URLs
2. **Database**: You'll need to set up a PostgreSQL database (Render provides this)
3. **CORS**: Update the allowed origins to match your frontend URL
4. **Security**: These are production-ready secure secrets

## Deployment Steps:

1. **Backend (Render)**:
   - Deploy backend first
   - Get the backend URL
   - Update frontend environment variables

2. **Frontend (Vercel)**:
   - Deploy frontend
   - Update backend CORS settings
   - Test the connection 