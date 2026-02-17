#!/usr/bin/env node

/**
 * SkillStore - OpenClaw Skill Manager
 * Search existing skills, install from GitHub, or create new ones
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const https = require('https');
const http = require('http');

const C = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  mag: '\x1b[35m'
};

const log = (msg, color = 'reset') => console.log(`${C[color]}${msg}${C.reset}`);
const err = (msg) => console.error(`${C.red}Error:${C.reset} ${msg}`);

const CONFIG_FILE = path.join(__dirname, 'config.json');

// Known OpenClaw skills repositories on GitHub
const KNOWN_SKILLS = [
  { name: 'homeassistant', repo: 'chris6970barbarian-hue/openclaw-homeassistant', desc: 'Control smart home devices' },
  { name: 'openhue', repo: '', desc: 'Philips Hue lights control' },
  { name: 'blucli', repo: '', desc: 'BluOS speaker control' },
  { name: 'eightctl', repo: '', desc: 'Eight Sleep pod control' },
  { name: 'sonoscli', repo: '', desc: 'Sonos speaker control' },
  { name: 'gog', repo: '', desc: 'Google Workspace (Gmail, Calendar, Drive)' },
  { name: 'himalaya', repo: '', desc: 'Email client via IMAP/SMTP' },
  { name: 'obsidian', repo: '', desc: 'Obsidian vault integration' },
  { name: 'ordercli', repo: '', desc: 'Food delivery orders' },
  { name: 'weather', repo: '', desc: 'Weather forecasts' },
  { name: 'github', repo: '', desc: 'GitHub CLI integration' },
  { name: 'blogwatcher', repo: '', desc: 'RSS/Atom feed monitoring' },
];

// Load config
function loadConfig() {
  if (fs.existsSync(CONFIG_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  }
  return { installed: [], searchHistory: [] };
}

function saveConfig(config) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Prompt user
function prompt(question) {
  return new Promise(resolve => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

// HTTP request helper
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

// Search GitHub for OpenClaw skills
async function searchGitHub(query) {
  log(`Searching GitHub for "${query}"...`, 'cyan');
  
  try {
    const results = await httpGet(
      `https://api.github.com/search/repositories?q=openclaw+${encodeURIComponent(query)}+in:name,description&per_page=10`,
      // Add User-Agent header
    );
    
    if (results.items && results.items.length > 0) {
      log(`\nFound ${results.items.length} matching repositories:`, 'green');
      return results.items.map(r => ({
        name: r.name,
        fullName: r.full_name,
        desc: r.description,
        url: r.html_url,
        stars: r.stargazers_count
      }));
    }
  } catch (e) {
    log('GitHub search failed, using local knowledge...', 'gray');
  }
  
  // Fallback to local search
  return [];
}

// Search local skills
function searchLocal(query) {
  const skillsDir = path.join(__dirname, '..');
  if (!fs.existsSync(skillsDir)) return [];
  
  const results = [];
  const items = fs.readdirSync(skillsDir);
  const q = query.toLowerCase();
  
  for (const item of items) {
    const itemPath = path.join(skillsDir, item);
    if (!fs.statSync(itemPath).isDirectory()) continue;
    
    // Check skill name
    if (item.toLowerCase().includes(q)) {
      results.push({ name: item, type: 'local' });
    }
    
    // Check SKILL.md
    const skillMd = path.join(itemPath, 'SKILL.md');
    if (fs.existsSync(skillMd)) {
      const content = fs.readFileSync(skillMd, 'utf8').toLowerCase();
      if (content.includes(q) && !results.find(r => r.name === item)) {
        results.push({ name: item, type: 'local' });
      }
    }
  }
  
  return results;
}

// Show search results
function showResults(query, results) {
  log(`\n${C.bright}Search Results for "${query}"${C.reset}\n`, 'cyan');
  
  if (results.length === 0) {
    log('No existing skills found.', 'yellow');
    return false;
  }
  
  results.forEach((r, i) => {
    const prefix = r.type === 'local' ? '[LOCAL]' : '[GIT]';
    const color = r.type === 'local' ? 'green' : 'cyan';
    log(`${i + 1}. ${C[color]}${prefix}${C.reset} ${C.bright}${r.name}${C.reset}`, color);
    if (r.desc) log(`   ${r.desc}`, 'gray');
    if (r.url) log(`   ${r.url}`, 'gray');
  });
  
  return true;
}

// Install from GitHub
async function installFromGitHub(repo, name) {
  log(`\nInstalling ${name} from GitHub...`, 'cyan');
  
  const skillsDir = path.join(__dirname, '..');
  const targetDir = path.join(skillsDir, name);
  
  if (fs.existsSync(targetDir)) {
    log(`Skill "${name}" already exists`, 'yellow');
    return false;
  }
  
  // Clone repo
  const cmd = `git clone https://github.com/${repo}.git "${targetDir}"`;
  
  return new Promise((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        err(`Failed to install: ${error.message}`);
        resolve(false);
        return;
      }
      
      log(`Installed to ${targetDir}`, 'green');
      
      // Update config
      const config = loadConfig();
      config.installed.push({ name, repo, installedAt: new Date().toISOString() });
      saveConfig(config);
      
      resolve(true);
    });
  });
}

// Create new skill with templates
function createNewSkill(name) {
  log(`\nCreating new skill: ${name}`, 'cyan');
  
  const skillsDir = path.join(__dirname, '..');
  const targetDir = path.join(skillsDir, name);
  
  if (fs.existsSync(targetDir)) {
    err(`Skill "${name}" already exists!`);
    return false;
  }
  
  // Create directory
  fs.mkdirSync(targetDir, { recursive: true });
  
  // Create templates
  const templates = {
    'SKILL.md': `# ${name}

Brief description of what this skill does.

## Setup

\\\`\\\`\\\`bash
# Installation steps
\\\`\\\`\\\`

## Usage

\\\`\\\`\\\`bash
${name} command
\\\`\\\`\\\`

## Configuration

Required environment variables or config options.

## Supported Commands

- \\\`command1\\\` - Description
- \\\`command2\\\` - Description`,
    
    'README.md': `# ${name}

Brief description.

## Features

- Feature 1
- Feature 2

## Quick Start

\\\`\\\`\\\`bash
# Setup
${name} setup

# Usage
${name} command
\\\`\\\`\\\`

## Documentation

See [SKILL.md](./SKILL.md) for full documentation.

## License

MIT`,
    
    'config.json': `{
  "name": "${name}",
  "version": "1.0.0",
  "description": "",
  "author": ""
}`,
    
    '.gitignore': `# Ignore sensitive files
config.json
*.token
*.key
.env
node_modules/`,
    
    'main.js': `#!/usr/bin/env node

/**
 * ${name} - Skill for OpenClaw
 */

