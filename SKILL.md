# Skill Templates

A collection of templates and guidelines for developing OpenClaw skills.

## Overview

This skill provides templates and best practices for creating new OpenClaw skills. It helps maintain consistency across all skills and ensures high-quality implementations.

## Usage

```bash
# Generate a new skill template
skill-template new my-awesome-skill

# Show structure template
skill-template structure

# Show config template
skill-template config
```

## What's Included

### Templates

- **Project Structure** - Standard layout for OpenClaw skills
- **SKILL.md** - Template for OpenClaw skill documentation
- **README.md** - Template for user-facing documentation
- **config.json** - Configuration template

### Guidelines Reference

See `guidelines.md` for the full list of principles and rules to follow.

## Quick Reference

### Core Principles

1. Program availability and robustness
2. Optimize user experience
3. Provide fallback for misconfiguration
4. One-input solutions (never make user type twice)
5. Write down "记住这个" in markdown

### Configuration Rules

- Never change openclaw.json without permission
- Show planned changes before applying
- NO emoji in output

### Project Structure

```
skill-name/
├── SKILL.md         # OpenClaw skill docs
├── README.md        # User docs
├── main             # Main executable
├── config.json      # Config template
└── .gitignore      # Ignore secrets
```
