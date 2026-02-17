# Skill Templates for OpenClaw

A template generator and guidelines reference for developing OpenClaw skills.

## Quick Start

```bash
# Show all guidelines
skill-template guidelines

# Show project structure
skill-template structure

# Create new skill
skill-template new my-awesome-skill
```

## Features

- Project structure templates
- Config template
- SKILL.md / README.md templates
- .gitignore template
- Development guidelines reference

## Commands

| Command | Description |
|---------|-------------|
| `skill-template structure` | Show standard project structure |
| `skill-template config` | Show config.json template |
| `skill-template gitignore` | Show .gitignore template |
| `skill-template guidelines` | Show development guidelines |
| `skill-template new <name>` | Create new skill with all templates |

## Development Guidelines

See [guidelines.md](./guidelines.md) for the full list.

### Core Principles

1. **保证程序的可用性和鲁棒性** - Ensure program works reliably
2. **尽量优化交互体验** - Optimize user experience
3. **在用户设置错误时有可靠简单的回退选项** - Provide fallback for misconfiguration
4. **能让用户通过一次输入就解决的事情不要拖两次** - One-input solutions
5. **记住这个 -> 写在 markdown 文件里**

### Configuration Rules

- Never change openclaw.json without permission
- Show planned changes before applying
- NO emoji in output

### Standard Structure

```
skill-name/
├── SKILL.md         # OpenClaw skill docs
├── README.md        # User docs
├── main             # Main executable
├── config.json      # Config template
└── .gitignore       # Ignore secrets
```

## License

MIT
