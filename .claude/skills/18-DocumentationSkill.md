# DocumentationSkill.md

## Skill Name
`project-documentation-generation`

## Purpose
Generate comprehensive project documentation including README, installation guide, usage examples, and troubleshooting information.

## Responsibilities
1. **Create README.md**
   - Write project title and description
   - List all features (add, list, update, delete, complete, incomplete)
   - Include badges (optional for Phase 1)
   - Add table of contents for navigation

2. **Document Prerequisites**
   - Python 3.13+ requirement
   - UV package manager requirement
   - Cross-platform support statement

3. **Write Installation Instructions**
   - Clone/download instructions
   - UV installation steps
   - Dependency installation with `uv sync`
   - Verification steps

4. **Create Usage Examples**
   - Example for each CLI command
   - Show expected output
   - Include common workflows
   - Document error cases

5. **Add Troubleshooting Section**
   - Common error messages and solutions
   - Platform-specific notes (Windows, macOS, Linux, WSL2)
   - How to report issues

## Rules
1. **MUST** only document implemented features
2. **MUST** test all command examples before documenting
3. **MUST** include expected output for examples
4. **MUST** follow Markdown best practices
5. **MUST NOT** include placeholder content
6. **MUST NOT** document future/planned features
7. **MUST** be accurate and verifiable

## Constraints
- Application must be validated and working first
- All examples must be tested
- Cross-platform coverage required
- No code in documentation (only examples)

## When to Use / Trigger Conditions
- **Primary Trigger**: After MainEntryPointSkill completes and app is validated
- **User Request**: "Create documentation", "Write README"
- **Prerequisite For**: Project release/sharing
- **Never Use When**: Application not yet functional

## Validation Checklist
Before marking complete, verify:
- [ ] README.md has project description
- [ ] All 6 CLI commands documented
- [ ] Installation instructions tested
- [ ] All usage examples work
- [ ] Expected outputs shown
- [ ] Troubleshooting section present
- [ ] WSL2 notes included
- [ ] No placeholder content
- [ ] Markdown renders correctly

## Output Artifacts
- `README.md` - Comprehensive project documentation

## Code Pattern
```markdown
# Smart Personal Chief of Staff

A simple and powerful command-line task manager for organizing your
personal and professional tasks.

## Features

- **Add tasks** with title and optional description
- **List all tasks** in a formatted table
- **Update tasks** to modify title or description
- **Delete tasks** when no longer needed
- **Mark complete** when tasks are done
- **Mark incomplete** to reopen tasks

## Prerequisites

- Python 3.13 or higher
- UV package manager

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chief-of-staff
   ```

2. Install dependencies:
   ```bash
   uv sync
   ```

3. Verify installation:
   ```bash
   python main.py --help
   ```

## Usage

### Add a task
```bash
python main.py add "Buy groceries"
python main.py add "Call mom" -d "Wish her happy birthday"
```

### List all tasks
```bash
python main.py list
```

### Update a task
```bash
python main.py update <task-id> -t "New title"
python main.py update <task-id> -d "New description"
```

### Delete a task
```bash
python main.py delete <task-id>
```

### Mark task complete
```bash
python main.py complete <task-id>
```

### Mark task incomplete
```bash
python main.py incomplete <task-id>
```

## Troubleshooting

### "UV not found"
Install UV: `curl -LsSf https://astral.sh/uv/install.sh | sh`

### "Python 3.13 required"
Ensure Python 3.13+ is installed and in your PATH.

### WSL2 Notes
- Use Linux paths within WSL2
- Ensure Python is installed in WSL2, not Windows

## License

MIT License
```
