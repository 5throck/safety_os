// @version 2.5.2
import { $ } from 'bun';
import * as fs from 'node:fs';
import * as path from 'node:path';

// Check for --lifecycle-only flag
const LIFECYCLE_ONLY = process.argv.includes('--lifecycle-only');

// Project context path (used in multiple checks)
const projectCtxPath = path.join('docs', 'context.md');

// Color helpers
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

let errors = 0;

function Pass(msg: string) {
    console.log(`${GREEN}[PASS] ${msg}${RESET}`);
}
function Fail(msg: string) {
    console.error(`${RED}[FAIL] ${msg}${RESET}`);
    errors++;
}
function Warn(msg: string) {
    console.log(`${YELLOW}[WARN] ${msg}${RESET}`);
}

console.log(`${CYAN}=== audit.ts - workspace standards check ===${RESET}`);
if (LIFECYCLE_ONLY) {
    console.log(`${CYAN}Running lifecycle-only checks (fast pre-commit mode)${RESET}\n`);
}

// 1. CHANGELOG.md must exist
if (fs.existsSync('CHANGELOG.md')) {
    Pass('CHANGELOG.md exists');
} else {
    Fail('CHANGELOG.md missing');
}

// 2. CONSTITUTION.md must be accessible
if (fs.existsSync('CONSTITUTION.md') || fs.existsSync('../CONSTITUTION.md')) {
    Pass('CONSTITUTION.md accessible');
} else {
    Warn('CONSTITUTION.md not found - bypassing check for safety-os');
}

// 3. CHANGELOG.md must have [Unreleased] section
if (fs.existsSync('CHANGELOG.md')) {
    const cl = fs.readFileSync('CHANGELOG.md', 'utf-8');
    if (cl.includes('[Unreleased]')) {
        Pass('CHANGELOG.md has [Unreleased] section');
    } else {
        Fail("CHANGELOG.md is missing '[Unreleased]' section");
    }
}

// 3.5. UTF-8 BOM check for Markdown files
if (!LIFECYCLE_ONLY) {
    let bomErrors = 0;

    function walkDir(dir: string, callback: (fPath: string) => void) {
        if (!fs.existsSync(dir)) return;
        for (const f of fs.readdirSync(dir)) {
            const dirPath = path.join(dir, f);
            const isDirectory = fs.statSync(dirPath).isDirectory();
            if (isDirectory) {
                walkDir(dirPath, callback);
            } else {
                callback(dirPath);
            }
        }
    }

    const searchDirs = ['agents', 'docs', 'memory', 'scripts', 'skills', '.gemini'];
    for (const dir of searchDirs) {
        if (fs.existsSync(dir)) {
            walkDir(dir, (filePath) => {
                if (filePath.replace(/\\/g, '/').includes('memory/archive/')) return;
                if (filePath.endsWith('.md') && !filePath.includes('node_modules') && !filePath.includes('.git')) {
                    const buf = fs.readFileSync(filePath);
                    if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
                        Fail(`UTF-8 BOM found in ${filePath} - files must be UTF-8 without BOM`);
                        bomErrors++;
                    }
                }
            });
        }
    }
    if (bomErrors === 0) { Pass('UTF-8 BOM check: all markdown files are clean'); }
    else { errors += bomErrors; }
}

// 4. AGENTS.md must exist
if (fs.existsSync('AGENTS.md')) { Pass('AGENTS.md exists'); }
else { Fail('AGENTS.md missing (required for agent-first projects)'); }

// 5. At least one agent file must exist in agents/
if (fs.existsSync('agents') && fs.readdirSync('agents').some(f => f.endsWith('.md'))) {
    Pass('agents/ has agent files');
} else {
    Fail('agents/ is empty or missing - create at least agents/pm.md');
}

// 6. Project context checks
if (!LIFECYCLE_ONLY) {
    if (fs.existsSync(projectCtxPath)) {
        const ctx = fs.readFileSync(projectCtxPath, 'utf-8');
        if (/^## Coding Guidelines/m.test(ctx)) {
            Pass('docs/context.md has ## Coding Guidelines');
        } else {
            Fail("docs/context.md is missing '## Coding Guidelines' section");
        }
    } else {
        Warn('docs/context.md not found - skipping project-level checks');
    }
}

// Skills registry cross-check
for (const skillsDir of ['skills']) {
    if (fs.existsSync(skillsDir)) {
        for (const dir of fs.readdirSync(skillsDir)) {
            const fullDir = path.join(skillsDir, dir);
            if (fs.statSync(fullDir).isDirectory()) {
                const skillMd = path.join(fullDir, 'SKILL.md');
                if (fs.existsSync(skillMd)) {
                    Pass(`skill exists: ${skillMd}`);
                } else {
                    Fail(`skill directory missing SKILL.md: ${fullDir}${path.sep}`);
                }
            }
        }
    }
}

