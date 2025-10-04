#!/bin/bash

# AI Form Builder - Render Frontend Dependency Fix
# This script fixes the React dependency conflicts for Render deployment

echo "🔧 Fixing React dependency conflicts for Render deployment..."

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Updating frontend package.json with compatible dependencies..."

# Create a clean package.json without conflicting dependencies
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
    "@rjsf/validator-ajv8": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10",
    "@vitejs/plugin-react": "^3.1.0",
    "vite": "^4.1.0"
  }
}
EOF

echo "📄 Creating .npmrc for dependency resolution..."
cat > frontend/.npmrc << 'EOF'
legacy-peer-deps=true
EOF

echo "📄 Creating updated render configuration..."
cat > render-frontend-fixed.yaml << 'EOF'
services:
  - type: web
    name: ai-form-builder-frontend
    env: node
    plan: free
    buildCommand: cd frontend && npm install --legacy-peer-deps && npm run build
    startCommand: cd frontend && npm run preview --port 10000 --host 0.0.0.0
    envVars:
      - key: VITE_API_URL
        value: https://ai-form-builder-s4hj.onrender.com
      - key: VITE_NODE_ENV
        value: production
      - key: NODE_ENV
        value: production
EOF

echo "✅ Dependency fixes applied!"
echo ""
echo "📋 Updated Render Configuration:"
echo ""
echo "🔧 Build Command:"
echo "   cd frontend && npm install --legacy-peer-deps && npm run build"
echo ""
echo "🚀 Start Command:"
echo "   cd frontend && npm run preview --port 10000 --host 0.0.0.0"
echo ""
echo "📝 Environment Variables:"
echo "   VITE_API_URL=https://ai-form-builder-s4hj.onrender.com"
echo "   VITE_NODE_ENV=production"
echo "   NODE_ENV=production"
echo ""
echo "🔄 Next Steps:"
echo "1. Commit and push these changes to GitHub"
echo "2. Update your Render service with the new build command"
echo "3. Redeploy your frontend service"
echo ""
echo "⚠️  The --legacy-peer-deps flag will resolve the React version conflicts"
