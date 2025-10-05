#!/bin/bash

# AI Form Builder - Final Render Configuration Fix
# This script ensures Render uses the correct start command

echo "🔧 AI Form Builder - Final Render Configuration Fix"
echo "=================================================="

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Ensuring package.json has correct start command..."

# Update package.json to ensure correct start command
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
    "start": "npx serve dist -p 10000 -s"
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
    "@vitejs/plugin-react": "^3.1.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "lucide-react": "^0.263.1",
    "@dnd-kit/core": "^6.0.8",
    "@dnd-kit/sortable": "^7.0.2",
    "@dnd-kit/utilities": "^3.2.1",
    "serve": "^14.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10"
  }
}
EOF

echo "📄 Creating Render configuration file..."

# Create render.yaml with correct configuration
cat > render.yaml << 'EOF'
services:
  - type: web
    name: ai-form-builder-frontend
    env: node
    plan: free
    buildCommand: cd frontend && npm install --legacy-peer-deps && npm run build
    startCommand: cd frontend && npm start
    envVars:
      - key: VITE_API_URL
        value: https://ai-form-builder-s4hj.onrender.com
      - key: VITE_NODE_ENV
        value: production
      - key: NODE_ENV
        value: production
EOF

echo "📄 Creating alternative start script..."

# Create a start script that ensures serve is used
cat > frontend/start.js << 'EOF'
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting AI Form Builder Frontend...');
console.log('📁 Serving from:', path.join(__dirname, 'dist'));

const serve = spawn('npx', ['serve', 'dist', '-p', '10000', '-s'], {
  cwd: __dirname,
  stdio: 'inherit'
});

serve.on('error', (err) => {
  console.error('❌ Error starting serve:', err);
  process.exit(1);
});

serve.on('exit', (code) => {
  console.log(`📊 Serve exited with code ${code}`);
  process.exit(code);
});
EOF

echo "📄 Updating package.json to use start.js..."

# Update package.json to use the start script
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
    "start": "node start.js"
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
    "@vitejs/plugin-react": "^3.1.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "lucide-react": "^0.263.1",
    "@dnd-kit/core": "^6.0.8",
    "@dnd-kit/sortable": "^7.0.2",
    "@dnd-kit/utilities": "^3.2.1",
    "serve": "^14.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10"
  }
}
EOF

echo "✅ Final configuration complete!"
echo ""
echo "🔧 Render Configuration:"
echo "   Build Command: cd frontend && npm install --legacy-peer-deps && npm run build"
echo "   Start Command: cd frontend && npm start"
echo ""
echo "🚀 Start Script:"
echo "   Uses node start.js which runs: npx serve dist -p 10000 -s"
echo ""
echo "📝 Environment Variables:"
echo "   VITE_API_URL=https://ai-form-builder-s4hj.onrender.com"
echo "   VITE_NODE_ENV=production"
echo "   NODE_ENV=production"
echo ""
echo "🎉 This should completely bypass Vite's host checking!"
echo "   The start.js script ensures serve is used instead of vite preview"
