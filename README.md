# REST API Express

REST API for managing recipes built with Node.js, Express and MongoDB. This project demonstrates modern backend development practices including authentication, Docker and API documentation.

## Features
- **JWT Authentication & Authorization** - Secure user management with token-based auth
- **Security** - SSL/TLS, Helmet, rate limiting, CORS protection
- **Data Validation & Sanitization** - Input validation
- **Interactive API Documentation** - Auto-generated Swagger UI
- **Clean Architecture** - Controllers, models, routes, middleware separation
- **MongoDB with Mongoose ODM** - Schema-based data modeling
- **Full Docker Support** - Complete containerization (API + MongoDB)
- **Structured Logging & Request Tracing** - Debugging and monitoring ready

## Quick Start

### Prerequisites

- Node.js (v18+) and npm
- MongoDB (optional, if missing falls back to in-memory database)
- Docker Desktop (optional)

### 1. Clone & Install
```bash
# Clone repository
git clone https://github.com/mfigueirido/RestServiceExpress.git
cd RestServiceExpress

# Configure your environment variables
cp .env.example .env

# Install dependencies
npm install
```

### 2. Run the API
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 3. Run with Docker
```bash
# Start both the API and MongoDB with one command
docker-compose up
```

The API will be available at https://localhost:3000 by default.

> It will fallback to `http` if no certificates are found matching the paths specified in the `.env` file.
You can generate an PFX certificate in Windows by using the `./scripts/generate-local-pfx.ps1` PowerShell script.

> You can also change the port in your `.env` file.

## API Documentation

Swagger documentation is automatically available when the server runs.

Swagger UI: http://localhost:3000/api-docs

## Endpoints
| Method      | Endpoint                           | Description           | Auth required|
|-------------|------------------------------------|-----------------------|--------------|
| POST        | /api/auth/register                 | Register a new user   | No           |
| POST        | /api/auth/login                    | Login                 | No           |
| GET         | /api/recipes                       | Get all recipes       | Yes          |
| GET         | /api/recipes/:id                   | Get a specific recipe | Yes          |
| POST        | /api/recipes                       | Create a recipe       | Yes          |
| PUT         | /api/recipes/:id                   | Update a recipe       | Yes          |
| DELETE      | /api/recipes/:id                   | Delete a recipe       | Yes          |
| POST        | /api/recipes/:id/ratings           | Add a rating          | Yes          |
| DELETE      | /api/recipes/:id/ratings/:ratingId | Delete your rating    | Yes          |

## Project Structure
```text
src/
├── models/          # Mongoose schemas (Recipe, User)
├── middleware/      # Custom middleware (auth, errorHandler, etc.)
├── controllers/     # Route controllers
├── routes/          # Express route definitions
├── app.js           # Main Express application setup
└── index.js         # Entry point
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Miguel Anxo Figueirido Prado

GitHub: [@mfigueirido](https://github.com/mfigueirido)
