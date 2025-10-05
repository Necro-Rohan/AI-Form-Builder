#!/bin/bash

# AI Form Builder - Final Render Frontend Deployment Script
# This script prepares your frontend for Render deployment

echo "🚀 AI Form Builder - Final Render Frontend Deployment Preparation"
echo "================================================================"

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Checking project structure..."

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Error: frontend directory not found"
    exit 1
fi

echo "✅ Project structure looks good"

# Create final package.json for Render
echo "📦 Creating final package.json for Render deployment..."
cat > frontend/package.json << 'EOF'
{
  "name": "ai-form-builder-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "npx vite",
    "build": "npx vite build",
    "preview": "npx vite preview --port 10000 --host 0.0.0.0",
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
    "vite": "^4.1.0",
    "@vitejs/plugin-react": "^3.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10"
  }
}
EOF

# Create .npmrc for dependency resolution
echo "📄 Creating .npmrc for dependency resolution..."
cat > frontend/.npmrc << 'EOF'
legacy-peer-deps=true
EOF

# Create vite.config.js if it doesn't exist
if [ ! -f "frontend/vite.config.js" ]; then
    echo "📄 Creating vite.config.js..."
    cat > frontend/vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 10000,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
EOF
fi

# Create final render configuration
echo "📄 Creating final render configuration..."
cat > render-frontend-final.yaml << 'EOF'
services:
  - type: web
    name: ai-form-builder-frontend
    env: node
    plan: free
    buildCommand: npm install --legacy-peer-deps && npm run build
    startCommand: npm run preview --port 10000 --host 0.0.0.0
    envVars:
      - key: VITE_API_URL
        value: https://ai-form-builder-s4hj.onrender.com
      - key: VITE_NODE_ENV
        value: production
      - key: NODE_ENV
        value: production
EOF

echo "✅ Final deployment preparation complete!"
echo ""
echo "📋 Render Configuration Summary:"
echo ""
echo "🔧 Service Settings:"
echo "   Name: ai-form-builder-frontend"
echo "   Environment: Node"
echo "   Root Directory: frontend"
echo "   Plan: Free"
echo ""
echo "🔧 Build Command:"
echo "   npm install --legacy-peer-deps && npm run build"
echo ""
echo "🚀 Start Command:"
echo "   npm run preview --port 10000 --host 0.0.0.0"
echo ""
echo "📝 Environment Variables:"
echo "   VITE_API_URL=https://ai-form-builder-s4hj.onrender.com"
echo "   VITE_NODE_ENV=production"
echo "   NODE_ENV=production"
echo ""
echo "🔄 Next Steps:"
echo "1. Commit and push all changes to GitHub"
echo "2. Go to https://dashboard.render.com"
echo "3. Create new Web Service"
echo "4. Connect GitHub repository: https://github.com/Jadu07/AI-Form-Builder2"
echo "5. Use the configuration above"
echo "6. Deploy and test!"
echo ""
echo "📖 For detailed instructions, see RENDER_FRONTEND_DEPLOYMENT.md"
echo ""
echo "🎉 Your frontend is ready for Render deployment!"
