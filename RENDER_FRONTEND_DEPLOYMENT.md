# 🚀 AI Form Builder Frontend - Render Deployment Guide

## 📋 Step-by-Step Render Deployment

### **Step 1: Prepare Your Repository**
1. Make sure all your code is committed and pushed to GitHub
2. Ensure your repository is public or connected to Render

### **Step 2: Create Web Service on Render**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `https://github.com/Jadu07/AI-Form-Builder2`

### **Step 3: Configure Your Service**

**Basic Settings:**
- **Name**: `ai-form-builder-frontend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `frontend`

**Build & Deploy Settings:**
- **Build Command**: `npm install --legacy-peer-deps && npm run build`
- **Start Command**: `npm run preview --port 10000 --host 0.0.0.0`

### **Step 4: Environment Variables**
Add these environment variables in Render:

```env
VITE_API_URL=https://ai-form-builder-s4hj.onrender.com
VITE_NODE_ENV=production
NODE_ENV=production
```

### **Step 5: Advanced Settings**
- **Plan**: `Free` (or upgrade for better performance)
- **Auto-Deploy**: `Yes` (deploys automatically on git push)
- **Health Check Path**: Leave empty

### **Step 6: Deploy**
1. Click **"Create Web Service"**
2. Wait for the build to complete (5-10 minutes)
3. Your frontend will be available at: `https://your-service-name.onrender.com`

## 🔧 Alternative Configuration (If Issues Persist)

If you encounter any issues, try this alternative configuration:

**Build Command:**
```bash
cd frontend && npm ci --legacy-peer-deps && npx vite build
```

**Start Command:**
```bash
cd frontend && npx vite preview --port 10000 --host 0.0.0.0
```

## 📁 Required Files Structure

Make sure your repository has this structure:
```
AI-Form-Builder2/
├── frontend/
│   ├── package.json
│   ├── .npmrc
│   ├── vite.config.js
│   ├── src/
│   └── public/
├── Backend/
└── README.md
```

## 🔍 Troubleshooting Common Issues

### **Issue 1: Build Fails**
- **Solution**: Use `npm install --legacy-peer-deps` in build command
- **Alternative**: Use `npm ci --legacy-peer-deps`

### **Issue 2: Vite Not Found**
- **Solution**: Use `npx vite` commands
- **Check**: Ensure vite is in dependencies (not devDependencies)

### **Issue 3: Port Issues**
- **Solution**: Use `--port 10000 --host 0.0.0.0` flags
- **Note**: Render requires port 10000

### **Issue 4: Environment Variables Not Working**
- **Solution**: Use `VITE_` prefix for Vite environment variables
- **Check**: Variables are set in Render dashboard

## 🧪 Testing Your Deployment

After deployment, test these URLs:

1. **Main App**: `https://your-frontend.onrender.com`
2. **Login**: `https://your-frontend.onrender.com/login`
3. **Register**: `https://your-frontend.onrender.com/register`
4. **Dashboard**: `https://your-frontend.onrender.com/dashboard`
5. **Form Builder**: `https://your-frontend.onrender.com/forms/new`

## 🔄 Updating Your Deployment

To update your deployment:
1. Make changes to your code
2. Commit and push to GitHub
3. Render will automatically redeploy
4. Check the logs if deployment fails

## 📊 Monitoring Your Service

1. **Logs**: Check Render dashboard logs for errors
2. **Metrics**: Monitor response times and errors
3. **Health**: Service should show "Live" status

## 🚨 Important Notes

1. **Free Plan Limitations**:
   - Service sleeps after 15 minutes of inactivity
   - Cold start takes ~30 seconds
   - Consider upgrading for production use

2. **Environment Variables**:
   - Never commit `.env` files to Git
   - Use Render dashboard to set environment variables
   - Restart service after changing environment variables

3. **Build Time**:
   - First build may take 5-10 minutes
   - Subsequent builds are faster
   - Check logs if build takes too long

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Service Logs**: Check Render dashboard
- **Community**: Render Discord/Forums

## 🎉 Success Checklist

- [ ] Service shows "Live" status
- [ ] Frontend loads without errors
- [ ] Login/Register functionality works
- [ ] Form builder loads correctly
- [ ] API calls to backend succeed
- [ ] No console errors in browser

Your AI Form Builder frontend will be live and ready to use! 🚀
