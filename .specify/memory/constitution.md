<!--
  SYNC IMPACT REPORT
  ==================
  Version Change: 1.0.0 → 2.0.0 (MAJOR - Phase II Amendment)

  Modified Principles: N/A (Phase I principles preserved)

  Added Sections:
  - Phase II Project Identity Extension
  - Phase II Vision Statement Extension
  - Core Principles IX through XVI (Phase II specific)
  - Phase II Technology Stack
  - Phase II Development Workflow
  - Phase II Quality Gates & Deliverables
  - Phase II Non-Functional Requirements
  - Updated Future Evolution Path
  - Phase II Agents & Responsibilities
  - Phase II Architecture Rules

  Removed Sections: N/A (Phase I content preserved)

  Templates Requiring Updates:
  - .specify/templates/plan-template.md: ✅ Compatible (Phase II agents added)
  - .specify/templates/spec-template.md: ✅ Compatible (web/multi-user requirements)
  - .specify/templates/tasks-template.md: ✅ Compatible (Phase II task structure)

  Follow-up TODOs: None
-->

# Smart Personal Chief of Staff Constitution

## Project Identity

### Phase I: Foundation (Preserved)

| Attribute | Value |
|-----------|-------|
| **Name** | Smart Personal Chief of Staff |
| **Phase** | I - Foundation (Todo In-Memory Python Console App) |
| **Version** | 0.1.0 |
| **Type** | Command-Line Interface (CLI) Application |
| **Language** | Python 3.13+ |
| **Package Manager** | UV |

### Phase II: Web Transformation (Extension)

| Attribute | Value |
|-----------|-------|
| **Phase** | II - Web Application |
| **Type** | Full-Stack Web Application |
| **Architecture** | Separate Frontend/Backend Services |
| **Authentication** | Better Auth with JWT |
| **Database** | Neon Serverless PostgreSQL |
| **Deployment** | Multi-service (Frontend + Backend) |

## Vision Statement

### Phase I Vision (Preserved)

The Smart Personal Chief of Staff is a progressive task management system designed to evolve from a simple CLI application to a fully-featured cloud-native platform. Phase I establishes the architectural foundation through a clean, layered Python console application that demonstrates core task management capabilities while maintaining strict separation of concerns to enable future evolution.

**Mission**: Provide users with an intuitive, reliable, and extensible task management tool that grows with their needs—from personal todo lists to enterprise-grade distributed task orchestration.

**Phase I Goal**: Deliver a functional, well-architected CLI todo application using in-memory storage that validates the core domain model and establishes patterns for future phases.

### Phase II Vision (Extension)

**Phase II Goal**: Transform the CLI application into a secure, multi-user web application with persistent storage, RESTful API backend, and modern frontend interface while maintaining the core domain model and architectural principles established in Phase I.

**Multi-User Mission**: Enable users to manage their personal tasks through a web interface with proper authentication, authorization, and data isolation while preserving the simplicity and reliability of the original CLI experience.

**Web Transformation Objectives**:
1. Maintain all Phase I functionality with web-based equivalents
2. Add user authentication and multi-tenancy support
3. Implement persistent database storage with proper data isolation
4. Provide RESTful API for programmatic access
5. Deliver responsive, accessible web user interface
6. Ensure end-to-end security and data privacy

## Core Principles

### Phase I Principles (Preserved - NON-NEGOTIABLE)

#### I. Layered Architecture (PRESERVED)

The application MUST maintain strict separation between architectural layers (models → storage → services → interfaces).

#### II. Domain-Driven Design (PRESERVED)

The Task domain model remains the heart of the application and MUST be pure, validated, serializable, and self-documenting.

#### III. CLI-First Interface (PRESERVED for Phase I)

Phase I CLI functionality remains fully supported and maintained.

#### IV. Explicit Dependency Injection (PRESERVED)

Services and components MUST continue to receive dependencies explicitly.

#### V. Type Safety and Documentation (PRESERVED)

Full type coverage and documentation requirements remain in effect.

#### VI. Error Handling Strategy (PRESERVED)

Layer-appropriate error handling continues to be enforced.

#### VII. Cross-Platform Compatibility (PRESERVED)

Web application MUST work across modern browsers and platforms.

#### VIII. Simplicity and YAGNI (PRESERVED)

Start simple, add complexity only when needed for Phase II requirements.

### Phase II Principles (Extension)

#### IX. Service-Oriented Architecture (NON-NEGOTIABLE)

The application MUST be structured as separate frontend and backend services:

```
frontend/ (Next.js) ↔ backend/ (FastAPI) ↔ database/ (Neon PostgreSQL)
```

