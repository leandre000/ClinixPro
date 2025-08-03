# ClinixPro Vercel Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Git** (for version control)
3. **Vercel CLI** (will be installed in steps below)
4. **Vercel Account** (free at https://vercel.com)

## Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

## Step 2: Login to Vercel

```bash
vercel login
```

## Step 3: Configure Environment Variables

Before deploying, you need to set up your environment variables in Vercel:

### Option A: Using Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Create a new project
3. Go to Settings > Environment Variables
4. Add the following variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_NAME=ClinixPro
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_ENCRYPTION_KEY=your-encryption-key
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

### Option B: Using Vercel CLI
```bash
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_APP_NAME
vercel env add NEXT_PUBLIC_APP_VERSION
vercel env add NEXT_PUBLIC_JWT_SECRET
vercel env add NEXT_PUBLIC_ENCRYPTION_KEY
vercel env add NEXT_PUBLIC_ENABLE_ANALYTICS
vercel env add NEXT_PUBLIC_ENABLE_DEBUG_MODE
vercel env add NEXT_PUBLIC_ENABLE_MOCK_DATA
```

## Step 4: Deploy to Vercel

### First Deployment
```bash
vercel
```

### For Production Deployment
```bash
vercel --prod
```

## Step 5: Configure Custom Domain (Optional)

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Domains
4. Add your custom domain

## Step 6: Backend Deployment

Since your backend is a Spring Boot application, you'll need to deploy it separately:

### Option A: Deploy Backend to Railway/Render/Heroku
1. Create a `.env` file in your backend directory
2. Deploy the backend to a platform that supports Java applications
3. Update the `NEXT_PUBLIC_API_URL` in Vercel to point to your deployed backend

### Option B: Use Vercel Serverless Functions
Convert your backend API calls to Vercel serverless functions in the `/api` directory.

## Important Notes

1. **Backend Integration**: Make sure your backend is deployed and accessible before deploying the frontend
2. **Environment Variables**: All environment variables starting with `NEXT_PUBLIC_` will be available in the browser
3. **Build Process**: Vercel will automatically run `npm run build` during deployment
4. **Custom Domains**: You can add custom domains in the Vercel dashboard
5. **Environment Variables**: Set different values for Production, Preview, and Development environments

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check that all dependencies are in `package.json`
2. **API Errors**: Ensure your backend URL is correct and accessible
3. **Environment Variables**: Make sure all required variables are set in Vercel dashboard
4. **CORS Issues**: Configure your backend to allow requests from your Vercel domain

### Useful Commands:

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Remove deployment
vercel remove

# Update environment variables
vercel env pull .env.local
```

## Post-Deployment Checklist

- [ ] Frontend is accessible at the provided URL
- [ ] Backend API is accessible and responding
- [ ] All environment variables are properly set
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active
- [ ] Performance monitoring is set up
- [ ] Error tracking is configured

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Verify environment variables are set correctly
3. Ensure backend is accessible from the internet
4. Check browser console for any frontend errors 