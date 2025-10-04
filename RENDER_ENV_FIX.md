# 🔧 Render Environment Variables Fix Guide

## 🚨 **Problem Identified**

Your backend is failing to start on Render because it can't find the `DATABASE_URL` environment variable. The error shows:

```
❌ Database connection failed: error: Environment variable not found: DATABASE_URL.
```

## 🔍 **Root Cause**

The issue is that Render isn't properly loading the environment variables into your backend service. This can happen for several reasons:

1. **Environment variables not set in Render dashboard**
2. **Wrong service configuration**
3. **Environment variable names mismatch**
4. **Render service not reading .env files**

## ✅ **Solution Steps**

### **Step 1: Check Render Dashboard**

1. **Go to your Render dashboard**: https://dashboard.render.com
2. **Find your backend service** (should be named `ai-form-builder-backend`)
3. **Click on the service name** to open its settings
4. **Go to "Environment" tab**

### **Step 2: Add Required Environment Variables**

In the Render dashboard, add these environment variables:

```bash
DATABASE_URL=postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-here
OPENROUTER_API_KEY=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
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://ai-form-builder2.vercel.app
SUPABASE_URL=https://qbzrlhmfxfrthcayccwh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NzY0NTYsImV4cCI6MjA3NTE1MjQ1Nn0.t8dbQS8W04nTzcQGh7pkvEurp3058Ql7PEKd9aRRIT0
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU3NjQ1NiwiZXhwIjoyMDc1MTUyNDU2fQ.-2W5Q8IOpFBvTIPRJIWubO2tVfGMvnAbMu-0fQXhMYU
```

### **Step 3: Verify Service Configuration**

Make sure your Render service has these settings:

- **Build Command**: `cd Backend && npm install && npx prisma generate && npx prisma db push`
- **Start Command**: `cd Backend && npm start`
- **Environment**: `Node`
- **Plan**: `Free` (or your chosen plan)

### **Step 4: Redeploy**

1. **Click "Manual Deploy"** in your Render dashboard
2. **Or push a new commit** to trigger automatic deployment
3. **Check the logs** to see if environment variables are now loaded

## 🔍 **Debugging Output**

With the latest changes, your backend will now show:

```
🔍 Environment variables check:
DATABASE_URL: ✅ Present / ❌ Missing
DIRECT_URL: ✅ Present / ❌ Missing
JWT_SECRET: ✅ Present / ❌ Missing
OPENROUTER_API_KEY: ✅ Present / ❌ Missing
```

This will help you identify exactly which variables are missing.

## 🚨 **Common Issues & Solutions**

### **Issue 1: Variables Not Showing as Present**

**Solution**: Double-check the variable names in Render dashboard. They must match exactly (case-sensitive).

### **Issue 2: Variables Present but Prisma Still Fails**

**Solution**: Try regenerating Prisma client:
```bash
npx prisma generate
npx prisma db push
```

### **Issue 3: Service Keeps Restarting**

**Solution**: Check if all required variables are set and the database connection string is valid.

## 📋 **Complete Environment Variables List**

Here's the complete list of environment variables your backend needs:

| Variable | Value | Purpose |
|----------|-------|---------|
| `DATABASE_URL` | `postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` | Database connection (pooled) |
| `DIRECT_URL` | `postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:5432/postgres` | Database connection (direct) |
| `JWT_SECRET` | `your-super-secret-jwt-key-here` | JWT token signing |
| `OPENROUTER_API_KEY` | `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` | AI form generation |
| `PORT` | `10000` | Server port |
| `NODE_ENV` | `production` | Environment mode |
| `FRONTEND_URL` | `https://ai-form-builder2.vercel.app` | CORS origin |
| `SUPABASE_URL` | `https://qbzrlhmfxfrthcayccwh.supabase.co` | Supabase project URL |
| `SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase anonymous key |
| `SUPABASE_SERVICE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` | Supabase service key |

## 🎯 **Expected Result**

After fixing the environment variables, your backend should start successfully with:

```
🔍 Environment variables check:
DATABASE_URL: ✅ Present
DIRECT_URL: ✅ Present
JWT_SECRET: ✅ Present
OPENROUTER_API_KEY: ✅ Present
API Key being used: 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
🚀 Server is running on http://localhost:10000
✅ Database connected successfully
```

## 🚀 **Next Steps**

1. **Add all environment variables** to Render dashboard
2. **Redeploy your backend service**
3. **Check the logs** for successful startup
4. **Test your frontend** at https://ai-form-builder2.vercel.app

Your backend will then be fully functional and ready to serve your Vercel frontend! 🎉
