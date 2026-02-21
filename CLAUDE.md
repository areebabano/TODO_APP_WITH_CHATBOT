# Agentic Dev Stack - Multi-Agent Web Application Architecture

This file defines the agentic architecture and development workflow for transforming the console-based task management application into a modern, multi-user web application with persistent storage. It serves as the single source of truth for agent orchestration, skill usage, and cross-agent collaboration.

## Project Objective

Transform the existing console-based application into a production-grade web application following the **Agentic Dev Stack workflow**:

1. **Write specification** - Define requirements and acceptance criteria
2. **Generate plan** - Architectural decisions and technical approach
3. **Break plan into tasks** - Testable, dependency-ordered implementation steps
4. **Implement via Claude Code** - Agent-driven development with strict discipline
5. **No manual coding** - All implementation must be agent-executed

This transformation requires strict adherence to the spec-driven development process where all work originates from approved specifications and is executed exclusively through specialized agents using their assigned skills.

## Agentic Dev Stack Workflow

### Core Principles

- **Spec-Driven Development**: All work originates from approved specifications
- **Agent Specialization**: Each agent has strict responsibility boundaries
- **Skill-Based Execution**: Agents rely exclusively on their assigned skills
- **Cross-Agent Collaboration**: Well-defined interaction protocols between agents
- **Security-First**: Authentication and authorization enforced at all layers
- **Agentic Discipline**: Strict adherence to responsibility boundaries and skill usage

### Development Flow

```
User Request → Specification → Architectural Plan → Task Breakdown →
Agent Assignment → Skill Execution → Validation → PHR Documentation
```

This workflow ensures that:
1. All implementation work is traceable back to approved specifications
2. Each agent operates within its defined responsibility boundaries
3. Agents use only their assigned skills for execution
4. Cross-agent interactions follow established protocols
5. All decisions and prompts are documented in PHRs (Prompt History Records)

## Agent Architecture

### Agent Responsibility Matrix

#### 1. Auth Agent

**Skill**: Authentication Skill
**Responsibility**:
- User signup and signin flows
- Better Auth configuration and integration
- JWT token issuance and management
- Token validation rules and security policies
- Authentication-related architectural decisions

**Must NOT**:
- Implement frontend UI components
- Create backend business logic
- Design database schemas
- Handle route protection (frontend agent responsibility)

**Skill Usage**: MUST use Authentication Skill exclusively for all authentication-related work

#### 2. Frontend Agent

**Skill**: Frontend Skill
**Responsibility**:
- Next.js 16+ App Router frontend implementation
- Responsive UI components and layouts
- Authentication-aware pages and components
- API integration and data fetching
- Route protection via middleware
- User experience and accessibility

**Must NOT**:
- Implement backend API endpoints
- Design database models
- Handle JWT verification logic
- Create authentication flows (auth agent responsibility)

**Skill Usage**: MUST use Frontend Skill exclusively for all frontend-related work

#### 3. Backend Agent

**Skill**: Backend Skill
**Responsibility**:
- FastAPI REST API implementation
- Business logic and domain services
- JWT verification and authorization enforcement
- User-scoped data filtering and access control
- API contract validation and error handling
- Rate limiting and security headers

**Must NOT**:
- Implement frontend components
- Design database schemas (DB agent responsibility)
- Handle user authentication flows
- Create UI-related logic

**Skill Usage**: MUST use Backend Skill exclusively for all backend-related work

#### 4. DB Agent

**Skill**: Database Skill
**Responsibility**:
- Database schema design and optimization
- SQLModel ORM implementation
- Neon Serverless PostgreSQL integration
- Relationships, constraints, and data integrity
- Database migrations and versioning
- Query optimization and indexing strategies

**Must NOT**:
- Implement API endpoints
- Create business logic
- Handle authentication flows
- Design frontend components

**Skill Usage**: MUST use Database Skill exclusively for all database-related work

## Skill Usage Enforcement

### Agent-Skill Binding Rules

1. **Exclusive Skill Usage**: Each agent MUST use only its assigned skill for all execution work
2. **No Skill Overlap**: Agents MUST NOT use skills assigned to other agents
3. **Skill Documentation**: All skill usage must be recorded in PHRs with clear context
4. **Skill Versioning**: Agents must use the specified versions of their assigned skills

