# Tasks: Smart Personal Chief of Staff CLI

**Input**: Design documents from `/specs/001-task-cli-app/`
**Prerequisites**: plan.md, spec files (001-005), research.md, data-model.md
**Branch**: `001-task-cli-app`
**Created**: 2025-12-28

**Tests**: No automated tests requested for Phase I. Manual validation in final phase.

**Organization**: Tasks follow the layered architecture: Setup → Models → Storage → Services → CLI → Documentation

## Format: `[ID] [P?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies on incomplete tasks)
- Include exact file paths in descriptions
- Each task is atomic and independently executable by Claude Code

## Path Conventions

- **Project structure**: `src/chief_of_staff/` with subdirectories for layers
- **Entry point**: `src/chief_of_staff/main.py`

---

## Phase 1: Setup (Project Foundation)

**Purpose**: Initialize UV project and create directory structure
**Spec Reference**: SPEC-001
**Agent**: project-foundation

- [✔] T001 Initialize UV project by running `uv init` and configuring pyproject.toml with name="chief-of-staff", version="0.1.0", requires-python=">=3.13"

- [✔] T002 Add dependencies by running `uv add rich click` and verify with `uv sync`

- [✔] T003 [P] Create directory structure: src/chief_of_staff/ with subdirectories models/, services/, storage/, cli/

- [✔] T004 [P] Create __init__.py files in all Python packages: src/chief_of_staff/__init__.py, src/chief_of_staff/models/__init__.py, src/chief_of_staff/services/__init__.py, src/chief_of_staff/storage/__init__.py, src/chief_of_staff/cli/__init__.py

- [✔] T005 [P] Create .gitignore file with Python exclusions (__pycache__, *.pyc, .venv, .env, *.egg-info, dist/, build/, .pytest_cache/)

- [✔] T006 Configure entry point in pyproject.toml: [project.scripts] chief = "chief_of_staff.main:main"

**Checkpoint**: `uv sync` runs without errors, `uv run python -c "import rich; import click; print('OK')"` succeeds

---

## Phase 2: Data Model (Domain Layer)

**Purpose**: Implement Task dataclass with validation and methods
**Spec Reference**: SPEC-002
**Agent**: model-agent

- [✔] T007 Create Task dataclass in src/chief_of_staff/models/task.py with fields: id (UUID), title (str), description (Optional[str]), status (str), created_at (datetime), updated_at (datetime), completed_at (Optional[datetime])

- [✔] T008 Implement __post_init__ validation in src/chief_of_staff/models/task.py: strip whitespace, validate title (1-100 chars), validate description (0-500 chars), validate status ("incomplete"|"complete")

- [✔] T009 Implement mark_complete() and mark_incomplete() methods in src/chief_of_staff/models/task.py that update status, completed_at, and updated_at timestamps

- [✔] T010 Implement update(title, description) method in src/chief_of_staff/models/task.py that validates and updates provided fields, refreshing updated_at

- [✔] T011 Implement to_dict() and from_dict() serialization methods in src/chief_of_staff/models/task.py for JSON-compatible dict conversion

- [✔] T012 Export Task class from src/chief_of_staff/models/__init__.py

**Checkpoint**: Task class instantiates, validates, serializes round-trip correctly

---

## Phase 3: Storage Layer

**Purpose**: Implement in-memory storage with CRUD operations
**Spec Reference**: SPEC-003
**Agent**: storage-agent

- [✔] T013 Create TaskNotFoundException in src/chief_of_staff/storage/exceptions.py with task_id attribute and clear error message

- [✔] T014 Create MemoryStore class in src/chief_of_staff/storage/memory_store.py with __init__ initializing empty _tasks dict

- [✔] T015 Implement add(task) and get(task_id) methods in src/chief_of_staff/storage/memory_store.py (get raises TaskNotFoundException if not found)

- [✔] T016 Implement get_all() and exists(task_id) methods in src/chief_of_staff/storage/memory_store.py (get_all returns list in insertion order)

- [✔] T017 Implement update(task_id, **updates) and delete(task_id) methods in src/chief_of_staff/storage/memory_store.py (both raise TaskNotFoundException if not found)

