# Quick Deployment Guide - ClinixPro to Vercel

## Prerequisites ✅
- Node.js installed
- Git repository
- Vercel account (free at https://vercel.com)

## Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

## Step 2: Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate with your Vercel account.

## Step 3: Deploy to Vercel

### Option A: Interactive Deployment (Recommended)
```bash
vercel
```

**Follow these prompts:**
1. ✅ **Set up and deploy?** → `yes`
2. ✅ **Which scope?** → Select your account
3. ✅ **Link to existing project?** → `no` (create new project)
4. ✅ **What's the name of your project?** → `clinixpro` (or any name you prefer)
5. ✅ **In which directory is your code located?** → `./` (current directory)
6. ✅ **Want to override the settings?** → `no` (use defaults)

### Option B: Production Deployment
```bash
vercel --prod
```

## Step 4: Configure Environment Variables

After deployment, go to your Vercel dashboard and add these environment variables:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_APP_NAME=ClinixPro
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_JWT_SECRET=your-secure-jwt-secret
NEXT_PUBLIC_ENCRYPTION_KEY=your-secure-encryption-key
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_ENABLE_MOCK_DATA=false
```

## Step 5: Backend Deployment

Since your backend is a Spring Boot application, you need to deploy it separately:

### Option A: Deploy Backend to Railway
1. Go to https://railway.app
2. Create a new project
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Add environment variables for your database
6. Deploy

### Option B: Deploy Backend to Render
1. Go to https://render.com
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the root directory to `backend`
5. Configure environment variables
6. Deploy

### Option C: Deploy Backend to Heroku
1. Go to https://heroku.com
2. Create a new app
3. Connect your GitHub repository
4. Set buildpacks for Java
5. Configure environment variables
6. Deploy

## Step 6: Update Frontend API URL

After deploying your backend:
1. Go to your Vercel project settings
2. Update `NEXT_PUBLIC_API_URL` to point to your deployed backend URL
3. Redeploy your frontend

## Troubleshooting

### Build Errors
If you encounter build errors:
1. Check that all dependencies are installed: `npm install`
2. Clear Next.js cache: `rm -rf .next`
3. Try building locally: `npm run build`

### API Connection Issues
1. Ensure your backend is deployed and accessible
2. Check CORS settings in your backend
3. Verify the API URL in environment variables

### Common Issues
- **"Module not found"**: Run `npm install` to install dependencies
- **"Build failed"**: Check the build logs in Vercel dashboard
- **"API errors"**: Ensure backend is deployed and URL is correct

## Post-Deployment Checklist

- [ ] Frontend is accessible at the provided URL
- [ ] Backend API is deployed and accessible
- [ ] Environment variables are configured
- [ ] API calls are working
- [ ] Authentication is working
- [ ] All features are functional

## Support

If you need help:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints
4. Check browser console for errors

## Quick Commands

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

Your ClinixPro application should now be live! 🎉 