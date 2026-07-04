#!/usr/bin/env bun
/**
 * sync-skills.ts
 * Distributes skills from the SSOT (skills/) to .claude/skills/ and .gemini/skills/
 * @version 1.1.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const scriptDir     = import.meta.dir;
const workspaceRoot = path.resolve(scriptDir, '..');

const ssotSkills   = path.join(workspaceRoot, 'skills');
const claudeSkills = path.join(workspaceRoot, '.claude', 'skills');
const geminiSkills = path.join(workspaceRoot, '.gemini', 'skills');

// Create target directories if they don't exist
fs.mkdirSync(claudeSkills, { recursive: true });
fs.mkdirSync(geminiSkills, { recursive: true });

console.log(`Syncing skills from SSOT (${ssotSkills})...`);

if (!fs.existsSync(ssotSkills)) {
  console.log('No skills directory found — nothing to sync.');
  process.exit(0);
}

// Clean up legacy category folders in target directories if they exist
const legacyCategories = ['daily', 'domains', 'emergency', 'investigation', '_meta'];
for (const cat of legacyCategories) {
  const claudeCatPath = path.join(claudeSkills, cat);
  if (fs.existsSync(claudeCatPath)) {
    fs.rmSync(claudeCatPath, { recursive: true, force: true });
    console.log(`  -> Cleaned up legacy category folder: .claude/skills/${cat}`);
  }
  const geminiCatPath = path.join(geminiSkills, cat);
  if (fs.existsSync(geminiCatPath)) {
    fs.rmSync(geminiCatPath, { recursive: true, force: true });
    console.log(`  -> Cleaned up legacy category folder: .gemini/skills/${cat}`);
  }
}

// Recursively find all SKILL.md files under a directory
function findSkillFiles(dir: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results.push(...findSkillFiles(filePath));
    } else if (file === 'SKILL.md') {
      results.push(filePath);
    }
  }
  return results;
}

// Parse YAML frontmatter to extract the 'name' field
function extractSkillName(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;
    const lines = match[1].split(/\r?\n/);
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();
      if (key === 'name') {
        return value.replace(/^['"]|['"]$/g, '');
      }
    }
  } catch (e) {
    console.error(`Failed to parse frontmatter from ${filePath}:`, e);
  }
  return null;
}

const skillFiles = findSkillFiles(ssotSkills);

for (const skillMdPath of skillFiles) {
  const skillDir = path.dirname(skillMdPath);
  const skillName = extractSkillName(skillMdPath);
  if (!skillName) {
    console.warn(`  [WARN] Could not extract skill name from: ${skillMdPath}`);
    continue;
  }

  // Copy to .claude/skills/
  const claudeTarget = path.join(claudeSkills, skillName);
  if (fs.existsSync(claudeTarget)) {
    fs.rmSync(claudeTarget, { recursive: true, force: true });
  }
  fs.cpSync(skillDir, claudeTarget, { recursive: true });
  console.log(`  -> Synced ${skillName} to .claude/skills/`);

  // Copy to .gemini/skills/
  const geminiTarget = path.join(geminiSkills, skillName);
  if (fs.existsSync(geminiTarget)) {
    fs.rmSync(geminiTarget, { recursive: true, force: true });
  }
  fs.cpSync(skillDir, geminiTarget, { recursive: true });
  console.log(`  -> Synced ${skillName} to .gemini/skills/`);

  // Special logic for commands derived from skills
  if (skillName === 'meeting-facilitation') {
    const claudeCmdDir = path.join(workspaceRoot, '.claude', 'commands');
    const geminiCmdDir = path.join(workspaceRoot, '.gemini', 'commands');
    fs.mkdirSync(claudeCmdDir, { recursive: true });
    fs.mkdirSync(geminiCmdDir, { recursive: true });

    fs.copyFileSync(skillMdPath, path.join(claudeCmdDir, 'meeting.md'));
    console.log(`  -> Synced SKILL.md to .claude/commands/meeting.md`);
    
    fs.copyFileSync(skillMdPath, path.join(geminiCmdDir, 'meeting.md'));
    console.log(`  -> Synced SKILL.md to .gemini/commands/meeting.md`);
  }
}

console.log('Skill synchronization complete!');