- [✔] T018 Export MemoryStore and TaskNotFoundException from src/chief_of_staff/storage/__init__.py

**Checkpoint**: CRUD operations work, TaskNotFoundException raised appropriately

---

## Phase 4: Service Layer (Business Logic)

**Purpose**: Implement TaskService with validation and exception translation
**Spec Reference**: SPEC-004
**Agent**: service-agent

- [✔] T019 Create ValidationError and TaskNotFoundError in src/chief_of_staff/services/exceptions.py

- [✔] T020 Create TaskService class in src/chief_of_staff/services/task_service.py with __init__(storage) for dependency injection

- [✔] T021 Implement create_task(title, description) method in src/chief_of_staff/services/task_service.py with input validation

- [✔] T022 Implement list_tasks() method in src/chief_of_staff/services/task_service.py returning tasks sorted by created_at

- [✔] T023 Implement get_task(task_id), update_task(task_id, title, description), delete_task(task_id) methods in src/chief_of_staff/services/task_service.py with exception translation

- [✔] T024 Implement complete_task(task_id) and uncomplete_task(task_id) methods in src/chief_of_staff/services/task_service.py

- [✔] T025 Export TaskService, ValidationError, TaskNotFoundError from src/chief_of_staff/services/__init__.py

**Checkpoint**: Service operations work with validation, exceptions translated correctly

---

## Phase 5: CLI Interface (Presentation Layer)

**Purpose**: Implement Click commands and Rich display
**Spec Reference**: SPEC-005
**Agent**: cli-display-renderer + cli-command-agent

- [✔] T026 Create display functions in src/chief_of_staff/cli/display.py: display_tasks(tasks) with Rich Table, display_success(message), display_error(message)

- [✔] T027 Configure Rich Table in src/chief_of_staff/cli/display.py with columns: Status ([x]/[ ]), ID (8 chars), Title, Created; use green for complete, yellow for incomplete

- [✔] T028 Create Click CLI group in src/chief_of_staff/cli/commands.py with create_cli(task_service) factory function

- [✔] T029 Implement 'add' command in src/chief_of_staff/cli/commands.py: title argument, -d/--description option, calls create_task

- [✔] T030 Implement 'list' command in src/chief_of_staff/cli/commands.py: calls list_tasks, displays with display_tasks or empty message

- [✔] T031 Implement 'update' command in src/chief_of_staff/cli/commands.py: task_id argument, -t/--title and -d/--description options

- [✔] T032 Implement 'delete', 'complete', 'incomplete' commands in src/chief_of_staff/cli/commands.py: each takes task_id argument

- [✔] T033 Add error handling to all CLI commands in src/chief_of_staff/cli/commands.py: catch ValidationError and TaskNotFoundError, display_error, exit 1

- [✔] T034 Export display functions and create_cli from src/chief_of_staff/cli/__init__.py

**Checkpoint**: All 6 CLI commands respond correctly with Rich formatting

---

## Phase 6: Main Entry Point

**Purpose**: Wire dependencies and create application entry point
**Spec Reference**: SPEC-005
**Agent**: main-entry-orchestrator

- [✔] T035 Create main() function in src/chief_of_staff/main.py that wires MemoryStore → TaskService → create_cli → cli()

- [✔] T036 Add if __name__ == "__main__": main() block to src/chief_of_staff/main.py

**Checkpoint**: `uv run chief --help` displays help, all commands work

---

## Phase 7: Documentation

**Purpose**: Create user and developer documentation
**Spec Reference**: ALL
**Agent**: documentation-generator

- [✔] T037 [P] Create README.md with project overview, features, installation (UV), quick start, command reference with examples

- [✔] T038 [P] Add WSL2 setup section to README.md with Windows-specific instructions

- [✔] T039 [P] Create CLAUDE.md with architecture overview, file locations, patterns, and AI assistant instructions

**Checkpoint**: README contains complete installation and usage instructions

---

## Phase 8: Validation

**Purpose**: Manual testing and verification
**Spec Reference**: ALL
**Agent**: Manual (user)

- [✔] T040 Test all commands: add (with/without description), list (empty/with tasks), update, delete, complete, incomplete

