# AI Form Builder - Render Deployment Guide

## 🚀 Complete Render Deployment Setup

This guide will help you deploy both frontend and backend on Render as web services.

## 📋 Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **Supabase Database**: Already configured

## 🔧 Backend Deployment (Web Service)

### Step 1: Create Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:

```
Name: ai-form-builder-backend
Environment: Node
Build Command: npm install
Start Command: npm start
Plan: Free (or paid for better performance)
```

### Step 2: Backend Environment Variables
Add these environment variables in Render dashboard:

```env
DATABASE_URL=postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
OPENROUTER_API_KEY=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
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-app.onrender.com
SUPABASE_URL=https://qbzrlhmfxfrthcayccwh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NzY0NTYsImV4cCI6MjA3NTE1MjQ1Nn0.t8dbQS8W04nTzcQGh7pkvEurp3058Ql7PEKd9aRRIT0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU3NjQ1NiwiZXhwIjoyMDc1MTUyNDU2fQ.-2W5Q8IOpFBvTIPRJIWubO2tVfGMvnAbMu-0fQXhMYU
```

### Step 3: Backend Configuration
- **Root Directory**: `Backend`
- **Auto-Deploy**: Yes
- **Branch**: `main`

## 🌐 Frontend Deployment (Web Service)

### Step 1: Create Frontend Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:

```
Name: ai-form-builder-frontend
Environment: Node
Build Command: cd frontend && npm install && npm run build
Start Command: cd frontend && npm run preview
Plan: Free (or paid for better performance)
```

### Step 2: Frontend Environment Variables
Add these environment variables:

```env
VITE_API_URL=https://your-backend-app.onrender.com
VITE_NODE_ENV=production
NODE_ENV=production
```

### Step 3: Frontend Configuration
- **Root Directory**: `frontend`
- **Auto-Deploy**: Yes
- **Branch**: `main`

## 🔄 Update URLs After Deployment

After both services are deployed, update the environment variables:

1. **Backend**: Update `FRONTEND_URL` with your actual frontend URL
2. **Frontend**: Update `VITE_API_URL` with your actual backend URL

## 📁 File Structure for Render

Your repository should have this structure:
```
AI-Form-Builder2/
├── Backend/
│   ├── package.json
│   ├── server.js
│   ├── prisma/
│   └── .env.render
├── frontend/
│   ├── package.json
│   ├── src/
│   └── .env.render
└── README.md
```

## 🛠️ Package.json Scripts

### Backend package.json
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "build": "echo 'No build step required'",
    "postinstall": "npx prisma generate"
  }
}
```

### Frontend package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 10000 --host 0.0.0.0",
    "start": "npm run preview"
  }
}
```

## 🔧 Render Configuration Files

### render.yaml (Optional - for infrastructure as code)
```yaml
services:
  - type: web
    name: ai-form-builder-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        value: postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
      - key: JWT_SECRET
        value: your-super-secret-jwt-key-here-change-this-in-production
      - key: OPENROUTER_API_KEY
        value: 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
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production

  - type: web
    name: ai-form-builder-frontend
    env: node
    plan: free
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm run preview
    envVars:
      - key: VITE_API_URL
        value: https://ai-form-builder-backend.onrender.com
      - key: VITE_NODE_ENV
        value: production
      - key: NODE_ENV
        value: production
```

## 🧪 Testing Deployment

1. **Backend Health Check**: `https://your-backend.onrender.com/api/auth/register`
2. **Frontend Access**: `https://your-frontend.onrender.com`
3. **Test Features**:
   - User registration/login
   - Form creation
   - Form submission
   - Dashboard access

## 🚨 Common Issues & Solutions

### Backend Issues
- **Database Connection**: Verify Supabase credentials
- **CORS Errors**: Check `FRONTEND_URL` environment variable
- **Port Issues**: Ensure `PORT=10000` is set

### Frontend Issues
- **Build Failures**: Check Node.js version compatibility
- **API Errors**: Verify `VITE_API_URL` points to correct backend
- **Static Assets**: Ensure build output is correct

### Performance Optimization
- **Free Plan Limits**: Consider upgrading for better performance
- **Database Queries**: Optimize Prisma queries
- **Caching**: Implement response caching

## 📊 Monitoring

1. **Render Dashboard**: Monitor service health
2. **Logs**: Check service logs for errors
3. **Metrics**: Monitor response times and errors
4. **Database**: Monitor Supabase usage

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **JWT Secret**: Use a strong, unique secret
3. **CORS**: Restrict to known domains
4. **Rate Limiting**: Implement API rate limiting
5. **HTTPS**: Always use HTTPS in production

## 📞 Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Service Logs**: Check Render dashboard logs
- **Community**: Render Discord/Forums
