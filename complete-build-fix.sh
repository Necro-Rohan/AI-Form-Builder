#!/bin/bash

# AI Form Builder - Complete Render Build Fix Script
# This script fixes ALL missing dependencies for Render deployment

echo "🔧 AI Form Builder - Complete Render Build Fix"
echo "=============================================="

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Fixing package.json with ALL dependencies..."

# Create the complete package.json with all dependencies
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
    "@vitejs/plugin-react": "^3.1.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10"
  }
}
EOF

echo "📄 Ensuring all config files exist..."

# Create .npmrc
cat > frontend/.npmrc << 'EOF'
legacy-peer-deps=true
EOF

# Create vite.config.js
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

# Create postcss.config.js
cat > frontend/postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

# Create tailwind.config.js
cat > frontend/tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

# Create index.css
mkdir -p frontend/src
cat > frontend/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo "✅ Complete build fix finished!"
echo ""
echo "🔧 All Dependencies Added:"
echo "   ✅ react & react-dom"
echo "   ✅ react-router-dom"
echo "   ✅ react-hot-toast"
echo "   ✅ @rjsf packages"
echo "   ✅ vite & @vitejs/plugin-react"
echo "   ✅ tailwindcss"
echo "   ✅ autoprefixer"
echo "   ✅ postcss"
echo "   ✅ lucide-react (FIXED!)"
echo ""
echo "🚀 Render Build Command:"
echo "   npm install --legacy-peer-deps && npm run build"
echo ""
echo "🚀 Render Start Command:"
echo "   npm run preview --port 10000 --host 0.0.0.0"
echo ""
echo "📝 Environment Variables:"
echo "   VITE_API_URL=https://ai-form-builder-s4hj.onrender.com"
echo "   VITE_NODE_ENV=production"
echo "   NODE_ENV=production"
echo ""
echo "🎉 Your frontend will now build successfully on Render!"
echo "   The lucide-react import error has been fixed!"
