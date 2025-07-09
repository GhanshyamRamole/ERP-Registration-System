# ERP Registration Backend

A Go backend API for the ERP registration system built with Gin framework, GORM, and PostgreSQL.

## Features

- Company registration with file uploads
- User authentication with JWT
- PostgreSQL database with GORM
- RESTful API endpoints
- CORS support for frontend integration
- File upload handling
- Input validation and error handling
- Database migrations and seeding
- Docker support with PostgreSQL
- Development tools and scripts

## Prerequisites

- Go 1.21 or higher
- PostgreSQL database
- Git
- Docker (optional, for containerized setup)

## Installation

### Option 1: Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Start PostgreSQL with Docker:
```bash
docker-compose up -d postgres
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env if needed (default values should work)
```

4. Run the application:
```bash
go run main.go
```

### Option 2: Manual PostgreSQL Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
go mod download
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials if different from defaults
```

4. Set up PostgreSQL database manually:
```sql
CREATE DATABASE erp_registration;
```

5. Initialize the database:
```bash
chmod +x scripts/setup-dev-db.sh
./scripts/setup-dev-db.sh
```

6. Run the application:
```bash
go run main.go
```

## Database Management

### Available Scripts

- **Setup Development Database**: `./scripts/setup-dev-db.sh`
- **Reset Database** (⚠️ Destructive): `./scripts/reset-db.sh`
- **Initialize Database**: `psql -f scripts/init-db.sql`

### Using pgAdmin (Optional)

Start pgAdmin with Docker:
```bash
docker-compose --profile tools up -d pgadmin
```

Access pgAdmin at `http://localhost:5050`:
- Email: `admin@example.com`
- Password: `admin`

Add server connection:
- Host: `postgres` (or `localhost` if running locally)
- Port: `5432`
- Database: `erp_registration`
- Username: `postgres`
- Password: `password`

The server will start on `http://localhost:8080`

## API Endpoints

### Public Endpoints

- `GET /health` - Health check
- `POST /api/register` - Register new company and admin user
- `POST /api/login` - User login

### Protected Endpoints (require JWT token)

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile
- `GET /api/companies` - Get companies list (with pagination and search)

## Database Schema

The application uses PostgreSQL with the following main tables:

### Companies Table
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    company_size VARCHAR(50) NOT NULL,
    website VARCHAR(255),
    tax_id VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'employee',
    department VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

### Documents Table
```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    company_id INTEGER NOT NULL REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);
```

## Database Schema

### Companies Table
- id (Primary Key)
- company_name
- industry
- company_size
- website
- tax_id (Unique)
- phone
- address (embedded: street, city, state, zip_code, country)
- created_at, updated_at, deleted_at

### Users Table
- id (Primary Key)
- first_name, last_name
- email (Unique)
- password_hash
- role, department, job_title
- phone
- company_id (Foreign Key)
- is_active
- created_at, updated_at, deleted_at

### Documents Table
- id (Primary Key)
- file_name, file_path
- file_size, mime_type
- company_id (Foreign Key)
- created_at, updated_at, deleted_at

## Environment Variables

### Required Variables
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 8080)

### Optional Variables
- `GIN_MODE` - Gin mode (debug/release, default: debug)
- `APP_ENV` - Application environment (development/production)
- `LOG_LEVEL` - Log level (debug/info/warn/error)
- `UPLOAD_DIR` - Upload directory (default: uploads)
- `MAX_FILE_SIZE` - Maximum file size in bytes (default: 10MB)

### Database Configuration (Alternative to DATABASE_URL)
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_SSLMODE` - SSL mode (disable/require)

## File Uploads

Uploaded files are stored in the `uploads/` directory with the naming convention: `{company_id}_{original_filename}`

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `https://teal-begonia-693134.netlify.app` (Deployed frontend)

## Development

To run in development mode:
```bash
go run main.go
```

To build for production:
```bash
go build -o erp-backend main.go
./erp-backend
```

## Deployment

### Using Docker

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Or build and run individual services:
```bash
# Start PostgreSQL
docker-compose up -d postgres

# Build and run backend
docker-compose up --build backend
```

3. Access the services:
   - Backend API: `http://localhost:8080`
   - PostgreSQL: `localhost:5432`
   - pgAdmin (optional): `http://localhost:5050`

### Using Railway/Heroku

1. Set environment variables in your platform
2. Deploy directly from Git repository
3. The app will automatically detect the Go buildpack

## Testing

### API Testing
Test the health endpoint:
```bash
curl http://localhost:8080/health
```

### Database Testing
Connect to the database:
```bash
psql -h localhost -p 5432 -U postgres -d erp_registration
```

### Unit Tests
Run tests:
```bash
go test ./...
```

## Security Considerations

- ✅ Change `JWT_SECRET` in production
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Add input sanitization
- ✅ Use environment variables for sensitive data
- ✅ Implement proper logging and monitoring
- ✅ Use prepared statements (GORM handles this)
- ✅ Validate all user inputs
- ✅ Implement CORS properly

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps postgres
   
   # Check logs
   docker-compose logs postgres
   ```

2. **Port Already in Use**
   ```bash
   # Find process using port 8080
   lsof -i :8080
   
   # Kill the process
   kill -9 <PID>
   ```

3. **Migration Errors**
   ```bash
   # Reset database
   ./scripts/reset-db.sh
   ```

4. **File Upload Issues**
   ```bash
   # Check uploads directory permissions
   ls -la uploads/
   
   # Fix permissions if needed
   chmod 755 uploads/
   ```

### Logs

View application logs:
```bash
# Docker logs
docker-compose logs -f backend

# Local development
go run main.go
```