### Agent-Skill Mapping

| Agent | Assigned Skill | Scope of Work |
|-------|---------------|---------------|
| Auth Agent | Authentication Skill | All authentication and JWT-related work |
| Frontend Agent | Frontend Skill | All Next.js frontend implementation |
| Backend Agent | Backend Skill | All FastAPI backend implementation |
| DB Agent | Database Skill | All database schema and ORM work |

### Skill Usage Validation

1. **Pre-Execution Check**: Before any task execution, verify the agent is using its assigned skill
2. **Post-Execution Review**: Validate that all work was performed using the correct skill
3. **Cross-Agent Audit**: Regularly audit agent work to ensure no skill boundary violations
4. **Documentation Compliance**: Ensure all skill usage is properly documented in PHRs

## Cross-Agent Collaboration Rules

### Frontend ↔ Auth Agent Interaction

**Authentication Flow**:
1. Frontend agent implements login/signup UI components
2. Auth agent provides Better Auth integration specifications
3. Frontend agent calls auth endpoints and handles token storage
4. Auth agent defines JWT structure and validation requirements

**Session Management**:
- Frontend agent stores JWT in secure HTTP-only cookies
- Frontend agent attaches `Authorization: Bearer <JWT>` to API requests
- Auth agent defines token expiration and refresh policies

### Backend ↔ Auth Agent Interaction

**Token Verification**:
1. Backend agent receives requests with Authorization headers
2. Backend agent extracts and validates JWT using auth agent specifications
3. Backend agent verifies token signature using shared secret
4. Backend agent validates token expiration and claims
5. Backend agent decodes user identity for authorization

**Security Policies**:
- Auth agent defines token validation rules
- Backend agent enforces all security policies
- Backend agent handles token revocation and invalidation

### Backend ↔ DB Agent Interaction

**Data Access Patterns**:
1. DB agent designs schema with user ownership fields
2. Backend agent implements repository patterns
3. Backend agent applies user-scoped filtering to all queries
4. DB agent provides optimized queries for common access patterns

**Transaction Management**:
- DB agent defines transaction boundaries
- Backend agent manages transaction lifecycle
- Backend agent ensures data consistency across operations

## Security & Data Ownership Guarantees

### User Isolation Requirements

1. **Data Segregation**: All database queries MUST include user identity filtering
2. **Resource Ownership**: Every data record MUST have an owner_user_id field
3. **Query Filtering**: Backend agent MUST apply `WHERE owner_user_id = :current_user_id` to all user data queries
4. **Authorization Enforcement**: Backend agent MUST validate user identity matches resource ownership

### Authentication Flow Implementation

```
1. User signs in via frontend (Frontend Agent)
2. Better Auth creates session and issues JWT (Auth Agent)
3. Frontend sends API requests with:
   Authorization: Bearer <JWT> (Frontend Agent)
4. Backend:
   - Extracts token from Authorization header (Backend Agent)
   - Verifies signature using shared secret (Backend Agent)
   - Validates expiration and claims (Backend Agent)
   - Decodes user ID and email (Backend Agent)
5. Backend:
   - Matches user identity with requested resource (Backend Agent)
   - Filters database queries: WHERE owner_user_id = :current_user_id (Backend Agent)
   - Ensures users ONLY see their own data (Backend Agent)
```

### Security Implementation Requirements

- **Token Handling**: JWT tokens must be HTTP-only, Secure, SameSite=Lax
- **Input Validation**: All API inputs must be validated and sanitized
- **Error Handling**: Security errors must return generic messages
- **Rate Limiting**: API endpoints must have appropriate rate limits
- **CORS**: Strict CORS policies must be enforced
- **CSRF Protection**: All state-changing operations must have CSRF protection

## Agentic Discipline Rules

### Core Discipline Principles

1. **Strict Responsibility Boundaries**: Agents MUST operate only within their defined responsibility domains
2. **No Overlap**: Agents MUST NOT perform work that belongs to other agents
3. **Exclusive Skill Usage**: Agents MUST use only their assigned skills for execution
4. **Documentation First**: All architectural decisions and agent interactions must be documented before implementation
5. **Validation at Every Step**: Continuous validation of agent work against specifications

