# CLIGroupSkill.md

## Skill Name
`cli-group-creation`

## Purpose
Set up the Click command group as the application's CLI entry point, including version option and factory function for dependency injection.

## Responsibilities
1. **Create CLI Command Group**
   - Import Click library
   - Define `@click.group()` decorated function
   - Name the function `cli`
   - Add group docstring for `--help` output

2. **Add Version Option**
   - Add `@click.version_option(version="0.1.0")`
   - Version displayed with `--version` flag

3. **Create CLI Factory Function**
   - Define `create_cli(service: TaskService) -> click.Group`
   - Store service reference for command access
   - Return configured CLI group
   - Enable dependency injection pattern

4. **Set Up Service Access Pattern**
   - Use Click context or closure for service access
   - Ensure all commands can access the same service instance

## Rules
1. **MUST** name the group function `cli`
2. **MUST** include version option with "0.1.0"
3. **MUST** create factory function for dependency injection
4. **MUST** have clear help text describing the application
5. **MUST NOT** instantiate TaskService in CLI module
6. **MUST NOT** include command implementations (separate skills)
7. **MUST** export factory function from cli package

## Constraints
- Depends on Click being installed
- File location: `cli/commands.py`
- Factory function enables testability
- Must be importable as `from cli import create_cli`

## When to Use / Trigger Conditions
- **Primary Trigger**: After DisplayFunctionsSkill completes
- **User Request**: "Create CLI group", "Set up Click commands"
- **Prerequisite For**: All individual command skills
- **Never Use When**: CLI group already exists

## Validation Checklist
Before marking complete, verify:
- [ ] Click imported correctly
- [ ] `cli` group function defined with decorator
- [ ] Version option shows "0.1.0"
- [ ] `--help` displays application description
- [ ] `create_cli()` factory function defined
- [ ] Factory accepts TaskService parameter
- [ ] Factory returns Click group
- [ ] Exportable from cli package

## Output Artifacts
- `cli/commands.py` - CLI group and factory function
- Updated `cli/__init__.py` - Export create_cli

## Code Pattern
```python
"""CLI commands for task management."""
from typing import Optional

import click

from services import TaskService

# Module-level service reference (set by factory)
_service: Optional[TaskService] = None


def get_service() -> TaskService:
    """Get the TaskService instance.

    Returns:
        The configured TaskService.

    Raises:
        RuntimeError: If service not initialized via create_cli.
    """
    if _service is None:
        raise RuntimeError("CLI not initialized. Use create_cli() first.")
    return _service


@click.group()
@click.version_option(version="0.1.0", prog_name="chief-of-staff")
def cli() -> None:
    """Smart Personal Chief of Staff - Task Management CLI.

    A simple and powerful command-line task manager for organizing
    your personal and professional tasks.
    """
    pass


def create_cli(service: TaskService) -> click.Group:
    """Create CLI with injected TaskService.

    Args:
        service: The TaskService instance to use for operations.

    Returns:
        Configured Click command group.
    """
    global _service
    _service = service
    return cli
```
