# SkillStore - Intelligent Skill Search

Smart skill search with semantic matching and relevance threshold.

## Features

- **Semantic Matching** - Analyzes actual skill functionality
- **30% Threshold** - Only shows relevant matches
- **Visual Scoring** - Shows match percentage with bar
- **Multi-source** - Known, local, GitHub

## Quick Start

```bash
# Search (threshold applied automatically)
skillstore smart home
skillstore weather
skillstore email gmail

# Manage skills
skillstore list
skillstore known
skillstore create my-skill
```

## Matching System

```
Query: "smart home"

Results (filtered by 30% threshold):
✓ homeassistant     85% ████████░░ (strong)
✓ openclaw-homeassistant 62% ██████░░░░
✗ irrelevant-skill  15% (filtered out)
```

## Why Threshold?

Prevents showing irrelevant skills just because of partial keyword matches.

## Commands

| Command | Description |
|---------|-------------|
| `skillstore <query>` | Search with smart matching |
| `skillstore list` | List installed |
| `skillstore known` | Show 20 known skills |
| `skillstore create` | New skill template |

## What It Does

1. **Tokenize** - Break query into words
2. **Calculate** - Jaccard similarity + boosts
3. **Filter** - Remove below 30% threshold
4. **Rank** - Sort by score
5. **Show** - Display with visual bar

## Threshold Customization

Edit `main.js` to change:
```javascript
const MATCH_THRESHOLD = 0.3; // 30%
```