**Rules**:
- Frontend and backend MUST be independent services
- Communication MUST occur via RESTful API contracts
- No direct database access from frontend
- No shared code between services (except domain models)

**Rationale**: Service separation enables independent scaling, technology choices, and clear responsibility boundaries.

#### X. Authentication-First Design

All user data access MUST be authenticated and authorized:

```
User → Better Auth → JWT Token → API Requests → Backend Verification → Data Access
```

**Rules**:
- Frontend handles authentication via Better Auth
- Backend verifies JWT tokens using shared secret
- All API endpoints MUST validate authentication
- User identity MUST be extracted from JWT, never trusted from client
- All database queries MUST filter by authenticated user

**Rationale**: Security is foundational for multi-user systems.

#### XI. Data Ownership and Isolation

User data MUST be strictly isolated:

```
User A's Tasks ↔ User B's Tasks (NO SHARED ACCESS)
```

**Rules**:
- Every database record MUST have `owner_user_id` field
- All queries MUST include `WHERE owner_user_id = :current_user_id`
- Backend MUST validate user identity matches resource ownership
- No cross-user data access under any circumstances

**Rationale**: Data privacy and security require strict isolation.

#### XII. API Contract Stability

RESTful API contracts MUST be stable and versioned:

**Rules**:
- API endpoints follow RESTful conventions
- Request/response formats documented with OpenAPI
- Breaking changes require version increment
- Backward compatibility maintained within major versions
- Error responses follow consistent format

**Rationale**: Stable APIs enable reliable frontend development and third-party integration.

#### XIII. Frontend-Backend Separation of Concerns

Clear responsibility boundaries MUST be maintained:

**Frontend Responsibilities**:
- User interface and experience
- Authentication flows (Better Auth integration)
- JWT token management
- API client implementation
- Route protection and authorization
- User feedback and error handling

**Backend Responsibilities**:
- Business logic and domain services
- JWT verification and authorization
- Database access and data integrity
- API contract implementation
- Input validation and sanitization
- Rate limiting and security enforcement

**Rationale**: Clear separation enables independent development and scaling.

#### XIV. Database Integrity and Migrations

Database schema MUST be versioned and migratable:

**Rules**:
- SQLModel ORM for schema definition
- Alembic for database migrations
- All migrations MUST be reversible
- Schema changes require new migration
- Production data integrity MUST be preserved

**Rationale**: Database evolution requires controlled, reversible changes.

#### XV. Security-First Development

Security MUST be integrated at every layer:

**Rules**:
- HTTPS required for all communications
- JWT tokens with appropriate expiration
- CSRF protection for state-changing operations
- CORS configured with explicit allowed origins
- Input validation at all boundaries
- Secure headers on all responses
- No sensitive data in logs or error messages

**Rationale**: Security cannot be added as an afterthought.

#### XVI. Web Accessibility and Responsiveness

Web interface MUST be accessible and responsive:

**Rules**:
- WCAG 2.1 AA compliance
- Mobile-first responsive design
- Keyboard navigation support
- ARIA attributes for screen readers
- Semantic HTML structure
- Cross-browser compatibility

**Rationale**: Inclusive design ensures all users can access functionality.

## Technology Stack

### Phase I Stack (Preserved)

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Language | Python | 3.13+ | Core runtime |
| Package Manager | UV | Latest | Dependency management |
| CLI Framework | Click | Latest | Command parsing |
| Terminal UI | Rich | Latest | Formatted output |
| Storage | In-Memory Dict | N/A | Phase I persistence |

### Phase II Stack (Extension)

#### Frontend

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Next.js | 16+ | Web application framework |
| Router | App Router | N/A | Routing and navigation |
| Language | TypeScript | Latest | Type-safe frontend |
| Styling | Tailwind CSS | Latest | Utility-first CSS |
| State Management | React Context | N/A | Global state |
| Authentication | Better Auth | Latest | User authentication |
| API Client | Axios | Latest | HTTP requests |

#### Backend

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | FastAPI | Latest | REST API framework |
| Language | Python | 3.11+ | Backend runtime |
| ORM | SQLModel | Latest | Database models |
| Authentication | JWT (PyJWT) | Latest | Token verification |
| Validation | Pydantic | Latest | Data validation |
| Async | AnyIO | Latest | Async support |

#### Database

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Database | Neon PostgreSQL | Latest | Serverless PostgreSQL |
| Migrations | Alembic | Latest | Schema migrations |
| Connection Pooling | Database-native | N/A | Connection management |

#### Infrastructure

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Frontend Hosting | Vercel | Latest | Static hosting |
| Backend Hosting | Railway/Render | Latest | API hosting |
| CI/CD | GitHub Actions | Latest | Automation |
| Monitoring | Sentry | Latest | Error tracking |

