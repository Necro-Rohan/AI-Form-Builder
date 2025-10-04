#!/bin/bash

# AI Form Builder - Render Build Fix Script
# This script fixes the TailwindCSS and PostCSS build issues

echo "🔧 AI Form Builder - Render Build Fix"
echo "====================================="

# Check if we're in the right directory
if [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Fixing package.json dependencies..."

# Create the corrected package.json
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
    "postcss": "^8.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.27",
    "@types/react-dom": "^18.0.10"
  }
}
EOF

echo "📄 Ensuring .npmrc exists..."
cat > frontend/.npmrc << 'EOF'
legacy-peer-deps=true
EOF

echo "📄 Ensuring vite.config.js exists..."
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

echo "📄 Ensuring postcss.config.js exists..."
cat > frontend/postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
EOF

echo "📄 Ensuring tailwind.config.js exists..."
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

echo "📄 Ensuring index.css exists..."
mkdir -p frontend/src
cat > frontend/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

echo "✅ Build fix complete!"
echo ""
echo "🔧 Updated Configuration:"
echo "   ✅ Added tailwindcss to dependencies"
echo "   ✅ Added autoprefixer to dependencies"
echo "   ✅ Added postcss to dependencies"
echo "   ✅ Ensured all config files exist"
echo "   ✅ Set legacy-peer-deps=true"
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
echo "🎉 Your frontend should now build successfully on Render!"
