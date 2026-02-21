# Implementation Plan: Task CLI Application

**Feature Branch**: `001-task-cli-app`
**Created**: 2025-12-28
**Status**: Ready for Implementation
**Specifications**: SPEC-001 through SPEC-005

---

## Executive Summary

This plan outlines the implementation of the Smart Personal Chief of Staff CLI application - a Python-based task management tool with in-memory storage. The implementation follows a strict layered architecture (models → storage → services → cli → main) as mandated by the project constitution.

---

## Constitution Check

### Compliance Verification

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Layered Architecture | COMPLIANT | Strict layer separation maintained |
| II. Domain-Driven Design | COMPLIANT | Task model is pure, validated |
| III. CLI-First Interface | COMPLIANT | All features via Click commands |
| IV. Explicit Dependency Injection | COMPLIANT | Constructor injection throughout |
| V. Type Safety and Documentation | COMPLIANT | Type hints on all functions |
| VI. Error Handling Strategy | COMPLIANT | Layer-appropriate exceptions |
| VII. Cross-Platform Compatibility | COMPLIANT | No platform-specific code |
| VIII. Simplicity and YAGNI | COMPLIANT | Only required features |

### Technology Stack Verification

| Component | Required | Planned | Status |
|-----------|----------|---------|--------|
| Python | 3.13+ | 3.13+ | COMPLIANT |
| Package Manager | UV | UV | COMPLIANT |
| CLI Framework | Click | Click >= 8.1.7 | COMPLIANT |
| Terminal UI | Rich | Rich >= 13.7.0 | COMPLIANT |
| Storage | In-Memory | dict | COMPLIANT |

### Prohibited Items

- [x] No database libraries
- [x] No web frameworks
- [x] No async libraries
- [x] No external API clients
- [x] No dependencies beyond click/rich

---

## Technical Context

### Project Structure

```
project_root/
├── src/
│   └── chief_of_staff/
│       ├── __init__.py
│       ├── main.py                 # Entry point
│       ├── models/
│       │   ├── __init__.py
│       │   └── task.py             # Task dataclass
│       ├── storage/
│       │   ├── __init__.py
│       │   ├── exceptions.py       # TaskNotFoundException
│       │   └── memory_store.py     # MemoryStore class
│       ├── services/
│       │   ├── __init__.py
│       │   ├── exceptions.py       # ValidationError, TaskNotFoundError
│       │   └── task_service.py     # TaskService class
│       └── cli/
│           ├── __init__.py
│           ├── commands.py         # Click commands
│           └── display.py          # Rich display functions
├── tests/
│   └── __init__.py
├── pyproject.toml
├── .gitignore
└── README.md
```

### Dependencies

```toml
[project]
name = "chief-of-staff"
version = "0.1.0"
requires-python = ">=3.13"
dependencies = [
    "rich>=13.7.0",
    "click>=8.1.7",
]
```

---

## Implementation Phases

### PHASE 1: PROJECT SETUP (SPEC-001)

**Goal**: Complete project skeleton with UV configuration

**Agent**: ProjectFoundationAgent

**Tasks**:

1. **Initialize UV Project**
   - Run `uv init chief-of-staff`
   - Configure pyproject.toml with project metadata
   - Set requires-python = ">=3.13"

2. **Configure Dependencies**
   - Add rich>=13.7.0 to dependencies
   - Add click>=8.1.7 to dependencies
   - Run `uv sync` to create lock file

3. **Create Directory Structure**
   - Create src/chief_of_staff/ package
   - Create models/, storage/, services/, cli/ subdirectories
   - Add __init__.py to each directory
   - Create tests/ directory

4. **Setup Version Control**
   - Create .gitignore for Python projects
   - Ensure git is initialized
   - Stage and commit project skeleton

5. **Configure Entry Point**
   - Add [project.scripts] section to pyproject.toml
   - Define chief = "chief_of_staff.main:main"

**Output**: Working UV project that runs `uv sync` without errors

**Verification**:
```bash
uv sync
uv run python -c "import rich; import click; print('OK')"
```

---

### PHASE 2: DATA MODEL (SPEC-002)

**Goal**: Fully functional Task dataclass

**Agent**: ModelAgent

**Tasks**:

1. **Create Task Dataclass**
   - File: src/chief_of_staff/models/task.py
   - Define fields: id, title, description, status, created_at, updated_at, completed_at
   - Set proper defaults using field(default_factory=...)

2. **Implement Validation**
   - Add __post_init__ method
   - Strip whitespace from title and description
   - Validate title length (1-100 chars)
   - Validate description length (0-500 chars)
   - Validate status values ("incomplete", "complete")
   - Raise ValueError with clear messages

3. **Implement Status Methods**
   - mark_complete(): Set status, completed_at, updated_at
   - mark_incomplete(): Set status, clear completed_at, update updated_at

