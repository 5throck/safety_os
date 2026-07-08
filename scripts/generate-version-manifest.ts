// @version 1.0.7
import * as fs from 'node:fs';
import * as path from 'node:path';
import { $ } from 'bun';

const MANIFEST_PATH = path.join('docs', 'VERSION_MANIFEST.md');
const MANIFEST_VERSION = '1.0';

const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

interface AgentInfo {
    name: string;
    file: string;
    tier: string;
    model: string;
    last_modified: string;
}

interface SkillInfo {
    name: string;
    version: string;
    location: string;
    platform: string;
    triggers: string[];
    owner: string;
}

interface ScriptInfo {
    name: string;
    version: string;
    location: string;
    dependencies: string[];
}

interface CommandInfo {
    name: string;
    file: string;
    platform: string;
    skill_integration: string;
}

async function getGitTimestamp(filePath: string): Promise<string> {
    try {
        const { stdout } = await $`git log -1 --format=%ct ${filePath}`.quiet().nothrow();
        if (!stdout.toString().trim()) return 'N/A';
        const timestamp = parseInt(stdout.toString().trim(), 10);
        return new Date(timestamp * 1000).toISOString().split('T')[0];
    } catch { return 'N/A'; }
}

function normalizePath(p: string): string {
    return p.replace(/\\/g, '/');
}

function parseAgentFrontmatter(content: string): { tier?: string; model?: string } {
    const tierMatch = /^tier:[ \t]*\r?\n[ \t]+claude:[ \t]+(.+)$/m.exec(content);
    const modelMatch = /^model:[ \t]+(.+)$/m.exec(content);
    return {
        tier: tierMatch ? tierMatch[1].trim() : 'N/A',
        model: modelMatch ? modelMatch[1].trim() : 'N/A',
    };
}