const C = {
  reset: '\\x1b[0m',
  green: '\\x1b[32m',
  red: '\\x1b[31m',
  yellow: '\\x1b[33m',
  cyan: '\\x1b[36m'
};

const log = (msg, color = 'reset') => console.log(\`\${C[color]}\${msg}\${C.reset}\`);

function help() {
  log('Usage:', 'yellow');
  log('  ' + process.argv[1] + ' help', 'gray');
}

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];
  
  if (!cmd || cmd === 'help') {
    help();
    return;
  }
  
  log(\`Command: \${cmd}\`, 'cyan');
}

main();
`
  };
  
  // Write files
  for (const [filename, content] of Object.entries(templates)) {
    fs.writeFileSync(path.join(targetDir, filename), content);
  }
  
  // Make main.js executable
  fs.chmodSync(path.join(targetDir, 'main.js'), '755');
  
  log(`\nCreated new skill at: ${targetDir}`, 'green');
  log('Next steps:', 'yellow');
  log(`  cd ${targetDir}`, 'gray');
  log('  # Edit main.js with your implementation', 'gray');
  log('  # Edit SKILL.md with documentation', 'gray');
  
  return true;
}

// List installed skills
function listInstalled() {
  const config = loadConfig();
  
  log(`\n${C.bright}Installed Skills${C.reset}\n`, 'cyan');
  
  // Local skills
  const skillsDir = path.join(__dirname, '..');
  if (fs.existsSync(skillsDir)) {
    const items = fs.readdirSync(skillsDir).filter(i => {
      const p = path.join(skillsDir, i);
      return fs.statSync(p).isDirectory() && !i.startsWith('.');
    });
    
    if (items.length > 0) {
      log('Local skills:', 'yellow');
      items.forEach(s => log(`  - ${s}`, 'gray'));
    }
  }
  
  if (config.installed && config.installed.length > 0) {
    log('\nInstalled from GitHub:', 'yellow');
    config.installed.forEach(s => log(`  - ${s.name} (${s.repo})`, 'gray'));
  }
  
  if (!fs.existsSync(skillsDir) || fs.readdirSync(skillsDir).filter(i => fs.statSync(path.join(skillsDir, i)).isDirectory()).length === 0) {
    log('No skills found', 'gray');
  }
}