- [✔] T041 Test error conditions: empty title, invalid task ID for update/delete/complete

- [✔] T042 Verify Rich formatting: table renders correctly, colors display (green complete, yellow incomplete), IDs truncated

**Checkpoint**: All acceptance criteria pass, application fully functional

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1: Setup
    │
    ▼
Phase 2: Data Model (depends on 1)
    │
    ▼
Phase 3: Storage Layer (depends on 2)
    │
    ▼
Phase 4: Service Layer (depends on 3)
    │
    ▼
Phase 5: CLI Interface (depends on 4)
    │
    ▼
Phase 6: Main Entry (depends on 5)
    │
    ▼
Phase 7: Documentation (depends on 6)
    │
    ▼
Phase 8: Validation (depends on 7)
```

### Task Dependencies Within Phases

**Phase 1 (Setup)**:
- T001 → T002 (dependencies need project)
- T003, T004, T005 can run in parallel after T001
- T006 after T001

**Phase 2 (Model)**:
- T007 → T008 → T009 → T010 → T011 → T012 (sequential, same file)

**Phase 3 (Storage)**:
- T013 first (exception)
- T014 → T015 → T016 → T017 (sequential, same file)
- T018 last (exports)

**Phase 4 (Service)**:
- T019 first (exceptions)
- T020 → T021 → T022 → T023 → T024 (sequential, same file)
- T025 last (exports)

**Phase 5 (CLI)**:
- T026, T027 parallel (display.py)
- T028 → T029 → T030 → T031 → T032 → T033 (sequential, commands.py)
- T034 last (exports)

**Phase 6 (Main)**:
- T035 → T036 (sequential, same file)

**Phase 7 (Docs)**:
- T037, T038, T039 all parallel (different files)

**Phase 8 (Validation)**:
- T040 → T041 → T042 (sequential testing)

### Parallel Opportunities

Within each phase, tasks marked [P] can run in parallel:

```bash
# Phase 1 parallel tasks (after T001, T002):
Task T003: "Create directory structure"
Task T004: "Create __init__.py files"
Task T005: "Create .gitignore"

# Phase 7 parallel tasks:
Task T037: "Create README.md"
Task T038: "Add WSL2 section"
Task T039: "Create CLAUDE.md"
```

---

## Implementation Strategy

### Sequential Execution (Recommended)

Execute tasks in order T001 through T042, completing each phase before moving to the next. This ensures dependencies are satisfied and each layer is verified before building on it.

### Agent Assignments

| Tasks | Agent | Description |
|-------|-------|-------------|
| T001-T006 | project-foundation | UV setup, directories |
| T007-T012 | model-agent | Task dataclass |
| T013-T018 | storage-agent | MemoryStore |
| T019-T025 | service-agent | TaskService |
| T026-T027 | cli-display-renderer | Rich display |
| T028-T034 | cli-command-agent | Click commands |
| T035-T036 | main-entry-orchestrator | Entry point |
| T037-T039 | documentation-generator | Docs |
| T040-T042 | Manual | Validation |

### MVP Milestone

After completing T036 (Phase 6), the application is fully functional:
- All CLI commands work
- Tasks can be created, listed, updated, deleted, completed
- Rich formatting displays correctly

Documentation (Phase 7) and formal validation (Phase 8) can be done after MVP demo.

---

## Summary

| Metric | Count |
|--------|-------|
| Total Tasks | 42 |
| Phase 1 (Setup) | 6 tasks |
| Phase 2 (Model) | 6 tasks |
| Phase 3 (Storage) | 6 tasks |
| Phase 4 (Service) | 7 tasks |
| Phase 5 (CLI) | 9 tasks |
| Phase 6 (Main) | 2 tasks |
| Phase 7 (Docs) | 3 tasks |
| Phase 8 (Validation) | 3 tasks |
| Parallel Opportunities | 6 tasks |

---

## Notes

- Each task is atomic and can be executed independently by an LLM agent
- Tasks include exact file paths for clarity
- Phases follow strict layered architecture (models → storage → services → cli)
- No automated tests in Phase I per constitution (manual validation only)
- Commit after each phase for clear history
- Stop at any checkpoint to verify before proceeding