4. **Implement Update Method**
   - update(title, description): Update provided fields
   - Validate new values before applying
   - Update updated_at only if changes made

5. **Implement Serialization**
   - to_dict(): Return dict with JSON-serializable values
   - from_dict(): Class method to create Task from dict

6. **Export from Package**
   - Update models/__init__.py to export Task

**Output**: Task class that passes all validation and serialization tests

**Verification**:
```python
from chief_of_staff.models import Task
task = Task(title="Test")
assert task.status == "incomplete"
task.mark_complete()
assert task.status == "complete"
d = task.to_dict()
task2 = Task.from_dict(d)
assert task.id == task2.id
```

---

### PHASE 3: STORAGE LAYER (SPEC-003)

**Goal**: Complete in-memory storage with CRUD operations

**Agent**: StorageAgent

**Tasks**:

1. **Create Custom Exception**
   - File: src/chief_of_staff/storage/exceptions.py
   - Define TaskNotFoundException with task_id attribute
   - Clear error message format

2. **Create MemoryStore Class**
   - File: src/chief_of_staff/storage/memory_store.py
   - Initialize with empty dict: _tasks = {}
   - Import Task model

3. **Implement CRUD Operations**
   - add(task): Store task, return task
   - get(task_id): Return task or raise TaskNotFoundException
   - get_all(): Return list of all tasks (insertion order)
   - update(task_id, **updates): Update task, return modified task
   - delete(task_id): Remove task or raise TaskNotFoundException
   - exists(task_id): Return bool without raising exception

4. **Handle ID Types**
   - Accept both str and UUID for task_id
   - Convert to string internally for dict keys

5. **Export from Package**
   - Update storage/__init__.py to export MemoryStore, TaskNotFoundException

**Output**: Storage layer with all CRUD operations working

**Verification**:
```python
from chief_of_staff.storage import MemoryStore, TaskNotFoundException
from chief_of_staff.models import Task

store = MemoryStore()
task = Task(title="Test")
store.add(task)
assert store.exists(task.id)
retrieved = store.get(task.id)
assert retrieved.title == "Test"
store.delete(task.id)
assert not store.exists(task.id)
```

---

### PHASE 4: BUSINESS LOGIC (SPEC-004)

**Goal**: TaskService with validation and business rules

**Agent**: ServiceAgent

**Tasks**:

1. **Create Service Exceptions**
   - File: src/chief_of_staff/services/exceptions.py
   - Define ValidationError for input validation failures
   - Define TaskNotFoundError that wraps storage exception

2. **Create TaskService Class**
   - File: src/chief_of_staff/services/task_service.py
   - Constructor receives storage as dependency
   - Store as self._storage

3. **Implement Service Methods**
   - create_task(title, description): Validate, create, store, return
   - list_tasks(): Get all, sort by created_at, return
   - get_task(task_id): Get from storage, translate exceptions
   - update_task(task_id, title, description): Validate, update, return
   - delete_task(task_id): Delete from storage, translate exceptions
   - complete_task(task_id): Get task, mark complete, return
   - uncomplete_task(task_id): Get task, mark incomplete, return

4. **Implement Validation**
   - Validate title before create/update
   - Validate description before create/update
   - Raise ValidationError with clear messages

5. **Exception Translation**
   - Catch TaskNotFoundException from storage
   - Raise TaskNotFoundError (service layer exception)

6. **Export from Package**
   - Update services/__init__.py to export TaskService, ValidationError, TaskNotFoundError

**Output**: Service layer with all business operations working

**Verification**:
```python
from chief_of_staff.storage import MemoryStore
from chief_of_staff.services import TaskService, ValidationError

storage = MemoryStore()
service = TaskService(storage)
task = service.create_task("Test task", "Description")
assert task.title == "Test task"
tasks = service.list_tasks()
assert len(tasks) == 1
```

---

### PHASE 5: CLI INTERFACE (SPEC-005)

**Goal**: Complete CLI with all commands and Rich formatting

**Agent**: CLICommandAgent + DisplayAgent

**Tasks**:

1. **Create Display Functions**
   - File: src/chief_of_staff/cli/display.py
   - Create Console instance
   - display_tasks(tasks): Rich table with status, ID, title, date
   - display_success(message): Green message
   - display_error(message): Red message
   - display_task_created(task): Success message with task ID
   - display_no_tasks(): Friendly empty state message

2. **Create CLI Commands**
   - File: src/chief_of_staff/cli/commands.py
   - Use factory function: create_cli(task_service) -> click.Group
   - Implement add command: title arg, -d/--description option
   - Implement list command: display all tasks
   - Implement update command: task_id arg, -t/--title, -d/--description
   - Implement delete command: task_id arg
   - Implement complete command: task_id arg
   - Implement incomplete command: task_id arg

