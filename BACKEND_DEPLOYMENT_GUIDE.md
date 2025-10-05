# 🚀 AI Form Builder Backend - Render Deployment Guide

## 📋 **Deploy Backend for Vercel Frontend**

Your frontend is already deployed on Vercel at: [https://ai-form-builder2.vercel.app/](https://ai-form-builder2.vercel.app/)

Now let's deploy your backend on Render to work with this frontend.

## 🔧 **Step 1: Update Backend Environment**

First, let's update the backend environment to work with your Vercel frontend:

### **Environment Variables for Render:**

```env
# Database Configuration - Supabase
DATABASE_URL="postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here

# OpenRouter API Key for AI functionality
OPENROUTER_API_KEY=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

# Server Configuration
PORT=10000
NODE_ENV=production

# Frontend URL for CORS - UPDATED FOR VERCEL
FRONTEND_URL=https://ai-form-builder2.vercel.app

# Supabase Configuration
SUPABASE_URL=https://qbzrlhmfxfrthcayccwh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NzY0NTYsImV4cCI6MjA3NTE1MjQ1Nn0.t8dbQS8W04nTzcQGh7pkvEurp3058Ql7PEKd9aRRIT0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU3NjQ1NiwiZXhwIjoyMDc1MTUyNDU2fQ.-2W5Q8IOpFBvTIPRJIWubO2tVfGMvnAbMu-0fQXhMYU
```

## 🚀 **Step 2: Render Deployment Configuration**

### **Service Settings:**
- **Name**: `ai-form-builder-backend`
- **Environment**: `Node`
- **Root Directory**: `Backend`
- **Branch**: `main`
- **Plan**: `Free`

### **Build & Deploy Settings:**
- **Build Command**: `npm install && npx prisma generate && npx prisma db push`
- **Start Command**: `npm start`

### **Environment Variables in Render Dashboard:**
Add these environment variables in the Render dashboard:

```env
DATABASE_URL="postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
JWT_SECRET=your-super-secret-jwt-key-here
OPENROUTER_API_KEY=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
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://ai-form-builder2.vercel.app
SUPABASE_URL=https://qbzrlhmfxfrthcayccwh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NzY0NTYsImV4cCI6MjA3NTE1MjQ1Nn0.t8dbQS8W04nTzcQGh7pkvEurp3058Ql7PEKd9aRRIT0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU3NjQ1NiwiZXhwIjoyMDc1MTUyNDU2fQ.-2W5Q8IOpFBvTIPRJIWubO2tVfGMvnAbMu-0fQXhMYU
```

## 🔧 **Step 3: Update Frontend Environment**

You'll also need to update your frontend's environment variables to point to the new backend URL.

### **Frontend Environment Variables:**
```env
VITE_API_URL=https://your-backend-name.onrender.com
VITE_NODE_ENV=production
```

## 📋 **Step 4: Deployment Steps**

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub**: `https://github.com/Jadu07/AI-Form-Builder2`
4. **Configure Service** with the settings above
5. **Add Environment Variables** as listed above
6. **Deploy**

## 🧪 **Step 5: Testing After Deployment**

Once deployed, test these endpoints:

- **Health Check**: `https://your-backend.onrender.com/api/health`
- **Login**: `https://your-backend.onrender.com/api/auth/login`
- **Register**: `https://your-backend.onrender.com/api/auth/register`
- **Forms**: `https://your-backend.onrender.com/api/forms`

## 🔄 **Step 6: Update Frontend**

After backend deployment, update your frontend's environment variables:

1. **Go to Vercel Dashboard**
2. **Find your project**: `ai-form-builder2`
3. **Go to Settings** → **Environment Variables**
4. **Update**: `VITE_API_URL` to your new backend URL
5. **Redeploy** the frontend

## 🎉 **Final Result**

- **Frontend**: [https://ai-form-builder2.vercel.app/](https://ai-form-builder2.vercel.app/)
- **Backend**: `https://your-backend-name.onrender.com`
- **Database**: Supabase (already configured)

## 📞 **Important Notes**

1. **CORS**: Backend is configured to allow your Vercel frontend
2. **Database**: Already connected to Supabase
3. **AI**: OpenRouter API key is configured
4. **Authentication**: JWT secret is set

Your AI Form Builder will be fully functional with the Vercel frontend and Render backend!