### Phase II Prohibited Technologies

- Direct frontend database access
- Shared state between services
- Unauthenticated API endpoints
- Client-side data validation only
- Non-migratable schema changes
- Insecure token storage

## Development Workflow

### Phase I Workflow (Preserved)

1. **Specification Creation**: `/sp.specify` → `specs/<feature>/spec.md`
2. **Plan Generation**: `/sp.plan` → `specs/<feature>/plan.md`, `specs/<feature>/tasks.md`
3. **Implementation**: Phase I agents execute tasks
4. **Validation**: CLI testing and consistency checks

### Phase II Workflow (Extension)

#### Phase 1: Specification Creation (Enhanced)

1. User describes web/multi-user feature requirements
2. Run `/sp.specify` with web-specific templates
3. Include authentication and authorization requirements
4. Define API contracts and data models
5. Specify frontend and backend components separately

**Output**: `specs/<feature>/spec.md` (with Phase II sections)

#### Phase 2: Plan Generation (Enhanced)

1. Run `/sp.plan` with multi-service architecture
2. Verify constitution compliance (Phase I + Phase II principles)
3. Define service boundaries and API contracts
4. Run `/sp.tasks` with Phase II agent assignments
5. Include security and authentication considerations

**Output**: `specs/<feature>/plan.md`, `specs/<feature>/tasks.md`

#### Phase 3: Implementation (Multi-Service)

1. **Frontend Implementation**:
   - FrontendAgent implements UI components
   - AuthenticationAgent handles Better Auth integration
   - API client implementation with proper error handling
   - Route protection and authorization middleware

2. **Backend Implementation**:
   - BackendAgent implements API endpoints
   - AuthenticationAgent handles JWT verification
   - DatabaseAgent designs and implements schema
   - Business logic with user-scoped data filtering

3. **Database Implementation**:
   - DatabaseAgent creates migrations
   - Schema design with proper relationships
   - Data integrity constraints
   - User ownership fields on all tables

**Phase II Agents**:
- FrontendAgent: Next.js UI and Better Auth integration
- BackendAgent: FastAPI REST API implementation
- DatabaseAgent: Schema design and migrations
- AuthenticationAgent: JWT verification and security
- IntegrationAgent: Service-to-service coordination

#### Phase 4: Validation (Enhanced)

1. **Frontend Validation**:
   - All UI components functional
   - Authentication flows working
   - API client handles errors gracefully
   - Responsive design across devices

2. **Backend Validation**:
   - All API endpoints functional
   - JWT verification working
   - User-scoped data filtering enforced
   - Input validation and sanitization

3. **Security Validation**:
   - Authentication required for all endpoints
   - Data isolation verified
   - No cross-user access possible
   - Proper error handling without data leakage

4. **Integration Validation**:
   - Frontend-backend communication working
   - API contracts validated
   - End-to-end user flows functional
   - Error cases handled appropriately

**Output**: Working web application, API documentation, validation report

## Quality Gates & Deliverables

### Phase I Quality Gates (Preserved)

- [ ] All CLI commands functional
- [ ] Task CRUD operations working
- [ ] Layered architecture maintained
- [ ] Type safety and documentation complete

### Phase II Quality Gates (Extension)

#### Specification Approval

- [ ] Functional requirements include authentication and authorization
- [ ] API contracts defined with OpenAPI specification
- [ ] User stories account for multi-user scenarios
- [ ] Security requirements explicitly documented
- [ ] Data isolation rules defined

#### Frontend Implementation Completion

- [ ] All UI components implemented and styled
- [ ] Better Auth integration working
- [ ] Authentication flows (login, logout, signup) functional
- [ ] JWT token management secure
- [ ] API client with proper error handling
- [ ] Route protection implemented
- [ ] Responsive design verified
- [ ] Accessibility compliance (WCAG 2.1 AA)

#### Backend Implementation Completion

- [ ] All RESTful API endpoints implemented
- [ ] JWT verification working
- [ ] User-scoped data filtering enforced
- [ ] Input validation and sanitization
- [ ] Error handling with secure messages
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] OpenAPI documentation complete

#### Database Implementation Completion

- [ ] SQLModel schema designed
- [ ] Alembic migrations created
- [ ] User ownership fields on all tables
- [ ] Data integrity constraints implemented
- [ ] Indexes for performance optimization
- [ ] Backup and restore strategy defined

#### Security Validation

