# Spring Security Full-Stack Application

Full-stack authentication application demonstrating Spring Security with JWT and OAuth2 integration. Built with Angular frontend and Spring Boot backend.

## Architecture

- **Frontend**: Angular 21 with Angular Material UI
- **Backend**: Spring Boot 4 with Spring Security
- **Database**: PostgreSQL 16 with Flyway migrations
- **Authentication**: JWT tokens + OAuth2 (Google)

## Prerequisites

- Node.js 18+ and npm
- Java 21
- Docker and Docker Compose
- Google Cloud Console account (for OAuth2)

## Quick Start

### Backend Setup

**Step 1: Start Database**

Navigate to backend directory and start PostgreSQL:

```bash
cd spring-security-implementation
docker-compose up -d
```

This creates a PostgreSQL container with:
- Database: spring_security_db
- Username: postgres
- Password: password
- Port: 5432

**Step 2: Configure Environment**

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```
YOUR_GOOGLE_CLIENT_ID=your_google_client_id_here
YOUR_GOOGLE_CLIENT_SECRET=your_google_client_secret_here
YOUR_JWT_SECRET_KEY=your_jwt_secret_key_at_least_32_characters_long
YOUR_DB=spring_security_db
```

To get Google OAuth2 credentials:
1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth2 credentials (Web application)
5. Add authorized redirect URI: `http://localhost:8080/login/oauth2/code/google`
6. Copy Client ID and Client Secret

**Step 3: Start Backend**

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The backend will start on http://localhost:8080

### Frontend Setup

**Step 1: Install Dependencies**

Navigate to frontend directory and install packages:

```bash
cd frontend
npm install
```

**Step 2: Start Development Server**

```bash
npm start
```

The frontend will start on http://localhost:4200

## Default Test Accounts

| Username | Email | Password | Role |
|----------|-------|----------|------|
| admin | admin@example.com | password123 | ADMIN |
| user1 | user1@example.com | password123 | USER |
| user2 | user2@example.com | password123 | USER |

## Project Structure

```
spring-security/
├── frontend/                     # Angular Frontend
│   ├── src/app/
│   │   ├── components/          # Login, Register, Dashboard, OAuth2 Callback
│   │   ├── guards/              # Auth and No-Auth route guards
│   │   ├── interceptors/        # JWT HTTP interceptor
│   │   ├── services/            # Authentication service
│   │   └── models/              # TypeScript interfaces
│   ├── proxy.conf.json          # API proxy configuration
│   └── angular.json             # Angular CLI configuration
│
└── spring-security-implementation/  # Spring Boot Backend
    ├── src/main/java/
    │   └── com/andaruhp/springsec/
    │       ├── config/          # Security, CORS, Password encoder configs
    │       ├── controller/      # Auth, OAuth2, Test controllers
    │       ├── dto/             # Request/Response objects
    │       ├── entity/          # User entity
    │       ├── repository/      # User repository
    │       ├── service/         # User service
    │       └── security/        # JWT, OAuth2, User details
    ├── src/main/resources/
    │   ├── application.yml      # Spring Boot configuration
    │   └── db/migration/        # Flyway migrations
    ├── docker-compose.yml       # PostgreSQL container
    └── .env                     # Environment variables
```

## API Endpoints

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Authenticate with username/password, returns JWT |
| `/api/auth/register` | POST | Register new user account |
| `/oauth2/authorization/google` | GET | Initiate Google OAuth2 login |

### Protected Endpoints (requires JWT in Authorization header)

| Endpoint | Method | Access |
|----------|--------|--------|
| `/api/protected/**` | GET | Any authenticated user |
| `/api/admin/**` | GET | ADMIN role only |

## Development Configuration

### Backend Configuration (application.yml)

Key configurations:

```yaml
# Database
spring.datasource.url: jdbc:postgresql://localhost:5432/spring_security_db
spring.datasource.username: postgres
spring.datasource.password: password

# JWT
jwt.secret: ${YOUR_JWT_SECRET_KEY}
jwt.expiration: 3600000  # 1 hour in milliseconds

# OAuth2
spring.security.oauth2.client.registration.google.client-id: ${YOUR_GOOGLE_CLIENT_ID}
spring.security.oauth2.client.registration.google.client-secret: ${YOUR_GOOGLE_CLIENT_SECRET}
spring.security.oauth2.client.registration.google.redirect-uri: http://localhost:8080/login/oauth2/code/google
```

### Frontend Configuration

API calls are proxied to backend via `proxy.conf.json`:

```json
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false
  }
}
```

## Stopping the Application

**Stop Frontend:**
Press Ctrl+C in the terminal running `npm start`

**Stop Backend:**
Press Ctrl+C in the terminal running `./mvnw spring-boot:run`

**Stop Database:**

```bash
cd spring-security-implementation
docker-compose down
```

To remove the database volume (deletes all data):

```bash
docker-compose down -v
```

## Troubleshooting

**Port already in use:**
- Backend uses port 8080
- Frontend uses port 4200
- PostgreSQL uses port 5432

**Database connection failed:**
Ensure Docker is running and PostgreSQL container is started:

```bash
docker ps  # Check if postgres container is running
docker-compose up -d  # Start if not running
```

**OAuth2 login fails:**
- Verify Google credentials in `.env`
- Ensure redirect URI in Google Cloud Console matches: `http://localhost:8080/login/oauth2/code/google`
- Check that `YOUR_JWT_SECRET_KEY` is at least 32 characters

**Frontend cannot connect to backend:**
Verify proxy configuration in `frontend/proxy.conf.json` matches backend URL.

## Features

- JWT-based authentication with access tokens
- OAuth2 login with Google
- Role-based access control (USER, ADMIN)
- Password encryption with BCrypt
- Automatic token attachment via HTTP interceptor
- Protected routes with Angular guards
- Material Design UI components
- Database migrations with Flyway

## Technology Stack

**Frontend:**
- Angular 21
- TypeScript 5.9
- Angular Material
- RxJS
- Vitest (testing)

**Backend:**
- Spring Boot 4
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- JWT (jjwt)
- Lombok

**Infrastructure:**
- Docker Compose
- Maven Wrapper

## Security Notes

- JWT secret key should be at least 32 characters and kept secure
- OAuth2 credentials should never be committed to version control
- Passwords are hashed with BCrypt before storage
- Tokens expire after 1 hour
- CORS is configured to allow frontend communication
- Database migrations run automatically on startup

---

Made by Kimi K2.5