### Agent Behavior Enforcement

1. **Auth Agent Discipline**:
   - MUST handle all authentication-related work exclusively
   - MUST NOT implement frontend UI or backend business logic
   - MUST use Authentication Skill for all execution
   - MUST document all security decisions in ADRs

2. **Frontend Agent Discipline**:
   - MUST handle all Next.js frontend implementation exclusively
   - MUST NOT implement backend API endpoints or database schemas
   - MUST use Frontend Skill for all execution
   - MUST ensure all routes are properly protected via middleware

3. **Backend Agent Discipline**:
   - MUST handle all FastAPI backend implementation exclusively
   - MUST NOT implement frontend components or design database schemas
   - MUST use Backend Skill for all execution
   - MUST enforce user-scoped data filtering on all queries

4. **DB Agent Discipline**:
   - MUST handle all database schema and ORM work exclusively
   - MUST NOT implement API endpoints or business logic
   - MUST use Database Skill for all execution
   - MUST ensure all schemas include proper user ownership fields

### Cross-Agent Interaction Discipline

1. **Clear Interface Contracts**: All agent interactions must follow defined protocols
2. **No Direct Implementation**: Agents MUST NOT implement functionality outside their domain
3. **Proper Handoffs**: When work requires multiple agents, clear handoff points must be established
4. **Validation Gates**: Each agent must validate inputs from other agents before processing

### Decision Making Discipline

1. **ADR Documentation**: All architectural decisions must be documented as ADRs before implementation
2. **User Approval**: Significant decisions affecting multiple agents require user approval
3. **Impact Analysis**: Decisions must include analysis of cross-agent impact
4. **Version Control**: All decisions must be versioned and traceable

### Error Handling Discipline

1. **Agent-Specific Errors**: Each agent must handle its own error types appropriately
2. **Secure Error Messages**: User-facing errors must be generic and secure
3. **Cross-Agent Error Translation**: Errors passed between agents must be properly translated
4. **Comprehensive Logging**: All errors must be logged with correlation IDs for tracing

## Technology Stack

### Frontend

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules or Tailwind CSS
- **State Management**: React Context or Zustand
- **Authentication**: Better Auth integration
- **API Client**: Axios or Fetch API

### Backend

- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Authentication**: JWT-based with Better Auth
- **API Style**: RESTful endpoints
- **Validation**: Pydantic models
- **Security**: OAuth2, CORS, CSRF protection

### Database

- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Migrations**: Alembic
- **Connection Pooling**: Database-specific connection pooling

### Infrastructure

- **Deployment**: Vercel (Frontend), Railway/Render (Backend)
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry for error tracking
- **Logging**: Structured logging with correlation IDs

## Development Workflow

### Specification Phase

1. **User Request Analysis**: Understand requirements and constraints
2. **Scope Definition**: Identify in-scope and out-of-scope features
3. **Acceptance Criteria**: Define testable success criteria
4. **Architectural Constraints**: Document technical limitations

### Planning Phase

1. **Agent Assignment**: Determine which agents handle which components
2. **Dependency Mapping**: Identify cross-agent dependencies
3. **Interface Contracts**: Define API contracts between layers
4. **Risk Assessment**: Identify and mitigate top risks

### Task Breakdown Phase

1. **Granular Tasks**: Break work into testable, atomic units
2. **Dependency Ordering**: Ensure proper execution sequence
3. **Agent-Specific Tasks**: Assign tasks to appropriate agents
4. **Validation Criteria**: Define success metrics for each task

### Implementation Phase

1. **Agent Execution**: Agents implement using their assigned skills
2. **Cross-Agent Coordination**: Follow collaboration rules strictly
3. **Continuous Validation**: Test at each step
4. **PHR Documentation**: Record all prompts and decisions

### Validation Phase

1. **Unit Testing**: Agent-specific functionality
2. **Integration Testing**: Cross-agent interactions
3. **End-to-End Testing**: Complete user flows
4. **Security Testing**: Authentication and authorization
5. **Performance Testing**: Load and stress testing

## Agentic Discipline Rules