3. **Handle Errors in CLI**
   - Catch ValidationError, display error, exit 1
   - Catch TaskNotFoundError, display error, exit 1
   - Display success messages on success, exit 0

4. **Add Help Text**
   - Docstrings for all commands
   - Help text for all options

5. **Create Main Entry Point**
   - File: src/chief_of_staff/main.py
   - Wire dependencies: MemoryStore -> TaskService -> CLI
   - Define main() function
   - Add if __name__ == "__main__" block

6. **Export from Packages**
   - Update cli/__init__.py appropriately

**Output**: Complete CLI that responds to all commands

**Verification**:
```bash
uv run chief --help
uv run chief add "Test task"
uv run chief list
uv run chief complete <task-id>
uv run chief list
```

---

### PHASE 6: DOCUMENTATION

**Goal**: Complete project documentation

**Agent**: DocumentationAgent

**Tasks**:

1. **Create README.md**
   - Project description
   - Features list
   - Installation instructions (UV-based)
   - Quick start guide
   - Command reference with examples
   - Troubleshooting section

2. **Create CLAUDE.md**
   - Project-specific instructions for AI assistants
   - Architecture overview
   - Key patterns and conventions
   - File locations reference

3. **Add WSL2 Notes**
   - WSL2 setup instructions
   - Common issues and solutions
   - Path handling notes

**Output**: Complete documentation for users and developers

**Verification**: README.md contains installation and usage instructions

---

### PHASE 7: TESTING & VALIDATION

**Goal**: Validate all acceptance criteria

**Agent**: Manual validation (user)

**Tasks**:

1. **Test All Commands**
   - Add task with title only
   - Add task with title and description
   - List tasks (empty state)
   - List tasks (with tasks)
   - Update task title
   - Update task description
   - Delete task
   - Complete task
   - Incomplete task

2. **Test Error Conditions**
   - Add with empty title
   - Update with invalid ID
   - Delete with invalid ID
   - Complete with invalid ID

3. **Test Display Formatting**
   - Verify table rendering
   - Verify color coding (yellow incomplete, green complete)
   - Verify truncated IDs display correctly

4. **Cross-Platform Check**
   - Test on Windows/WSL2
   - Verify colors render correctly
   - Verify Unicode handling

5. **Create Demo Scenario**
   - Document a walkthrough of common usage
   - Include screenshots or terminal output

**Output**: Validated working application

**Verification**: All acceptance criteria from specs pass

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| UV not installed | High | Document installation in README |
| Python < 3.13 | High | UV will report version mismatch |
| Rich rendering issues | Medium | Rich handles fallback gracefully |
| ID collision | Low | UUID4 provides sufficient uniqueness |
| Memory usage | Low | In-memory storage acceptable for Phase I |

---

## Dependency Graph

```
PHASE 1: Project Setup
    │
    ▼
PHASE 2: Data Model (depends on 1)
    │
    ▼
PHASE 3: Storage Layer (depends on 2)
    │
    ▼
PHASE 4: Business Logic (depends on 3)
    │
    ▼
PHASE 5: CLI Interface (depends on 4)
    │
    ▼
PHASE 6: Documentation (depends on 5)
    │
    ▼
PHASE 7: Testing & Validation (depends on 6)
```

---

## Agents Mapping

| Phase | Primary Agent | Description |
|-------|---------------|-------------|
| 1 | project-foundation | Project scaffold and UV setup |
| 2 | model-agent | Task dataclass implementation |
| 3 | storage-agent | MemoryStore implementation |
| 4 | service-agent | TaskService implementation |
| 5 | cli-command-agent + cli-display-renderer | Commands and display |
| 5 | main-entry-orchestrator | Main.py entry point |
| 6 | documentation-generator | README and docs |
| 7 | Manual | User validation |

---

## Success Criteria Summary

From all specifications, the following must be true at completion:

1. `uv sync` creates working environment
2. `uv run chief add "Task"` creates a task
3. `uv run chief list` shows tasks in formatted table
4. `uv run chief update <id> --title "New"` updates task
5. `uv run chief delete <id>` removes task
6. `uv run chief complete <id>` marks task complete (green checkmark)
7. `uv run chief incomplete <id>` marks task incomplete (yellow box)
8. Error messages are user-friendly (no stack traces)
9. Help text is complete for all commands
10. Exit codes are correct (0 success, non-zero error)

---

## Next Steps

1. Run `/sp.tasks` to generate detailed implementation tasks
2. Execute tasks in dependency order using appropriate agents
3. Validate each phase before proceeding to next
4. Document any deviations or decisions in ADRs

---

**Plan Status**: APPROVED - Ready for `/sp.tasks`
