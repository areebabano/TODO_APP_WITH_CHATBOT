# Phase II Full-Stack Smart Personal Chief of Staff Todo Web Application

This project transforms the existing console-based todo application into a modern, multi-user web application with persistent storage, authentication, and RESTful API while preserving all Phase I functionality and architectural principles.

## Features

### Phase I (Console Application)
- Create, list, update, and delete tasks
- Mark tasks as complete or incomplete
- Rich formatted table output with color-coded status
- Clean layered architecture (models, storage, services, CLI)

### Phase II (Web Application)
- Multi-user support with secure authentication
- JWT-based authentication and authorization
- Responsive web interface with accessibility compliance
- RESTful API with proper error handling
- Data isolation between users
- Task management (CRUD operations)

## Requirements

- Node.js 18+
- Python 3.11+
- UV package manager
- PostgreSQL (or Neon Serverless)

## Installation

### 1. Install UV (if not already installed)

**Windows (PowerShell):**
```powershell
irm https://astral.sh/uv/install.ps1 | iex
```

**macOS/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 2. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd Todo_App

# Sync dependencies
uv sync
```

## Architecture

The application follows a service-oriented architecture with clear separation between frontend and backend:

```
Frontend (Next.js) ↔ API (FastAPI) ↔ Database (Neon PostgreSQL)
         ↓                  ↓
   Better Auth       JWT Verification
   (Authentication)   (Authorization)
```

## Setup Instructions

### Phase II - Full-Stack Web Application

1. Install frontend dependencies:
   ```bash
   cd apps/frontend
   npm install
   ```
2. Install backend dependencies:
   ```bash
   cd apps/backend
   pip install -r requirements.txt
   ```
3. Set up environment variables in `.env` file
4. Run database migrations:
   ```bash
   cd db/migrations
   alembic upgrade head
   ```
5. Start the backend:
   ```bash
   cd apps/backend
   uvicorn main:app --reload
   ```
6. Start the frontend:
   ```bash
   cd apps/frontend
   npm run dev
   ```

### Phase I - Console Application

The original CLI functionality remains fully operational alongside the new web interface:

```bash
# Add a task with just a title
uv run chief add "Buy groceries"

# Add a task with a description
uv run chief add "Write report" -d "Quarterly sales report for Q4"

# List tasks
uv run chief list

# Complete a task
uv run chief complete <task-id>

# Mark task as incomplete
uv run chief incomplete <task-id>

# Update a task
uv run chief update <task-id> -t "New title" -d "New description"

# Delete a task
uv run chief delete <task-id>
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Current user info

### Task Management
- `GET /api/tasks` - List user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PATCH /api/tasks/{id}/complete` - Mark complete
- `PATCH /api/tasks/{id}/incomplete` - Mark incomplete

## Security

- JWT tokens with HTTP-only, Secure, SameSite=Lax cookies
- User ownership enforced via `owner_user_id` filtering
- Input validation with Pydantic models
- Rate limiting on API endpoints
- CORS configured with explicit allowed origins

## Data Isolation

All database queries include `WHERE owner_user_id = :current_user_id` to ensure users can only access their own data.

## Tech Stack

### Frontend
- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Better Auth client

### Backend
- FastAPI
- Python 3.11+
- SQLModel ORM
- Pydantic validation
- JWT authentication

### Database
- Neon Serverless PostgreSQL
- Alembic migrations

## WSL2 Setup (Windows)

If you're running this on Windows using WSL2:

1. **Install WSL2:**
   ```powershell
   wsl --install
   ```

2. **Install Python 3.11+ in WSL:**
   ```bash
   sudo apt update
   sudo apt install python3.11 python3.11-venv
   ```

3. **Install Node.js 18+ in WSL:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install UV in WSL:**
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

5. **Navigate to project directory:**
   ```bash
   cd /mnt/c/path/to/Todo_App
   ```

6. **Run the application:**
   ```bash
   uv sync
   uv run chief --help  # Phase I CLI
   ```

## Project Structure

```
Todo_App/
├── apps/
│   ├── frontend/              # Next.js application
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── lib/               # Utility functions
│   │   ├── styles/            # CSS and styling
│   │   └── middleware.ts      # Route protection
│   └── backend/               # FastAPI application
│       ├── main.py            # FastAPI app setup
│       ├── api/               # API endpoints
│       ├── core/              # Core configurations
│       ├── models/            # Pydantic models
│       ├── services/          # Business logic
│       └── dependencies.py    # Dependency injection
├── db/                       # Database layer
│   ├── models/               # SQLModel ORM models
│   ├── migrations/           # Alembic migrations
│   └── session.py            # Database session management
├── auth/                     # Authentication layer
│   ├── better_auth/          # Better Auth integration
│   ├── jwt/                  # JWT utilities
│   └── middleware.py         # Auth middleware
├── src/                      # Phase I CLI application
│   └── chief_of_staff/       # Original CLI codebase
├── specs/                    # Specifications for Phase II
│   └── phase2/
│       └── fullstack-todo/
├── .specify/                 # SpecKit Plus artifacts
│   ├── memory/               # Constitution and principles
│   ├── specs/                # Feature specifications
│   ├── plans/                # Architectural plans
│   ├── tasks/                # Implementation tasks
│   └── templates/            # PHR and ADR templates
└── history/                  # Historical records
    └── prompts/              # Prompt History Records
```

## Development

### Running Tests

```bash
# Phase I tests
uv run pytest

# Phase II tests (will be implemented)
cd apps/backend && pytest
cd apps/frontend && npm run test
```

### Code Style

The project follows PEP 8 guidelines with type hints throughout for Python code and TypeScript best practices for frontend code.

## License

MIT License