### Skill Usage Enforcement

1. **Skill Exclusivity**: Agents MUST use only their assigned skills
2. **No Overlap**: Agents MUST NOT perform tasks outside their responsibility
3. **Skill Documentation**: All skill usage must be recorded in PHRs
4. **Skill Versioning**: Agents must use specified skill versions

### Decision Making

1. **Architectural Decisions**: Must be documented as ADRs
2. **Cross-Agent Impact**: Decisions affecting multiple agents require coordination
3. **User Invocation**: Significant decisions require user approval
4. **Documentation First**: All decisions must be recorded before implementation

### Error Handling

1. **Agent-Specific Errors**: Each agent handles its own error types
2. **Cross-Agent Errors**: Proper error translation between layers
3. **User-Facing Errors**: Generic, secure error messages only
4. **Logging**: Comprehensive logging with correlation IDs

## Project Structure (Web Application)

```
/
├── apps/
│   ├── frontend/          # Next.js application
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── lib/           # Utility functions
│   │   ├── styles/        # CSS and styling
│   │   └── middleware.ts  # Route protection
│   └── backend/           # FastAPI application
│       ├── main.py        # FastAPI app setup
│       ├── api/           # API endpoints
│       ├── core/          # Core configurations
│       ├── models/        # Pydantic models
│       ├── services/      # Business logic
│       └── dependencies.py # Dependency injection
├── db/                   # Database layer
│   ├── models/           # SQLModel ORM models
│   ├── migrations/       # Alembic migrations
│   └── session.py        # Database session management
├── auth/                 # Authentication layer
│   ├── better_auth/      # Better Auth integration
│   ├── jwt/              # JWT utilities
│   └── middleware.py     # Auth middleware
├── .specify/             # SpecKit Plus artifacts
│   ├── memory/           # Constitution and principles
│   ├── specs/            # Feature specifications
│   ├── plans/            # Architectural plans
│   ├── tasks/            # Implementation tasks
│   └── templates/        # PHR and ADR templates
└── history/              # Historical records
    ├── prompts/          # Prompt History Records
    └── adr/              # Architecture Decision Records
```

## Basic Level Requirements Implementation

### Feature Parity

The web application must implement all 5 basic-level features from the original console app:

1. **Task Creation**: Web form with validation
2. **Task Listing**: Paginated, filterable task list
3. **Task Completion**: Toggle complete/incomplete status
4. **Task Updates**: Edit title and description
5. **Task Deletion**: Confirmation dialog with undo option

### Multi-User Requirements

1. **User Registration**: Signup with email/password
2. **User Authentication**: Login/logout flows
3. **User Sessions**: Persistent sessions with JWT
4. **Data Isolation**: Users only see their own tasks
5. **User Profiles**: Basic profile management

### Persistent Storage

1. **Database Schema**: SQLModel with proper relationships
2. **Data Migration**: From console app format if needed
3. **Data Integrity**: Constraints and validation
4. **Backup Strategy**: Regular database backups
5. **Data Retention**: Appropriate retention policies

### RESTful API Endpoints

```
POST   /api/auth/signup          # User registration
POST   /api/auth/login           # User login
POST   /api/auth/refresh         # Token refresh
GET    /api/auth/me             # Current user info

GET    /api/tasks               # List user tasks
POST   /api/tasks               # Create new task
GET    /api/tasks/{id}          # Get specific task
PUT    /api/tasks/{id}          # Update task
DELETE /api/tasks/{id}          # Delete task
PATCH  /api/tasks/{id}/complete # Mark complete
PATCH  /api/tasks/{id}/incomplete # Mark incomplete
```

### Responsive Frontend UI

1. **Mobile-First Design**: Responsive layouts
2. **Accessibility**: WCAG 2.1 AA compliance
3. **Authentication Pages**: Login, signup, password reset
4. **Task Management**: Create, list, edit, delete tasks
5. **User Dashboard**: Overview of task statistics
6. **Error Handling**: User-friendly error messages

## Quality Assurance

### Testing Strategy

1. **Unit Tests**: 80%+ code coverage for each agent's work
2. **Integration Tests**: Cross-agent functionality validation
3. **E2E Tests**: Complete user journey testing
4. **Security Tests**: OWASP Top 10 vulnerability scanning
5. **Performance Tests**: Load testing for API endpoints