- [ ] Authentication required for all protected endpoints
- [ ] JWT tokens properly validated
- [ ] User data strictly isolated
- [ ] No SQL injection vulnerabilities
- [ ] Secure headers on all responses
- [ ] No sensitive data in logs or errors
- [ ] CSRF protection implemented

#### Integration Validation

- [ ] Frontend-backend communication working
- [ ] All user flows functional end-to-end
- [ ] Error cases handled gracefully
- [ ] Performance targets met
- [ ] Cross-browser compatibility verified

## Non-Functional Requirements

### Phase I Requirements (Preserved)

- Performance: CLI operations < 100ms
- Usability: Clear commands and error messages
- Maintainability: PEP8 compliance, full type hints
- Reliability: No crashes on valid input

### Phase II Requirements (Extension)

#### Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Response Time | < 300ms p95 | Endpoint response latency |
| Page Load Time | < 2s | Time to interactive |
| Database Query | < 50ms | Individual query execution |
| Authentication | < 1s | Login flow completion |

#### Usability

- Intuitive web interface with clear navigation
- Consistent authentication experience
- Helpful error messages with actionable guidance
- Responsive design across devices
- Accessible to users with disabilities
- Consistent with Phase I CLI patterns where applicable

#### Maintainability

- Clean separation between frontend and backend
- Consistent code style (ESLint for TS, Ruff for Python)
- Full type coverage (TypeScript + Python type hints)
- Comprehensive documentation
- Modular architecture for independent scaling
- Clear ownership boundaries between services

#### Security

- OWASP Top 10 compliance
- No critical vulnerabilities in security scans
- Proper authentication and authorization
- Data encryption in transit and at rest
- Secure token storage and handling
- Regular dependency vulnerability scanning

#### Reliability

- 99.9% uptime for production services
- Graceful degradation under load
- Proper error handling without data leakage
- Database backup and recovery procedures
- Monitoring and alerting for critical failures
- Automated health checks and recovery

## Future Evolution Path

### Phase II: Full-Stack Web Application (CURRENT)

- ✅ Multi-user system with authentication
- ✅ RESTful API backend with FastAPI
- ✅ Persistent database storage with Neon PostgreSQL
- ✅ Responsive web interface with Next.js
- ✅ JWT-based stateless security
- ✅ Data isolation and user ownership

### Phase III: Advanced Features

- Task sharing and collaboration
- Team/workspace support
- Advanced filtering and search
- Task attachments and comments
- Calendar integration
- Notifications and reminders

### Phase IV: Distributed System

- Event-driven architecture with message queues
- Real-time updates via WebSockets
- Horizontal scaling capability
- Multi-region deployment
- Advanced caching strategies
- Microservices decomposition

### Phase V: Cloud-Native Enhancement

- Kubernetes orchestration
- Service mesh integration
- Observability stack (metrics, tracing, logging)
- Auto-scaling based on load
- Blue-green deployment strategy
- Feature flags for gradual rollout

### Phase VI: AI Integration

- Natural language task creation
- Smart task prioritization and scheduling
- Automated task categorization
- Intelligent reminders and suggestions
- Voice interface integration
- Predictive task management

## Phase II Agents & Responsibilities

### FrontendAgent

**Responsibility**: Next.js web application implementation

- User interface components and pages
- Better Auth integration and authentication flows
- API client implementation
- State management and data fetching
- Route protection and authorization
- Responsive design and accessibility

**Must NOT**:
- Implement backend API logic
- Access database directly
- Handle JWT verification (backend responsibility)
- Create database schemas

### BackendAgent

**Responsibility**: FastAPI REST API implementation

- API endpoint implementation
- Business logic and domain services
- JWT verification and authorization
- Input validation and sanitization
- Rate limiting and security enforcement
- Database access through ORM

**Must NOT**:
- Implement frontend UI components
- Handle user authentication flows (frontend)
- Allow direct database access from frontend
- Trust user_id from client without verification

### DatabaseAgent

**Responsibility**: Database schema and persistence

- SQLModel ORM model design
- Alembic migration creation
- Schema optimization and indexing
- Data integrity constraints
- User ownership field implementation
- Backup and restore strategies

**Must NOT**:
- Implement API endpoints
- Handle authentication logic
- Create business logic
- Allow frontend database access

### AuthenticationAgent

**Responsibility**: Security and authentication

- Better Auth configuration and integration
- JWT token issuance and verification
- Authentication flow design
- Security policy enforcement
- Token validation rules
- Authorization middleware

**Must NOT**:
- Implement frontend UI
- Create backend business logic
- Design database schemas
- Handle route protection (frontend responsibility)

## Phase II Architecture Rules

### Service Communication

