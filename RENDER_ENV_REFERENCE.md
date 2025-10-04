# AI Form Builder - Render Environment Variables Quick Reference

## 🔧 Backend Environment Variables

Copy these to your Render backend service:

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

## 🌐 Frontend Environment Variables

Copy these to your Render frontend service:

```env
VITE_API_URL=https://your-backend-app.onrender.com
VITE_NODE_ENV=production
NODE_ENV=production
```

## 📋 Render Service Configuration

### Backend Service
- **Name**: `ai-form-builder-backend`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `Backend`
- **Plan**: `Free` (or `Starter` for better performance)

### Frontend Service
- **Name**: `ai-form-builder-frontend`
- **Environment**: `Node`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Start Command**: `cd frontend && npm run preview`
- **Root Directory**: `frontend`
- **Plan**: `Free` (or `Starter` for better performance)

## 🔄 URL Updates After Deployment

1. **Backend deployed**: Get URL (e.g., `https://ai-form-builder-backend.onrender.com`)
2. **Update Frontend**: Set `VITE_API_URL` to backend URL
3. **Frontend deployed**: Get URL (e.g., `https://ai-form-builder-frontend.onrender.com`)
4. **Update Backend**: Set `FRONTEND_URL` to frontend URL

## 🧪 Testing URLs

After deployment, test these endpoints:

- **Backend Health**: `https://your-backend.onrender.com/api/auth/register`
- **Frontend**: `https://your-frontend.onrender.com`
- **Public Form**: `https://your-frontend.onrender.com/f/form-id`

## 🚨 Important Notes

1. **Free Plan Limitations**: 
   - Services sleep after 15 minutes of inactivity
   - Cold start takes ~30 seconds
   - Consider upgrading for production use

2. **Environment Variables**:
   - Never commit `.env` files to Git
   - Use Render dashboard to set environment variables
   - Restart services after changing environment variables

3. **Database**:
   - Supabase free tier has limitations
   - Monitor usage in Supabase dashboard
   - Consider upgrading for production

4. **Security**:
   - Change `JWT_SECRET` to a strong, unique value
   - Use HTTPS only
   - Implement rate limiting for production

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Service Logs**: Check Render dashboard
- **Community**: Render Discord/Forums