### Code Quality

1. **Type Safety**: TypeScript (frontend) and Python type hints (backend)
2. **Linting**: ESLint (frontend), Ruff (backend)
3. **Formatting**: Prettier (frontend), Black (backend)
4. **Documentation**: Comprehensive docstrings and comments
5. **Code Reviews**: Mandatory peer review process

### Deployment Pipeline

1. **CI/CD**: Automated testing and deployment
2. **Environment Parity**: Consistent development, staging, production
3. **Feature Flags**: Gradual feature rollout
4. **Monitoring**: Error tracking and performance monitoring
5. **Rollback**: Automatic rollback on critical failures

## Success Metrics

### Implementation Quality

- **Agent Discipline**: 100% adherence to responsibility boundaries
- **Skill Usage**: 100% of work performed via assigned skills
- **Documentation**: Complete PHR and ADR coverage
- **Security**: Zero critical vulnerabilities in security scans
- **Performance**: API responses under 300ms p95

### Project Outcomes

- **Feature Completeness**: All 5 basic features implemented
- **Multi-User Support**: Full user isolation and authentication
- **Persistent Storage**: Reliable data storage and retrieval
- **Code Quality**: 80%+ test coverage, zero linting errors
- **User Experience**: Intuitive, responsive interface

## Maintenance & Evolution

### Future-Proofing

1. **Modular Architecture**: Easy to add new features
2. **API Versioning**: Backward-compatible evolution
3. **Database Migrations**: Safe schema changes
4. **Documentation**: Comprehensive and up-to-date
5. **Agent Extensibility**: Easy to add new agent types

### Scaling Strategy

1. **Horizontal Scaling**: Stateless backend services
2. **Database Optimization**: Read replicas and caching
3. **CDN Usage**: Static asset delivery
4. **Microservices**: Gradual decomposition of monolith
5. **Agent Specialization**: Additional specialized agents as needed

## Project Governance

### Compliance Requirements

1. **Agentic Discipline Compliance**: 100% adherence to all agent responsibility boundaries and skill usage rules
2. **Spec-Driven Compliance**: All implementation work must be traceable to approved specifications
3. **Security Compliance**: All security requirements must be implemented and validated
4. **Documentation Compliance**: Complete PHR and ADR coverage for all decisions and prompts
5. **Quality Compliance**: 80%+ test coverage and zero critical vulnerabilities

### Review and Approval Process

1. **Specification Review**: All specifications must be reviewed and approved before implementation
2. **Architectural Review**: All ADRs must be reviewed for cross-agent impact
3. **Implementation Review**: All agent work must be validated against specifications
4. **Security Review**: All security implementations must undergo penetration testing
5. **User Acceptance**: Final implementation must be approved by stakeholders

### Continuous Improvement

1. **Agent Performance Monitoring**: Track agent efficiency and skill usage patterns
2. **Process Optimization**: Regularly review and improve development workflows
3. **Skill Enhancement**: Continuously update and improve agent skills
4. **Documentation Refinement**: Keep all documentation current and comprehensive
5. **Lessons Learned**: Document and incorporate insights from each development cycle

## Conclusion

This architecture provides a comprehensive framework for transforming the console application into a modern web application using the Agentic Dev Stack. By strictly following the defined agent responsibilities, collaboration rules, and development workflow, the project will achieve high-quality, maintainable, and secure implementation that meets all requirements while being easily extensible for future enhancements.

### Key Success Factors

1. **Strict Agentic Discipline**: Rigorous adherence to responsibility boundaries and skill usage
2. **Spec-Driven Development**: All work traceable to approved specifications
3. **Cross-Agent Collaboration**: Well-defined interaction protocols between agents
4. **Security-First Approach**: Authentication and authorization enforced at all layers
5. **Comprehensive Documentation**: Complete PHR and ADR coverage for all decisions

### Expected Outcomes

- Production-grade web application with full feature parity
- Secure multi-user system with proper data isolation
- Scalable architecture following modern best practices
- Well-documented codebase with comprehensive testing
- Easily maintainable and extensible system for future growth