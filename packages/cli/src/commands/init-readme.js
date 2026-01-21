/**
 * init-readme command - Generate IMDb-style README for creative projects
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TEMPLATE_MARKER = '<!-- wtfb:template-readme -->';
const TEMPLATE_PATH = path.join(__dirname, '..', '..', 'templates', 'readme-imdb-style.md');
const PROJECT_CONFIG_PATH = '.wtfb/project.json';
const README_PATH = 'README.md';

// Type display mapping
const TYPE_LABELS = {
  'screenplay': 'Screenplay',
  'novel': 'Novel',
  'film-production': 'Film Production'
};

/**
 * Convert hyphenated string to Title Case
 * "my-awesome-project" -> "My Awesome Project"
 */
function toTitleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Check if README has the template marker
 */
function hasTemplateMarker(readmePath) {
  if (!fs.existsSync(readmePath)) {
    return false; // No README means safe to create
  }
  const content = fs.readFileSync(readmePath, 'utf8');
  return content.includes(TEMPLATE_MARKER);
}

/**
 * Read project configuration
 */
function readProjectConfig() {
  if (!fs.existsSync(PROJECT_CONFIG_PATH)) {
    return null;
  }
  const content = fs.readFileSync(PROJECT_CONFIG_PATH, 'utf8');
  return JSON.parse(content);
}

/**
 * Generate README content from template
 */
function generateReadme(title, type, year) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found: ${TEMPLATE_PATH}`);
  }

  let content = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Get display label for type
  const typeLabel = TYPE_LABELS[type] || type;

  // Replace exact header pattern only (first line with title placeholder)
  content = content.replace(
    /^# \[Project Title\] \(Year\)/m,
    `# ${title} (${year})`
  );

  // Replace project type placeholders
  content = content.replace(/\[Project Type\]/g, typeLabel);

  // Remove template marker from output (marker lifecycle contract)
  content = content.replace(TEMPLATE_MARKER + '\n', '');
  content = content.replace(TEMPLATE_MARKER, '');

  return content;
}

/**
 * Main command handler
 */
export async function initReadmeCommand(options = {}) {
  const { title: titleOverride, type: typeOverride, force, dryRun } = options;

  // Check if safe to proceed
  const readmeExists = fs.existsSync(README_PATH);
  const hasMarker = hasTemplateMarker(README_PATH);

  if (readmeExists && !hasMarker && !force) {
    console.log(chalk.blue('ℹ️  README.md appears to be customized - leaving it unchanged.'));
    console.log(chalk.gray('   Use --force to replace it anyway.\n'));
    return { status: 'skipped', reason: 'customized' };
  }

  // Get project info
  const projectConfig = readProjectConfig();

  let projectName, projectType;

  if (titleOverride) {
    projectName = titleOverride;
  } else if (projectConfig?.name) {
    projectName = toTitleCase(projectConfig.name);
  } else {
    console.log(chalk.red('❌ Error: No project name found.'));
    console.log(chalk.gray('   Use --title or create .wtfb/project.json first.\n'));
    process.exit(1);
  }

  if (typeOverride) {
    if (!TYPE_LABELS[typeOverride]) {
      console.log(chalk.red(`❌ Error: Invalid type "${typeOverride}".`));
      console.log(chalk.gray('   Use: screenplay, novel, or film-production\n'));
      process.exit(1);
    }
    projectType = typeOverride;
  } else if (projectConfig?.projectType) {
    projectType = projectConfig.projectType;
  } else {
    projectType = 'screenplay'; // Default
  }

  const currentYear = new Date().getFullYear();

  // Generate content
  const readmeContent = generateReadme(projectName, projectType, currentYear);

  if (dryRun) {
    console.log(chalk.yellow('--- DRY RUN: Would generate ---\n'));
    console.log(readmeContent.substring(0, 800) + '\n...\n');
    console.log(chalk.yellow('-------------------------------\n'));
    return { status: 'dry-run', content: readmeContent };
  }

  // Write README
  fs.writeFileSync(README_PATH, readmeContent, 'utf8');

  const action = force && readmeExists && !hasMarker ? 'forced overwrite' : 'generated';
  console.log(chalk.green(`✅ README.md ${action}!\n`));
  console.log(chalk.bold(`  # ${projectName} (${currentYear})`));
  console.log(chalk.gray(`  **${TYPE_LABELS[projectType]}** | **[Genre]** | **[Runtime]**\n`));
  console.log('Fill in the remaining placeholders:');
  console.log(chalk.gray('  - Logline and synopsis'));
  console.log(chalk.gray('  - Character and crew details\n'));

  return { status: action, title: projectName, type: projectType, year: currentYear };
}