1. **Frontend-Backend Communication**:
   - Frontend calls backend via RESTful API
   - All requests include `Authorization: Bearer <JWT>` header
   - Backend validates JWT before processing
   - Frontend handles API errors gracefully

2. **Backend-Database Communication**:
   - Backend accesses database via SQLModel ORM
   - All queries include user ownership filtering
   - Database never exposed to frontend
   - Connection pooling managed by ORM

### Authentication Flow

```
1. User accesses frontend application
2. Frontend initiates Better Auth authentication
3. Better Auth issues JWT token to frontend
4. Frontend stores JWT securely (HTTP-only cookie)
5. Frontend attaches JWT to all API requests
6. Backend extracts and validates JWT
7. Backend decodes user identity from JWT
8. Backend applies user-scoped filtering to all queries
9. Backend returns user-specific data only
```

### Data Isolation Rules

1. **Database Schema**: Every table MUST have `owner_user_id` field
2. **Query Filtering**: All user data queries MUST include `WHERE owner_user_id = :current_user_id`
3. **Authorization**: Backend MUST validate user identity matches resource ownership
4. **No Cross-User Access**: System MUST prevent any cross-user data access
5. **Audit Trail**: All data access MUST be logged with user context

### Security Rules

1. **Token Handling**: JWT tokens MUST be HTTP-only, Secure, SameSite=Lax
2. **Input Validation**: All API inputs MUST be validated and sanitized
3. **Error Handling**: Security errors MUST return generic messages
4. **Rate Limiting**: API endpoints MUST have appropriate rate limits
5. **CORS**: Strict CORS policies MUST be enforced
6. **CSRF Protection**: State-changing operations MUST have CSRF protection
7. **Secure Headers**: All responses MUST include security headers

## Governance

### Constitution Authority (Preserved)

This constitution remains the authoritative source for all architectural and process decisions. Phase II amendments extend but do not replace Phase I principles.

### Amendment Process (Preserved)

1. **Proposal**: Document proposed change with rationale
2. **Impact Analysis**: Identify affected components (Phase I + Phase II)
3. **Review**: Evaluate against project goals and future phases
4. **Approval**: Explicit acceptance required before implementation
5. **Migration**: Update all affected artifacts
6. **Version**: Increment constitution version per semantic rules

### Version Policy (Updated)

- **MAJOR**: Backward-incompatible changes or new phases (e.g., Phase II)
- **MINOR**: New principles or expanded guidance
- **PATCH**: Clarifications, typos, non-semantic refinements

### Compliance Verification (Enhanced)

- All PRs MUST reference relevant constitution principles (Phase I + Phase II)
- Architecture violations MUST be justified in writing
- Phase II security requirements MUST be validated
- Cross-service compliance MUST be verified
- Regular audits against both Phase I and Phase II compliance recommended

## Appendices

### Appendix A: Phase I Command Reference (Preserved)

```bash
# CLI commands remain available for Phase I compatibility
python main.py add "Buy groceries"
python main.py list
python main.py complete <task-id>
```

### Appendix B: Phase II API Reference

```bash
# Authentication endpoints
POST /api/auth/signup          # User registration
POST /api/auth/login           # User login
POST /api/auth/refresh         # Token refresh
GET  /api/auth/me             # Current user info

# Task endpoints (all require authentication)
GET    /api/tasks               # List user tasks
POST   /api/tasks               # Create new task
GET    /api/tasks/{id}          # Get specific task
PUT    /api/tasks/{id}          # Update task
DELETE /api/tasks/{id}          # Delete task
PATCH  /api/tasks/{id}/complete # Mark complete
PATCH  /api/tasks/{id}/incomplete # Mark incomplete
```

### Appendix C: Phase II Task Model Extension

```python
# Extended for multi-user support
@dataclass
class Task:
    title: str                              # Required, non-empty
    description: Optional[str] = None       # Optional
    id: UUID = field(default_factory=uuid4) # Auto-generated
    status: TaskStatus = TaskStatus.PENDING # Default: pending
    created_at: datetime = field(default_factory=datetime.now)
    updated_at: datetime = field(default_factory=datetime.now)
    owner_user_id: UUID = None              # NEW: User ownership
```

### Appendix D: Phase II Error Messages

| Scenario | Message Format |
|----------|----------------|
| Authentication required | "Authentication required" |
| Invalid credentials | "Invalid email or password" |
| Token expired | "Session expired, please log in again" |
| Unauthorized access | "Access denied" |
| Task not found | "Task not found or you don't have permission" |
| Validation error | "Invalid input: {field}" |

---

**Version**: 2.0.0 | **Ratified**: 2026-01-16 | **Last Amended**: 2026-01-16
**Phase**: II - Web Application | **Status**: Active