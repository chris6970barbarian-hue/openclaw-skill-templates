# SkillStore - OpenClaw Skill Manager

Search, install, and create OpenClaw skills with one command.

## Features

- Smart GitHub search before creating new skills
- One-command install from GitHub
- Local skill search
- Template-based skill creation
- Known skills catalog

## Quick Start

```bash
# Search and install
skillstore home assistant
skillstore weather

# List skills
skillstore list
skillstore known

# Create new
skillstore create my-skill
```

## Workflow

### 1. Search
```bash
skillstore home assistant
```

Automatically:
- Searches GitHub for "openclaw home assistant"
- Searches local workspace

### 2. Choose Action
```
Results:
1. [GIT] openclaw-homeassistant - Control smart home devices
2. [LOCAL] homeassistant - Your local version

Options:
  [1] Install from GitHub
  [n] Create new skill
  [q] Quit
```

### 3. Install or Create

- **Install**: Downloads from GitHub to your skills folder
- **Create**: Generates templates in new folder

## Commands

| Command | Description |
|---------|-------------|
| `skillstore <query>` | Search for skills |
| `skillstore list` | List installed |
| `skillstore known` | Show known skills |
| `skillstore create <name>` | New skill |

## What It Does

**Before Creating**: Searches GitHub for existing solutions

**If Found**: Offers to install existing

**If Not Found**: Offers to create new

This prevents duplicate work and helps discover existing skills.

## Known Skills

Built-in list of popular OpenClaw skills:
- homeassistant - Smart home control
- gog - Google Workspace
- weather - Weather forecasts
- github - GitHub CLI
- And more...

Run `skillstore known` to see full list.

## Files

```
skillstore/
├── SKILL.md       # OpenClaw docs
├── README.md      # This file
├── main.js        # CLI
└── config.json   # Install history
```

## License

MIT