function parseTriggersBlock(content: string): string[] {
    // Flat single-line form: triggers: [a, b, c]
    const bracket = /^[ \t]*triggers:\s*\[(.*?)\]\s*$/m.exec(content);
    if (bracket) {
        return bracket[1].split(',').map(t => t.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    }
    // Nested YAML list form used by most skills:
    //   metadata:
    //     triggers:
    //       - foo
    //       - bar
    const block = /^[ \t]*triggers:[ \t]*\r?\n((?:[ \t]*-[ \t]+.+\r?\n?)+)/m.exec(content);
    if (block) {
        return block[1]
            .split(/\r?\n/)
            .map(line => line.replace(/^[ \t]*-[ \t]*/, '').trim().replace(/^['"]|['"]$/g, ''))
            .filter(Boolean);
    }
    return [];
}

function parseSkillFrontmatter(content: string): { version?: string; triggers?: string[]; owner?: string } {
    const versionMatch = /^version:\s*['"]?([\d.]+)['"]?$/m.exec(content);
    const ownerMatch = /^owner:\s*(.+)$/m.exec(content);

    let triggers: string[] = parseTriggersBlock(content);

    return {
        version: versionMatch ? versionMatch[1].trim() : undefined,
        triggers,
        owner: ownerMatch ? ownerMatch[1].trim() : undefined,
    };
}

function extractScriptVersion(content: string): string {
    // Match both single-line JS comment (// @version) and JSDoc block comment ( * @version)
    const jsMatch = /^\/\/ @version\s*([\d.]+)$/m.exec(content);
    if (jsMatch) return jsMatch[1].trim();
    const jsdocMatch = /^[ \t]*\*\s*@version\s*([\d.]+)$/m.exec(content);
    return jsdocMatch ? jsdocMatch[1].trim() : 'N/A';
}

function extractScriptDependencies(content: string): string[] {
    const deps = new Set<string>();
    const bunImport = /^\$\s*from\s*'bun'$/m.exec(content);
    if (bunImport) deps.add('bun');

    const nodeImports = content.match(/^import \* from ['"]node:(\w+)['"]/gm) || [];
    for (const imp of nodeImports) {
        const match = /^import \* from ['"]node:(\w+)['"]/.exec(imp);
        if (match) deps.add(match[1]);
    }

    const externalImports = content.match(/^import .+ from ['"](?!(node:|\.))[^'"]+['"]/gm) || [];
    for (const imp of externalImports) {
        const match = /^import .+ from ['"](@?[^'"]+)['"]/.exec(imp);
        if (match) deps.add(match[1].split('/')[0]);
    }

    return Array.from(deps).sort();
}

function hasGeminiParitySkip(content: string): boolean {
    return /^gemini-parity:\s*skip/m.test(content);
}


async function collectAgents(): Promise<AgentInfo[]> {
    const agents: AgentInfo[] = [];
    const agentsDir = 'agents';
    if (!fs.existsSync(agentsDir)) return agents;

    function walkDir(dir: string, callback: (filePath: string) => void) {
        for (const item of fs.readdirSync(dir)) {
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                walkDir(itemPath, callback);
            } else if (item.endsWith('.md') && item !== '_COMMON.md' && item !== 'README.md') {
                callback(itemPath);
            }
        }
    }

    const filePaths: string[] = [];
    walkDir(agentsDir, (p) => filePaths.push(p));

    for (const filePath of filePaths) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const { tier, model } = parseAgentFrontmatter(content);
        const lastModified = await getGitTimestamp(filePath);
        const relativePath = path.relative(agentsDir, filePath);
        const agentName = normalizePath(relativePath).replace(/\.md$/, '');
        agents.push({
            name: agentName,
            file: normalizePath(filePath),
            tier: tier || 'N/A',
            model: model || 'N/A',
            last_modified: lastModified,
        });
    }
    return agents.sort((a, b) => a.name.localeCompare(b.name));
}

async function collectSkills(): Promise<SkillInfo[]> {
    const skills: SkillInfo[] = [];
    const skillDirs = ['skills', path.join('.claude', 'skills')];

    for (const skillsDir of skillDirs) {
        if (!fs.existsSync(skillsDir)) continue;
        for (const dir of fs.readdirSync(skillsDir)) {
            const skillPath = path.join(skillsDir, dir);
            if (!fs.statSync(skillPath).isDirectory()) continue;
            const skillMd = path.join(skillPath, 'SKILL.md');
            if (!fs.existsSync(skillMd)) continue;

            const content = fs.readFileSync(skillMd, 'utf-8');
            const { version, triggers, owner } = parseSkillFrontmatter(content);
            const isInGemini = fs.existsSync(path.join('.gemini', 'skills', dir, 'SKILL.md'));

            let platform = 'workspace';
            if (skillsDir === path.join('.claude', 'skills') && isInGemini) platform = 'both';
            else if (skillsDir === path.join('.claude', 'skills')) platform = 'claude';

            skills.push({
                name: dir,
                version: version || 'N/A',
                location: normalizePath(skillMd),
                platform,
                triggers: triggers || [],
                owner: owner || 'N/A',
            });
        }
    }
    return skills.sort((a, b) => a.name.localeCompare(b.name));
}

async function collectScripts(): Promise<ScriptInfo[]> {
    const scripts: ScriptInfo[] = [];
    const scriptsDir = 'scripts';
    if (!fs.existsSync(scriptsDir)) return scripts;

    function walkDir(dir: string, callback: (filePath: string) => void) {
        for (const item of fs.readdirSync(dir)) {
            if (item === 'node_modules' || item === '.git' || item === '.cache') continue;
            const itemPath = path.join(dir, item);
            if (fs.statSync(itemPath).isDirectory()) {
                walkDir(itemPath, callback);
            } else if (item.endsWith('.ts')) {
                callback(itemPath);
            }
        }
    }

    walkDir(scriptsDir, (filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        scripts.push({
            name: path.basename(filePath),
            version: extractScriptVersion(content),
            location: normalizePath(filePath),
            dependencies: extractScriptDependencies(content),
        });
    });
    return scripts.sort((a, b) => a.name.localeCompare(b.name));
}

async function collectCommands(): Promise<CommandInfo[]> {
    const commands: CommandInfo[] = [];
    const commandsDir = path.join('.claude', 'commands');
    if (!fs.existsSync(commandsDir)) return commands;

    for (const file of fs.readdirSync(commandsDir)) {
        if (!file.endsWith('.md')) continue;
        const filePath = path.join(commandsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const geminiCmd = path.join('.gemini', 'commands', file);
        const hasGemini = fs.existsSync(geminiCmd);

        let platform = 'claude';
        if (hasGemini) platform = 'both';

        // Per CLAUDE.md §2, a command file is auto-registered as a same-named Skill by convention —
        // there is no per-file "> Skill: ..." annotation to look for. Only surface an explicit override.
        const skillMatch = /^>.*?Skill:\s*(.+?)$/m.exec(content);
        const commandName = file.replace('.md', '');
        commands.push({
            name: commandName,
            file: normalizePath(filePath),
            platform,
            skill_integration: skillMatch ? skillMatch[1].trim() : `auto (${commandName})`,
        });
    }
    return commands.sort((a, b) => a.name.localeCompare(b.name));
}

function detectDrift(agents: AgentInfo[], skills: SkillInfo[], commands: CommandInfo[]): string[] {
    const issues: string[] = [];

    // Check for agents without tier/model metadata
    for (const agent of agents) {
        if (agent.tier === 'N/A' || agent.model === 'N/A') {
            issues.push(`Agent ${agent.name} missing tier or model metadata`);
        }
    }

    // Check for skills without version
    for (const skill of skills) {
        if (skill.version === 'N/A') {
            issues.push(`Skill ${skill.name} missing version`);
        }
        if (skill.triggers.length === 0) {
            issues.push(`Skill ${skill.name} has no triggers defined`);
        }
    }

    return issues;
}

async function generateManifest() {
    console.log(`${CYAN}Collecting workspace data...${RESET}`);

    const [agents, skills, scripts, commands] = await Promise.all([
        collectAgents(),
        collectSkills(),
        collectScripts(),
        collectCommands(),
    ]);

    const driftIssues = detectDrift(agents, skills, commands);

    let markdown = `# VERSION_MANIFEST.md

**Generated**: ${new Date().toISOString()}
**Manifest Version**: ${MANIFEST_VERSION}
**Location**: ${MANIFEST_PATH}

---

## Summary

- **Agents**: ${agents.length}
- **Skills**: ${skills.length}
- **Scripts**: ${scripts.length}
- **Commands**: ${commands.length}

---

## Agents

| Name | File | Tier | Model | Last Modified |
|------|------|------|-------|---------------|
`;

function sanitizeCell(s: string): string {
    return s.replace(/\|/g, '\\|').replace(/\n/g, ' ').trim();
}

    for (const agent of agents) {
        markdown += `| ${sanitizeCell(agent.name)} | ${sanitizeCell(agent.file)} | ${sanitizeCell(agent.tier)} | ${sanitizeCell(agent.model)} | ${sanitizeCell(agent.last_modified)} |\n`;
    }

    markdown += `
---

## Skills

| Name | Version | Location | Platform | Triggers | Owner |
|------|---------|----------|----------|----------|-------|
`;

    for (const skill of skills) {
        markdown += `| ${sanitizeCell(skill.name)} | ${sanitizeCell(skill.version)} | ${sanitizeCell(skill.location)} | ${sanitizeCell(skill.platform)} | ${sanitizeCell(skill.triggers.join(', ') || 'N/A')} | ${sanitizeCell(skill.owner)} |\n`;
    }

    markdown += `
---

## Scripts

| Name | Version | Location | Dependencies |
|------|---------|----------|--------------|
`;

    for (const script of scripts) {
        markdown += `| ${sanitizeCell(script.name)} | ${sanitizeCell(script.version)} | ${sanitizeCell(script.location)} | ${sanitizeCell(script.dependencies.join(', ') || 'N/A')} |\n`;
    }

    markdown += `
---

## Commands

| Name | File | Platform | Skill Integration |
|------|------|----------|-------------------|
`;

    for (const cmd of commands) {
        markdown += `| ${sanitizeCell(cmd.name)} | ${sanitizeCell(cmd.file)} | ${sanitizeCell(cmd.platform)} | ${sanitizeCell(cmd.skill_integration)} |\n`;
    }

    markdown += `
---

## Platform Parity Status

**Checked**: Claude (.claude/) vs Gemini (.gemini/)

- **Commands with parity**: ${commands.filter(c => c.platform === 'both').length} / ${commands.length}
- **Skills with parity**: ${skills.filter(s => s.platform === 'both').length} / ${skills.length}

---

## Drift Detection
`;

    if (driftIssues.length === 0) {
        markdown += `
✅ No drift detected. All components are properly versioned and integrated.
`;
    } else {
        markdown += `
⚠️ **Drift detected**:

`;
        for (const issue of driftIssues) {
            markdown += `- ${issue}\n`;
        }
    }

    // Ensure docs directory exists
    const docsDir = path.dirname(MANIFEST_PATH);
    if (!fs.existsSync(docsDir)) {
        fs.mkdirSync(docsDir, { recursive: true });
    }

    // Write manifest
    fs.writeFileSync(MANIFEST_PATH, markdown, 'utf-8');
    console.log(`${GREEN}✓ Manifest generated: ${MANIFEST_PATH}${RESET}`);
    console.log(`${GREEN}✓ ${agents.length} agents, ${skills.length} skills, ${scripts.length} scripts, ${commands.length} commands${RESET}`);
    if (driftIssues.length > 0) {
        console.log(`${CYAN}⚠ ${driftIssues.length} drift issues detected${RESET}`);
    }
}

generateManifest().then(() => process.exit(0)).catch((e) => {
    console.error(e);
    process.exit(1);
});