// Lifecycle Audits
const hasBun = (await $`bun --version`.quiet().nothrow()).exitCode === 0;
if (hasBun) {
    if (fs.existsSync(path.join('scripts', 'agent-lifecycle-audit.ts'))) {
        const out = await $`bun ${path.join('scripts', 'agent-lifecycle-audit.ts')} --json`.quiet().nothrow();
        if (/"errors":\s*\[\]/.test(out.text())) {
            Pass('Agent audit: all agents healthy');
        } else {
            Fail("Agent audit detected issues (run 'bun scripts/agent-lifecycle-audit.ts' to see details)");
        }
    }
    if (fs.existsSync(path.join('scripts', 'skill-lifecycle-audit.ts'))) {
        const out = await $`bun ${path.join('scripts', 'skill-lifecycle-audit.ts')} --json`.quiet().nothrow();
        if (/"errors":\s*\[\]/.test(out.text())) {
            Pass('Skill audit: all skills healthy');
        } else {
            Fail("Skill audit detected issues (run 'bun scripts/skill-lifecycle-audit.ts' to see details)");
        }
    }
    if (fs.existsSync(path.join('scripts', 'verify-scripts.ts'))) {
        const out = await $`bun ${path.join('scripts', 'verify-scripts.ts')} --verify`.quiet().nothrow();
        if (out.exitCode !== 0)
            Fail("Script registry detected issues (run 'bun scripts/verify-scripts.ts --verify' to see details)");
        else
            Pass("Script registry: all scripts verified");
    }
    if (fs.existsSync(path.join('scripts', 'verify-memory.ts')) && fs.existsSync('memory')) {
        const out = await $`bun ${path.join('scripts', 'verify-memory.ts')}`.quiet().nothrow();
        if (out.exitCode !== 0)
            Warn("Memory log format issues detected (run 'bun scripts/verify-memory.ts' to see details)");
        else
            Pass("Memory logs: format valid");
    }
    if (fs.existsSync(path.join('scripts', 'lifecycle-sync-audit.ts'))) {
        const out = await $`bun ${path.join('scripts', 'lifecycle-sync-audit.ts')} --json`.quiet().nothrow();
        if (out.exitCode !== 0)
            Fail("Lifecycle sync audit detected issues");
        else
            Pass("Lifecycle sync audit: all artifacts in sync");
    }
    if (fs.existsSync(path.join('scripts', 'verify-platform-lifecycle.ts'))) {
        try {
            await $`bun ${path.join('scripts', 'verify-platform-lifecycle.ts')}`.nothrow();
        } catch { /* non-blocking */ }
    }
} else {
    Warn('Bun not installed - skipping lifecycle audits');
}

// Language validation
if (!LIFECYCLE_ONLY) {
    console.log("");
    if (fs.existsSync(path.join('scripts', 'validate-md-language.ts'))) {
        const langValidate = await $`bun ${path.join('scripts', 'validate-md-language.ts')}`.nothrow();
        if (langValidate.exitCode === 0) {
            Pass('Language validation: no Korean-only markdown files found');
        } else {
            Fail('Language validation: Korean-only markdown files detected');
            errors++;
        }
    }
}

// Agent/Skill State Synchronization Check
if (!LIFECYCLE_ONLY && fs.existsSync('AGENTS.md') && fs.existsSync('agents')) {
    let syncErrors = 0;
    const agentsContent = fs.readFileSync('AGENTS.md', 'utf-8');

    for (const file of fs.readdirSync('agents')) {
        if (!file.endsWith('.md')) continue;
        const agentFile = path.join('agents', file);
        const agentName = path.basename(file, '.md');
        const content = fs.readFileSync(agentFile, 'utf-8');

        const statusMatch = /^status:\s*(.+)$/m.exec(content);
        if (statusMatch) {
            const fileStatus = statusMatch[1].trim();
            const agentsRegex = new RegExp(`\`${agentName}\\.md\`[\\s\\S]*?status:\\s*(\\w+)`);
            const agentsMatch = agentsRegex.exec(agentsContent);
            if (agentsMatch) {
                const agentsMdStatus = agentsMatch[1].trim();
                if (fileStatus !== agentsMdStatus) {
                    Fail(`Agent state mismatch: ${agentName} (file=${fileStatus}, AGENTS.md=${agentsMdStatus})`);
                    syncErrors++;
                }
            }
        }
    }

    if (syncErrors === 0) {
        Pass('Agent state synchronization: all agents in sync');
    } else {
        errors += syncErrors;
    }
}

// Cross-Platform Command Parity Check
const claudeCommandsDir = path.join('.claude', 'commands');
if (!LIFECYCLE_ONLY && fs.existsSync(claudeCommandsDir)) {
    let parityWarnings = 0;
    for (const file of fs.readdirSync(claudeCommandsDir)) {
        if (!file.endsWith('.md')) continue;
        const filePath = path.join(claudeCommandsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        if (/^gemini-parity:\s*skip/m.test(content)) continue;

        const geminiCmd = path.join('.gemini', 'commands', file);
        if (!fs.existsSync(geminiCmd)) {
            Warn(`Command parity gap: .claude/commands/${file} has no matching .gemini/commands/${file}`);
            parityWarnings++;
        }
    }
    if (parityWarnings === 0) {
        Pass('Command parity: all .claude/commands/ files have matching .gemini/commands/ files');
    }
}

// Safety OS: legal_basis field check
if (!LIFECYCLE_ONLY && fs.existsSync(path.join('scripts', 'safety-audit.ts'))) {
    const safetyOut = await $`bun ${path.join('scripts', 'safety-audit.ts')}`.quiet().nothrow();
    if (safetyOut.exitCode !== 0) {
        Fail("Safety audit: missing legal_basis fields (run 'bun scripts/safety-audit.ts' to see details)");
    } else {
        Pass("Safety audit: all workflows have legal_basis fields");
    }
}

console.log("");
if (errors === 0) {
    console.log(`${GREEN}✅ All checks passed.${RESET}`);
    process.exit(0);
} else {
    console.log(`${RED}❌ ${errors} check(s) failed. Fix before committing.${RESET}`);
    process.exit(1);
}
