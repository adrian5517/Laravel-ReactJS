# Laravel + ReactJS User Management System

A full-stack application built with Laravel 12 (latest) and React 17 for managing users with role-based functionality.

## Features

- **Backend (Laravel 12)**
  - RESTful API for user management
  - User model with multiple roles support
  - Data validation (email uniqueness, required fields)
  - Database migrations and seeders
  - CORS support for frontend integration
  - PSR and SOLID principles implementation

- **Frontend (React 17 + TypeScript)**
  - Responsive user interface with Tailwind CSS
  - User creation form with validation
  - Role selection (Author, Editor, Subscriber, Administrator)
  - Users list grouped by roles
  - Axios for API consumption
  - Functional components with React Hooks

## Requirements

- PHP >= 8.2
- Composer
- Node.js >= 16
- npm or yarn

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd laravel-react-app
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node.js Dependencies

```bash
npm install
```

### 4. Environment Setup

Copy the environment file:
```bash
cp .env.example .env
```

Generate application key:
```bash
php artisan key:generate
```

### 5. Database Configuration

The application is configured to use SQLite by default. The `.env` file should contain:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

Create the database file:
```bash
touch database/database.sqlite
```

For Windows PowerShell:
```powershell
New-Item -ItemType File -Path "database/database.sqlite" -Force
```

### 6. Run Database Migrations and Seeders

```bash
php artisan migrate:fresh --seed
```

This will create the database tables and seed the roles:
- Author
- Editor
- Subscriber
- Administrator

## Development

### Start the Laravel Development Server

```bash
php artisan serve
```

The Laravel API will be available at `http://localhost:8000`

### Start the Frontend Development Server

In a new terminal:
```bash
npm run dev
```

The Vite development server will handle hot module replacement.

### Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## API Endpoints

### Users
- `GET /api/v1/users` - Get all users grouped by roles
- `POST /api/v1/users` - Create a new user
- `GET /api/v1/users/{id}` - Get a specific user
- `PUT /api/v1/users/{id}` - Update a user
- `DELETE /api/v1/users/{id}` - Delete a user

### Roles
- `GET /api/v1/roles` - Get all available roles

## API Request Examples

### Create a User

```bash
curl -X POST http://localhost:8000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "roles": [1, 2]
  }'
```

### Get Users by Roles

```bash
curl -X GET http://localhost:8000/api/v1/users \
  -H "Accept: application/json"
```

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
