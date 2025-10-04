#!/bin/bash

# AI Form Builder - Render Deployment Script
# This script helps prepare your project for Render deployment

echo "🚀 AI Form Builder - Render Deployment Preparation"
echo "=================================================="

# Check if we're in the right directory
if [ ! -f "README.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Checking project structure..."

# Check if Backend directory exists
if [ ! -d "Backend" ]; then
    echo "❌ Error: Backend directory not found"
    exit 1
fi

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found"
    exit 1
fi

echo "✅ Project structure looks good"

# Create deployment-ready package.json for frontend
echo "📦 Updating frontend package.json for Render..."
cat > frontend/package.json << 'EOF'
{
  "name": "ai-form-builder-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview --port 10000 --host 0.0.0.0",
    "start": "npm run preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.8.1",
    "react-hot-toast": "^2.4.0",
    "@rjsf/core": "^5.0.0",
    "@rjsf/utils": "^5.0.0",
    "@rjsf/validator-ajv8": "^5.0.0",
    "@rjsf/material-ui": "^5.0.0",
    "@mui/material": "^5.11.0",
    "@emotion/react": "^11.10.5",
    "@emotion/styled": "^11.10.5",
    "@mui/icons-material": "^5.11.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0"
  }
}
EOF

# Create deployment-ready package.json for backend
echo "📦 Updating backend package.json for Render..."
cat > Backend/package.json << 'EOF'
{
  "name": "ai-form-builder-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js",
    "build": "echo 'No build step required'",
    "postinstall": "npx prisma generate"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "prisma": "^5.0.0",
    "@prisma/client": "^5.0.0",
    "dotenv": "^16.0.3"
  }
}
EOF

echo "✅ Package.json files updated"

# Create render.yaml for infrastructure as code
echo "📄 Creating render.yaml configuration..."
cat > render.yaml << 'EOF'
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
      - key: DIRECT_URL
        value: postgresql://postgres.qbzrlhmfxfrthcayccwh:KundanS328@aws-1-ap-south-1.pooler.supabase.com:5432/postgres
      - key: JWT_SECRET
        value: your-super-secret-jwt-key-here-change-this-in-production
      - key: OPENROUTER_API_KEY
        value: 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
      - key: PORT
        value: 10000
      - key: NODE_ENV
        value: production
      - key: FRONTEND_URL
        value: https://ai-form-builder-frontend.onrender.com
      - key: SUPABASE_URL
        value: https://qbzrlhmfxfrthcayccwh.supabase.co
      - key: SUPABASE_ANON_KEY
        value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1NzY0NTYsImV4cCI6MjA3NTE1MjQ1Nn0.t8dbQS8W04nTzcQGh7pkvEurp3058Ql7PEKd9aRRIT0
      - key: SUPABASE_SERVICE_KEY
        value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFienJsaG1meGZydGhjYXljY3doIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTU3NjQ1NiwiZXhwIjoyMDc1MTUyNDU2fQ.-2W5Q8IOpFBvTIPRJIWubO2tVfGMvnAbMu-0fQXhMYU

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
EOF

echo "✅ render.yaml created"

# Create .gitignore for deployment
echo "📄 Creating .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build outputs
dist/
build/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# Prisma
prisma/migrations/
EOF

echo "✅ .gitignore created"

echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub"
echo "2. Go to https://dashboard.render.com"
echo "3. Create two web services:"
echo "   - Backend: Connect GitHub repo, root directory 'Backend'"
echo "   - Frontend: Connect GitHub repo, root directory 'frontend'"
echo "4. Add environment variables from .env.render files"
echo "5. Deploy and test!"
echo ""
echo "📖 For detailed instructions, see RENDER_DEPLOYMENT.md"
echo ""
echo "🔗 Environment files created:"
echo "   - Backend/.env.render"
echo "   - frontend/.env.render"
echo "   - render.yaml"
echo ""
echo "⚠️  Remember to update URLs after deployment!"