// Show known skills
function showKnownSkills() {
  log(`\n${C.bright}Known OpenClaw Skills${C.reset}\n`, 'cyan');
  
  KNOWN_SKILLS.forEach(s => {
    log(`  - ${C.green}${s.name}${C.reset} - ${s.desc}`, 'gray');
  });
}

// Main workflow
async function main() {
  const args = process.argv.slice(2);
  const query = args.join(' ');
  
  // No query - show help
  if (!query || query === 'help' || query === '-h') {
    log(C.bright + '\nSkillStore - OpenClaw Skill Manager' + C.reset, 'cyan');
    log('\nUsage:', 'yellow');
    log('  skillstore <query>     - Search and install skills', 'gray');
    log('  skillstore list        - List installed skills', 'gray');
    log('  skillstore known       - Show known skills', 'gray');
    log('  skillstore create <name> - Create new skill', 'gray');
    log('\nExamples:', 'yellow');
    log('  skillstore home assistant', 'gray');
    log('  skillstore weather', 'gray');
    log('  skillstore github', 'gray');
    log('  skillstore create my-awesome-skill', 'gray');
    return;
  }
  
  // List commands
  if (query === 'list' || query === 'ls') {
    listInstalled();
    return;
  }
  
  if (query === 'known') {
    showKnownSkills();
    return;
  }
  
  // Create new skill
  if (query.startsWith('create ') || query.startsWith('new ')) {
    const name = query.replace(/^(create|new)\s+/, '');
    createNewSkill(name);
    return;
  }
  
  // Search workflow
  log(C.bright + '\n=== SkillStore Search ===' + C.reset, 'cyan');
  log(`Looking for: "${query}"\n`, 'gray');
  
  // Step 1: Search GitHub
  const gitResults = await searchGitHub(query);
  
  // Step 2: Search local
  const localResults = searchLocal(query);
  
  // Combine results
  const allResults = [
    ...localResults.map(r => ({ ...r, desc: 'Local skill' })),
    ...gitResults
  ];
  
  // Step 3: Show results
  const hasResults = showResults(query, allResults);
  
  if (!hasResults) {
    // No results - offer to create
    log('\nNo existing skills match your query.', 'yellow');
    const create = await prompt(`Create new skill "${query}"? (y/n): `);
    
    if (create.toLowerCase() === 'y') {
      // Generate name from query
      const name = query.toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      createNewSkill(name);
    }
    return;
  }
  
  // Offer options
  log('\nOptions:', 'yellow');
  log('  [n] Create new skill with this name', 'gray');
  log('  [q] Quit', 'gray');
  
  // If GitHub results, offer to install
  if (gitResults.length > 0) {
    log(`\nOr enter number to install from GitHub: `, 'gray');
    const choice = await prompt(`  (1-${gitResults.length}, n to create new, q to quit): `);
    
    const num = parseInt(choice);
    if (!isNaN(num) && num >= 1 && num <= gitResults.length) {
      const selected = gitResults[num - 1];
      await installFromGitHub(selected.fullName, selected.name);
      return;
    }
  }
  
  if (choice && choice.toLowerCase() === 'n') {
    const name = query.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    createNewSkill(name);
    return;
  }
  
  log('Cancelled', 'gray');
}

main();
