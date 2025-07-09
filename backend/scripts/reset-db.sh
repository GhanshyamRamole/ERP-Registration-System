#!/bin/bash

# Database Reset Script
# This script drops and recreates the database (USE WITH CAUTION!)

set -e

# Configuration
DB_NAME="erp_registration"
DB_USER="postgres"
DB_PASSWORD="password"
DB_HOST="localhost"
DB_PORT="5432"

echo "⚠️  WARNING: This will completely reset the database!"
echo "Database: $DB_NAME"
echo "Host: $DB_HOST:$DB_PORT"
echo ""

# Prompt for confirmation
read -p "Are you sure you want to continue? (type 'yes' to confirm): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo "❌ Operation cancelled"
    exit 1
fi

echo "🗑️  Dropping database '$DB_NAME'..."
PGPASSWORD=$DB_PASSWORD dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME --if-exists

echo "📊 Creating database '$DB_NAME'..."
PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME

echo "🔧 Running database initialization script..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$(dirname "$0")/init-db.sql"

echo "✅ Database reset completed successfully!"
echo ""
echo "🚀 You can now start your Go application with: go run main.go"