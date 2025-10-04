#!/bin/bash

echo "🚀 Setting up PostgreSQL for AI Form Builder..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install postgresql
        else
            echo "❌ Homebrew not found. Please install PostgreSQL manually from https://postgresql.org"
            exit 1
        fi
    else
        echo "❌ Please install PostgreSQL manually for your operating system"
        exit 1
    fi
fi

# Start PostgreSQL service
echo "🔄 Starting PostgreSQL service..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    brew services start postgresql
fi

# Wait a moment for service to start
sleep 3

# Create database
echo "🗄️ Creating database 'form_builder'..."
createdb form_builder 2>/dev/null || echo "Database 'form_builder' already exists or creation failed"

# Run Prisma migrations
echo "🔄 Running database migrations..."
cd Backend
npx prisma db push

echo "✅ Setup complete! You can now start the backend server."
echo "Run: cd Backend && npm start"
