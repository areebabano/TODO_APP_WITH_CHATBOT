# DisplayConsoleSkill.md

## Skill Name
`display-console-initialization`

## Purpose
Initialize the Rich console for cross-platform terminal output, establishing the display module foundation for the CLI layer.

## Responsibilities
1. **Import Rich Console**
   - Import `Console` from `rich.console`
   - Import `Table` from `rich.table` for task display
   - Import `Text` from `rich.text` for styled text

2. **Create Module-Level Console Instance**
   - Instantiate `console = Console()` at module level
   - Configure for cross-platform compatibility
   - No force_terminal setting (let Rich auto-detect)

3. **Add Module Documentation**
   - Add module docstring explaining display layer purpose
   - Document that this module handles all CLI output formatting

## Rules
1. **MUST** create single Console instance per module
2. **MUST** let Rich auto-detect terminal capabilities
3. **MUST** handle Windows terminal gracefully (Rich handles this)
4. **MUST** add module docstring
5. **MUST NOT** include any business logic
6. **MUST NOT** import from models, storage, or services layers yet
7. **MUST NOT** define display functions yet (separate skill)

## Constraints
- Depends on `rich` package being installed
- File location: `cli/display.py`
- Module-level console instance for reuse
- Must work on Linux, macOS, Windows, WSL2

## When to Use / Trigger Conditions
- **Primary Trigger**: After TaskServiceStatusSkill completes, starting CLI layer
- **User Request**: "Set up display module", "Initialize Rich console"
- **Prerequisite For**: DisplayFunctionsSkill
- **Never Use When**: Display module already initialized

## Validation Checklist
Before marking complete, verify:
- [ ] Console imported from rich.console
- [ ] Table imported from rich.table
- [ ] Module-level console instance created
- [ ] Module docstring present
- [ ] No errors on import
- [ ] Console can print basic output

## Output Artifacts
- `cli/display.py` - Display module with console initialization

## Code Pattern
```python
"""Display layer for CLI output formatting.

This module provides Rich-based terminal formatting for task display,
success messages, and error messages. All CLI output should go through
this module to ensure consistent formatting.
"""
from rich.console import Console
from rich.table import Table
from rich.text import Text

# Module-level console instance for consistent output
console = Console()
```
