#!/bin/bash

# Script to switch between development and production environments

if [ "$1" = "dev" ] || [ "$1" = "development" ]; then
    echo "🔄 Switching to development environment (local backend)..."
    cp .env.development .env
    echo "✅ Now using: http://localhost:3001"
    echo "📝 Make sure your local backend is running!"
elif [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    echo "🔄 Switching to production environment (deployed backend)..."
    cp .env.production .env
    echo "✅ Now using: https://ai-form-builder-s4hj.onrender.com"
else
    echo "Usage: ./switch-env.sh [dev|prod]"
    echo ""
    echo "Examples:"
    echo "  ./switch-env.sh dev     # Use local backend"
    echo "  ./switch-env.sh prod    # Use production backend"
    echo ""
    echo "Current environment:"
    if grep -q "localhost:3001" .env; then
        echo "  🔧 Development (local backend)"
    else
        echo "  🌐 Production (deployed backend)"
    fi
fi
