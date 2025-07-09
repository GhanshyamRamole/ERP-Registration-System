#!/bin/bash

# Development Database Setup Script
# This script sets up a PostgreSQL database for development

set -e

# Configuration
DB_NAME="erp_registration"
DB_USER="postgres"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_PORT="5432"

echo "🚀 Setting up PostgreSQL database for ERP Registration System..."

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; then
    echo "❌ PostgreSQL is not running or not accessible"
    echo "Please start PostgreSQL service or run: docker-compose up -d postgres"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Create database if it doesn't exist
echo "📊 Creating database '$DB_NAME' if it doesn't exist..."
PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "Database '$DB_NAME' already exists"

# Run initialization script
echo "🔧 Running database initialization script..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/init-db.sql"

echo "✅ Database setup completed successfully!"
echo ""
echo "📋 Database Information:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""
echo "🔗 Connection URL: postgres://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=disable"
echo ""
echo "🚀 You can now start your Go application with: go run main.go"