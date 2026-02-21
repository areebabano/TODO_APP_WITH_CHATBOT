# ProjectFoundationSkill.md

## Skill Name
`project-foundation-setup`

## Purpose
Initialize a complete Python 3.13+ project foundation using UV package manager, establishing the standardized folder structure, configuring dependencies, and setting up version control for the Smart Personal Chief of Staff CLI application.

## Responsibilities
1. **Verify Environment Prerequisites**
   - Check UV package manager is installed and accessible
   - Verify Python 3.13+ is available
   - Provide installation guidance if prerequisites are missing

2. **Initialize UV Project**
   - Run `uv init` targeting Python 3.13+
   - Create and configure virtual environment
   - Validate project structure is created correctly

3. **Create Folder Structure**
   - Create `models/` directory with `__init__.py`
   - Create `storage/` directory with `__init__.py`
   - Create `services/` directory with `__init__.py`
   - Create `cli/` directory with `__init__.py`
   - Create `tests/` directory with `__init__.py`
   - Create `specs/` directory for feature specifications
   - Create `history/prompts/` directory for PHR records

4. **Configure Dependencies**
   - Set up `pyproject.toml` with project metadata
   - Add `rich` as runtime dependency
   - Add `click` as runtime dependency
   - Configure CLI entry point: `chief-of-staff = "chief_of_staff.main:cli"`
   - Run `uv sync` to install dependencies

5. **Initialize Version Control**
   - Initialize git repository if not exists
   - Create comprehensive `.gitignore` file
   - Create initial commit with message "Initialize project foundation"

## Rules
1. **MUST** target Python 3.13+ - do not proceed with older versions
2. **MUST** use UV as the package manager - no pip/poetry alternatives
3. **ONLY** `rich` and `click` allowed as runtime dependencies
4. **MUST** create all `__init__.py` files with module docstrings
5. **MUST NOT** create any functional/business logic code
6. **MUST** use cross-platform compatible paths (pathlib)
7. **MUST** use UTF-8 encoding with LF line endings for all files
8. **MUST** validate each step before proceeding to the next

## Constraints
- Requires UV package manager installed on system
- Requires Python 3.13+ available in PATH
- Requires git installed (gracefully handle if missing)
- No network operations beyond package installation
- No dev dependencies in Phase 1
- All paths must work on Linux, macOS, and Windows/WSL2

## When to Use / Trigger Conditions
- **Primary Trigger**: At the very start of Phase 1, before any code implementation
- **User Request**: "Set up the project", "Initialize the project foundation", "Start Phase 1"
- **Prerequisite For**: All other skills - this must complete successfully first
- **Never Use When**: Project structure already exists and is valid

## Validation Checklist
Before marking complete, verify:
- [ ] UV project initialized with Python 3.13+ target
- [ ] All required directories exist
- [ ] All `__init__.py` files have module docstrings
- [ ] `pyproject.toml` is valid with correct dependencies
- [ ] `rich` and `click` install successfully
- [ ] `.gitignore` is comprehensive
- [ ] Git repository initialized with initial commit
- [ ] No placeholder or TODO comments in files

## Output Artifacts
- `pyproject.toml` - Project configuration
- `models/__init__.py` - Models package
- `storage/__init__.py` - Storage package
- `services/__init__.py` - Services package
- `cli/__init__.py` - CLI package
- `tests/__init__.py` - Tests package
- `.gitignore` - Git ignore patterns
