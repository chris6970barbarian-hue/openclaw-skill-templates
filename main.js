#!/usr/bin/env node

/**
 * Skill Template Generator
 * Generate templates for OpenClaw skills
 */

const fs = require('fs');
const path = require('path');

const C = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const log = (msg, color = 'reset') => console.log(`${C[color]}${msg}${C.reset}`);

const templates = {
  structure: `skill-name/
├── SKILL.md         # OpenClaw skill documentation
├── README.md        # User-facing documentation
├── main             # Main executable (Node.js/Python/Bash)
├── config.json      # Configuration template
└── .gitignore      # Ignore config.json, tokens, secrets`,

  config: `{
  "name": "my-skill",
  "version": "1.0.0",
  "description": "A skill for...",
  "author": "",
  "dependencies": {}
}`,

  gitignore: `# Ignore sensitive files
config.json
*.token
*.key
*.pem
.env
node_modules/
`,

  skillMd: `# Skill Name

Brief description of what this skill does.

## Setup

\`\`\`bash
# Installation steps
\`\`\`

## Usage

\`\`\`bash
skill-cli command
\`\`\`

## Configuration

Required environment variables or config options.

## Supported Commands

- \`command1\` - Description
- \`command2\` - Description`,

  readme: `# Skill Name

Brief description.

## Features

- Feature 1
- Feature 2

## Quick Start

\`\`\`bash
# Setup
skill-cli setup

# Usage
skill-cli command arg
\`\`\`

## Documentation

See [SKILL.md](./SKILL.md) for full documentation.

## License

MIT`
};

function showStructure() {
  log('\nStandard OpenClaw Skill Structure:', 'cyan');
  console.log('\n' + templates.structure + '\n');
}

function showConfig() {
  log('\nConfig Template:', 'cyan');
  console.log('\n' + templates.config + '\n');
}

function showGitignore() {
  log('\n.gitignore Template:', 'cyan');
  console.log('\n' + templates.gitignore + '\n');
}

function showSkillMd(name = 'my-skill') {
  log('\nSKILL.md Template:', 'cyan');
  console.log('\n' + templates.skillMd.replace(/Skill Name/g, name.charAt(0).toUpperCase() + name.slice(1)).replace(/skill-cli/g, name) + '\n');
}

function showReadme(name = 'my-skill') {
  log('\nREADME.md Template:', 'cyan');
  console.log('\n' + templates.readme.replace(/Skill Name/g, name.charAt(0).toUpperCase() + name.slice(1)).replace(/skill-cli/g, name) + '\n');
}

function showGuidelines() {
  log('\n' + C.bright + 'Skill Development Guidelines' + C.reset, 'cyan');
  log('=' .repeat(50), 'gray');
  
  log('\n' + C.bright + 'Core Principles:' + C.reset, 'yellow');
  log('1. 保证程序的可用性和鲁棒性', 'gray');
  log('2. 尽量优化交互体验', 'gray');
  log('3. 在用户设置错误时有可靠简单的回退选项', 'gray');
  log('4. 能让用户通过一次输入就解决的事情不要拖两次', 'gray');
  log('5. 记住这个 -> 写在 markdown 文件里', 'gray');

  log('\n' + C.bright + 'Configuration Rules:' + C.reset, 'yellow');
  log('- Never change openclaw.json without permission', 'gray');
  log('- Show planned changes before applying', 'gray');
  log('- NO emoji in output', 'gray');

  log('\n' + C.bright + 'Best Practices:' + C.reset, 'yellow');
  log('- One-command setup', 'gray');
  log('- Auto-save config to config.json', 'gray');
  log('- Smart error messages with suggestions', 'gray');
  log('- Fuzzy matching for names', 'gray');
  log('- Natural language command support', 'gray');

  log('\n' + C.bright + 'Project Structure:' + C.reset, 'yellow');
  console.log(templates.structure);
}

function createSkill(name) {
  const dir = path.join(process.cwd(), name);
  
  if (fs.existsSync(dir)) {
    log(`Error: Directory "${name}" already exists`, 'red');
    process.exit(1);
  }

  fs.mkdirSync(dir, { recursive: true });
  
  // Create files
  fs.writeFileSync(path.join(dir, 'SKILL.md'), templates.skillMd.replace(/Skill Name/g, name.charAt(0).toUpperCase() + name.slice(1)).replace(/skill-cli/g, name));
  fs.writeFileSync(path.join(dir, 'README.md'), templates.readme.replace(/Skill Name/g, name.charAt(0).toUpperCase() + name.slice(1)).replace(/skill-cli/g, name));
  fs.writeFileSync(path.join(dir, 'config.json'), templates.config.replace(/my-skill/g, name));
  fs.writeFileSync(path.join(dir, '.gitignore'), templates.gitignore);
  fs.writeFileSync(path.join(dir, 'main.js'), '#!/usr/bin/env node\n\n// Main skill implementation\nconsole.log("Hello from ' + name + '!");\n');
  
  log(`\nCreated skill "${name}" at:`, 'green');
  log(`  ${dir}/`, 'gray');
  log('\nNext steps:', 'cyan');
  log(`  cd ${dir}`, 'gray');
  log('  chmod +x main.js', 'gray');
  log('  ./main.js', 'gray');
}

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === 'help' || cmd === '-h') {
    log(C.bright + '\nSkill Template Generator' + C.reset, 'cyan');
    log('\nUsage:', 'yellow');
    log('  skill-template structure    - Show project structure', 'gray');
    log('  skill-template config      - Show config template', 'gray');
    log('  skill-template gitignore  - Show .gitignore template', 'gray');
    log('  skill-template skillmd    - Show SKILL.md template', 'gray');
    log('  skill-template readme     - Show README.md template', 'gray');
    log('  skill-template guidelines - Show development guidelines', 'gray');
    log('  skill-template new <name> - Create new skill with templates', 'gray');
    log('\n  skill-template             - Show this help', 'gray');
    process.exit(0);
  }

  switch (cmd) {
    case 'structure':
    case 'struct':
      showStructure();
      break;
    case 'config':
      showConfig();
      break;
    case 'gitignore':
    case 'ignore':
      showGitignore();
      break;
    case 'skillmd':
    case 'skill':
      showSkillMd(args[1]);
      break;
    case 'readme':
      showReadme(args[1]);
      break;
    case 'guidelines':
    case 'guide':
      showGuidelines();
      break;
    case 'new':
      if (!args[1]) {
        log('Error: Please provide a skill name', 'red');
        log('Usage: skill-template new <skill-name>', 'gray');
        process.exit(1);
      }
      createSkill(args[1]);
      break;
    default:
      log(`Unknown command: ${cmd}`, 'red');
      log('Run "skill-template" for help', 'gray');
      process.exit(1);
  }
}

main();
