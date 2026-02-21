# Research Document: Task CLI Application

**Feature Branch**: `001-task-cli-app`
**Created**: 2025-12-28
**Status**: Complete

## Overview

This document captures research findings and decisions for the Smart Personal Chief of Staff CLI application. All technical decisions have been resolved with no outstanding NEEDS CLARIFICATION items.

---

## Technology Decisions

### 1. Package Manager: UV

**Decision**: Use UV as the Python package manager.

**Rationale**:
- UV is the mandated package manager per constitution
- Provides fast dependency resolution
- Creates reproducible environments via lock files
- Native Python 3.13+ support

**Alternatives Considered**:
- pip + venv: More familiar but slower, less reproducible
- Poetry: Good alternative but UV is explicitly required by constitution
- Conda: Overkill for this project scope

---

### 2. CLI Framework: Click

**Decision**: Use Click >= 8.1.7 for command-line parsing.

**Rationale**:
- Mandated by constitution
- Excellent decorator-based command composition
- Built-in help generation
- Strong typing support
- Well-documented and widely used

**Alternatives Considered**:
- argparse (stdlib): More verbose, less ergonomic
- typer: Built on Click, adds unnecessary complexity
- fire: Too magical, less control over output

---

### 3. Terminal Output: Rich

**Decision**: Use Rich >= 13.7.0 for formatted terminal output.

**Rationale**:
- Mandated by constitution
- Beautiful table formatting
- Consistent color handling across platforms
- Automatic terminal capability detection
- Graceful fallback on limited terminals

**Alternatives Considered**:
- Plain print: Insufficient for formatted tables
- colorama: Lower level, requires more code
- tabulate: Good for tables but no color support

---

### 4. Data Model: Python Dataclass

**Decision**: Use Python standard library dataclasses for the Task model.

**Rationale**:
- No additional dependencies (YAGNI principle)
- Clean syntax with type hints
- Built-in `__post_init__` for validation
- Easy serialization with field iteration
- Python 3.13+ has excellent dataclass support

**Alternatives Considered**:
- Pydantic: More powerful validation but adds dependency
- attrs: Similar to dataclasses but external
- NamedTuple: Immutable, which doesn't fit our use case

---

### 5. Storage: In-Memory Dictionary

**Decision**: Use Python dict for Phase I storage.

**Rationale**:
- Mandated for Phase I per constitution
- Simplest possible implementation
- Python 3.7+ preserves insertion order
- Easy to replace with persistent storage in Phase II
- No external dependencies

**Alternatives Considered**:
- SQLite: Out of scope for Phase I
- JSON file: Adds file I/O complexity
- Pickle: Not human-readable, security concerns

---

### 6. ID Generation: UUID4

**Decision**: Use UUID version 4 for task identifiers.

**Rationale**:
- Standard library (no dependencies)
- Guaranteed uniqueness
- No coordination needed (unlike auto-increment)
- Works well with future distributed scenarios

**Alternatives Considered**:
- Auto-increment integers: Requires state management
- ULID: Adds dependency, overkill for Phase I
- Timestamp-based: Collision risk

---

### 7. Datetime Handling: Naive Local Time

**Decision**: Use `datetime.now()` for all timestamps (naive local time).

**Rationale**:
- Simplest approach for Phase I
- No timezone complexity
- Consistent behavior within single user context
- Can be upgraded to UTC-aware in future phases

**Alternatives Considered**:
- UTC with timezone: More correct but adds complexity
- Unix timestamps: Less human-readable
- Third-party date library: Unnecessary dependency

---

## Architecture Decisions

### 1. Layered Architecture Pattern

**Decision**: Implement strict layers: models → storage → services → cli → main.

**Rationale**:
- Mandated by constitution (Principle I)
- Enables independent testing of each layer
- Facilitates future storage replacement
- Clear separation of concerns

**Implementation Notes**:
- No circular imports allowed
- Each layer only imports from layers below
- Dependency injection for cross-layer communication

---

### 2. Dependency Injection Pattern

**Decision**: Use constructor injection for all dependencies.

**Rationale**:
- Mandated by constitution (Principle IV)
- Makes dependencies explicit and visible
- Enables easy testing with mock objects
- No hidden global state

**Implementation Notes**:
- MemoryStore injected into TaskService
- TaskService injected into CLI commands
- Main.py wires all dependencies at startup

---

### 3. Error Handling Strategy

**Decision**: Layer-specific exceptions with user-friendly CLI messages.

**Rationale**:
- Mandated by constitution (Principle VI)
- Each layer has appropriate exception types
- Service layer wraps storage exceptions
- CLI displays user-friendly messages (no stack traces)

**Exception Hierarchy**:
- `ValueError`: Model validation errors
- `TaskNotFoundException`: Storage layer (task not found)
- `ValidationError`: Service layer (input validation)
- `TaskNotFoundError`: Service layer (wraps storage exception)
- Click exceptions: CLI layer (usage errors)

---

### 4. Task ID Display: First 8 Characters

**Decision**: Display first 8 characters of UUID in CLI output.

**Rationale**:
- Full UUID (36 chars) too long for table display
- 8 characters provides sufficient uniqueness for user context
- Users can copy-paste from display for commands
- Strip whitespace from pasted IDs

**Implementation Notes**:
- Full UUID stored internally
- Truncated display in list command
- Accept both full and truncated IDs in commands (match prefix)

---

## Best Practices Research

### Click CLI Best Practices

1. Use `@click.group()` for main entry point
2. Use `@cli.command()` for subcommands
3. Use `@click.argument()` for required positional args
4. Use `@click.option()` for optional flags
5. Include help text for all commands and options
6. Return appropriate exit codes (0 = success, 1 = error)

### Rich Output Best Practices

1. Use `Console()` singleton for consistent output
2. Use `Table()` for structured data display
3. Use style strings for colors ("green", "yellow", "red")
4. Use `console.print()` for all output
5. Handle terminal width gracefully (Rich auto-wraps)

### Python Dataclass Best Practices

1. Put required fields before optional fields (unless using defaults)
2. Use `field(default_factory=...)` for mutable defaults
3. Use `__post_init__` for validation
4. Type hint all fields
5. Keep dataclasses focused (single responsibility)

---

## Resolution Status

| Item | Status | Resolution |
|------|--------|------------|
| Package Manager | RESOLVED | UV (mandated) |
| CLI Framework | RESOLVED | Click >= 8.1.7 (mandated) |
| Output Library | RESOLVED | Rich >= 13.7.0 (mandated) |
| Data Model | RESOLVED | Python dataclass |
| Storage | RESOLVED | In-memory dict |
| ID Generation | RESOLVED | UUID4 |
| Datetime | RESOLVED | Naive local time |
| Architecture | RESOLVED | Layered with DI |
| Error Handling | RESOLVED | Layer-specific exceptions |
| ID Display | RESOLVED | First 8 characters |

**All items resolved. Ready for implementation planning.**

---

## References

- [Click Documentation](https://click.palletsprojects.com/)
- [Rich Documentation](https://rich.readthedocs.io/)
- [Python Dataclasses](https://docs.python.org/3/library/dataclasses.html)
- [UV Documentation](https://docs.astral.sh/uv/)
- [Project Constitution](../../.specify/memory/constitution.md)
