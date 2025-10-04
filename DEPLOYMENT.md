# AI Form Builder - Deployment Guide

## 🚀 Production Deployment Configuration

Your frontend is now configured to use the production backend at:
**https://ai-form-builder-s4hj.onrender.com**

## 📁 Environment Files

- `.env` - Current environment (production)
- `.env.production` - Production configuration
- `.env.development` - Development configuration

## 🔄 Environment Switching

Use the provided script to switch between environments:

```bash
# Switch to production (deployed backend)
./switch-env.sh prod

# Switch to development (local backend)
./switch-env.sh dev

# Check current environment
./switch-env.sh
```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push to main branch

### Option 2: Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy automatically on push to main branch

### Option 3: Manual Build
```bash
# Build for production
npm run build

# The dist/ folder contains your production build
# Upload contents to any static hosting service
```

## 🔧 Backend Configuration

The backend is already deployed on Render with:
- ✅ CORS configured for production
- ✅ Supabase database connection
- ✅ All API endpoints available

## 🧪 Testing Production

1. **Frontend**: Visit your deployed frontend URL
2. **Authentication**: Test registration/login
3. **Form Builder**: Create new forms
4. **Form Submission**: Test public form submissions
5. **Dashboard**: View responses and analytics

## 📊 Current Status

- ✅ **Frontend**: Configured for production backend
- ✅ **Backend**: Deployed on Render
- ✅ **Database**: Supabase PostgreSQL
- ✅ **CORS**: Configured for production
- ✅ **Environment**: Production-ready

## 🚨 Important Notes

1. **Backend Database**: The deployed backend may need Supabase configuration
2. **Environment Variables**: Ensure all required env vars are set on Render
3. **CORS**: Already configured for production domains
4. **SSL**: Both frontend and backend use HTTPS

## 🔍 Troubleshooting

If you encounter issues:

1. **CORS Errors**: Check if frontend domain is in backend CORS config
2. **Database Errors**: Verify Supabase connection in backend
3. **API Errors**: Check backend logs on Render dashboard
4. **Build Errors**: Ensure all dependencies are installed

## 📞 Support

For deployment issues:
- Check Render logs for backend errors
- Verify environment variables
- Test API endpoints directly
- Check browser console for frontend errors
