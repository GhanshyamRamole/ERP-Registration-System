# ERP Registration Backend

A Go backend API for the ERP registration system built with Gin framework and PostgreSQL.

## Features

- Company registration with file uploads
- User authentication with JWT
- PostgreSQL database with GORM
- RESTful API endpoints
- CORS support for frontend integration
- File upload handling
- Input validation and error handling

## Prerequisites

- Go 1.21 or higher
- PostgreSQL database
- Git

## Installation

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
# Edit .env with your database credentials
```

4. Set up PostgreSQL database:
```sql
CREATE DATABASE erp_registration;
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE erp_registration TO your_user;
```

5. Run the application:
```bash
go run main.go
```

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

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 8080)
- `GIN_MODE` - Gin mode (debug/release)

## File Uploads

Uploaded files are stored in the `uploads/` directory with the naming convention: `{company_id}_{original_filename}`

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
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

1. Create a Dockerfile:
```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o main main.go

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
COPY --from=builder /app/.env .
CMD ["./main"]
```

2. Build and run:
```bash
docker build -t erp-backend .
docker run -p 8080:8080 erp-backend
```

### Using Railway/Heroku

1. Set environment variables in your platform
2. Deploy directly from Git repository
3. The app will automatically detect the Go buildpack

## Testing

Run tests:
```bash
go test ./...
```

## Security Considerations

- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting
- Add input sanitization
- Use environment variables for sensitive data
- Implement proper logging and monitoring