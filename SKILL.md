# SkillStore - OpenClaw Skill Manager

Search, install, and create OpenClaw skills. Automatically searches GitHub for existing skills before creating new ones.

## Features

- **Smart Search** - Searches GitHub for existing skills first
- **Local Search** - Finds skills in your workspace
- **One-command Install** - Install from GitHub with one command
- **Template Generator** - Create new skills with templates
- **Known Skills** - Lists all known OpenClaw skills

## Quick Start

```bash
# Search for a skill
skillstore home assistant
skillstore weather
skillstore github

# List installed skills
skillstore list

# Show known skills
skillstore known

# Create new skill
skillstore create my-awesome-skill
```

## How It Works

1. **Search Phase**: When you search for a skill, it automatically:
   - Searches GitHub for matching repositories
   - Searches your local skills

2. **Results Phase**: Shows all matches:
   - Local skills (green)
   - GitHub repositories (cyan)

3. **Action Phase**: Choose to:
   - Install from GitHub (enter number)
   - Create new skill (type 'n')
   - Quit (type 'q')

## Usage Examples

```bash
# Find weather skills
skillstore weather

# Find GitHub integration
skillstore github

# Find smart home skills
skillstore "home assistant"
skillstore hue
skillstore smart

# Create new
skillstore create my-skill
```

## Commands

| Command | Description |
|---------|-------------|
| `skillstore Search for skills |
| `skillstore <query>` | list` | List installed skills |
| `skillstore known Open` | Show knownClaw skills |
| `skillstore create <name>` | Create new skill |

## Search Flow

```
1. User: "skillstore weather"
2. System searches GitHub for "openclaw weather"
3. System searches local skills
4. Shows results (local + GitHub)
5. User chooses: install / create new / quit
```

## Configuration

Config saved to `config.json` in skill folder.

## Files

```
skillstore/
├── SKILL.md       # OpenClaw skill docs
├── README.md      # This file
├── main.js        # Main CLI
└── config.json   # Saved installations
```
