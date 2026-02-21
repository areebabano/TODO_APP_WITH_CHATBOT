# MainEntryPointSkill.md

## Skill Name
`main-entry-point-creation`

## Purpose
Create the application entry point that initializes all layers, wires dependencies together, and executes the CLI.

## Responsibilities
1. **Create Main Module**
   - Create `main.py` with shebang `#!/usr/bin/env python3`
   - Add module docstring explaining entry point purpose
   - Import all required components

2. **Initialize Storage Layer**
   - Instantiate `MemoryStore()`
   - Store reference for service injection

3. **Initialize Service Layer**
   - Instantiate `TaskService(store)`
   - Pass storage dependency to service

4. **Wire CLI Layer**
   - Call `create_cli(task_service)` to get configured CLI
   - CLI now has access to service via factory

5. **Create Entry Point Guard**
   - Add `if __name__ == "__main__":` guard
   - Call `cli()` to execute
   - Handle top-level exceptions gracefully

## Rules
1. **MUST** use explicit instantiation - no global singletons
2. **MUST** follow correct order: storage → service → CLI
3. **MUST** include `if __name__ == "__main__":` guard
4. **MUST** add shebang for Unix executability
5. **MUST NOT** include any business logic
6. **MUST NOT** catch and hide all exceptions (only graceful exit)
7. **MUST** be readable as architecture overview

## Constraints
- All layers must be implemented first
- File location: `main.py` (project root or package)
- Single responsibility: wire and execute
- Cross-platform compatible

## When to Use / Trigger Conditions
- **Primary Trigger**: After all CLI commands implemented
- **User Request**: "Create main entry point", "Wire everything together"
- **Prerequisite For**: Running the complete application
- **Never Use When**: Main entry already exists and works

## Validation Checklist
Before marking complete, verify:
- [ ] File has shebang `#!/usr/bin/env python3`
- [ ] Module docstring present
- [ ] MemoryStore instantiated
- [ ] TaskService instantiated with storage
- [ ] create_cli called with service
- [ ] Entry point guard present
- [ ] `python main.py --help` works
- [ ] `python main.py add "Test"` works
- [ ] `python main.py list` works

## Output Artifacts
- `main.py` - Application entry point

## Code Pattern
```python
#!/usr/bin/env python3
"""Application entry point for Smart Personal Chief of Staff.

This module initializes all application layers and wires them together:
- Storage layer (MemoryStore)
- Service layer (TaskService)
- CLI layer (Click commands)

Run with: python main.py [command] [options]
"""
from storage import MemoryStore
from services import TaskService
from cli import create_cli


def main() -> None:
    """Initialize services and run CLI."""
    # Initialize storage layer
    store = MemoryStore()

    # Initialize service layer with storage dependency
    task_service = TaskService(store)

    # Create CLI with service dependency
    cli = create_cli(task_service)

    # Execute CLI
    cli()


if __name__ == "__main__":
    main()
```
