// @version 1.4.2 — variant-aware: runs safety-audit.ts for safety-os, workspace audit.ts for workspace root
import { $ } from 'bun';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { resolve } from 'node:path';
import { withRetry, DEFAULT_CONFIG } from './retry-handler.ts';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

// Detect project type: variant (safety-os) vs workspace root
const isVariant = fs.existsSync('variant.json') || !fs.existsSync('CONSTITUTION.md');
const projectName = isVariant ? (JSON.parse(fs.readFileSync('variant.json', 'utf-8').trim() || '{}').name || 'variant') : 'workspace';

console.log(`${CYAN}=== dev-sync (${projectName}) ===${RESET}`);
if (isVariant) {
    console.log(`${CYAN}Variant project detected — using safety-audit.ts + domain test suite${RESET}\n`);
}

// Workspace root guard — dev-sync must run from the project root it belongs to.
// Using import.meta.dir (script location) prevents CWD mismatches when two clones exist.
const expectedRoot = resolve(import.meta.dir, '..');
const actualCwd = process.cwd();
if (path.resolve(actualCwd) !== expectedRoot) {
    console.error(`${RED}❌ dev-sync: CWD mismatch.${RESET}`);
    console.error(`   Expected: ${expectedRoot}`);
    console.error(`   Current:  ${actualCwd}`);
    console.error(`   Run from the project root: cd ${expectedRoot}`);
    process.exit(1);
}

const msg = process.argv.slice(2).join(' ') || "chore: update";
const dateObj = new Date();
const date = dateObj.toISOString().split('T')[0]; // yyyy-MM-dd

if (!fs.existsSync('memory')) fs.mkdirSync('memory');

let gitStatus = "";
try {
    const { stdout } = await $`git status --short`.quiet().nothrow();
    gitStatus = stdout.toString().trim();
} catch {}

let fileLines = "- N/A";
if (gitStatus) {
    fileLines = gitStatus.split('\n').filter(Boolean).map(line => {
        const f = line.replace(/^.{2}\s+/, '').trim();
        return `- \`${f}\` — modified`;
    }).join('\n');
}

let separator = "";
const memoryFile = path.join('memory', `${date}.md`);
if (fs.existsSync(memoryFile)) { separator = "\n---\n\n"; }

const template = `${separator}## Session Summary
${msg}

## Changes
${fileLines}

## Decisions
- None

## Open Issues
- None
`;

fs.appendFileSync(memoryFile, template, 'utf8');

// 2. Update MEMORY.md index
await $`bun run scripts/sync-md.ts ${date} "${msg}"`;


// 2.5 Generate scripts/README.md
const genReadmeTs = path.join('scripts', 'generate-scripts-readme.ts');
if (fs.existsSync(genReadmeTs)) {
    await $`bun ${genReadmeTs}`;
}

// 3. Block if [Unreleased] section has no bullet items
if (fs.existsSync('CHANGELOG.md')) {
    const clCheck = fs.readFileSync('CHANGELOG.md', 'utf-8');
    const match = /## \[Unreleased\]([\s\S]*?)(?=\n## |$)/.exec(clCheck);
    if (match) {
        const unreleasedSection = match[1];
        if (!/^\s*-\s+/m.test(unreleasedSection)) {
            console.log("");
            console.log(`${RED}❌ CHANGELOG.md [Unreleased] section has no entries.${RESET}`);
            console.log(`${YELLOW}   Run: /changelog 'type: description' to add an entry before syncing.${RESET}`);
            console.log("");
            process.exit(1);
        }
    }
}

// 3.6 Warn about deprecated scripts
if (fs.existsSync('SCRIPTS.md')) {
    const content = fs.readFileSync('SCRIPTS.md', 'utf-8');
    const lines = content.split('\n');
    let hasDeprecated = false;
    for (const line of lines) {
        if (/^\|.*\|.*deprecated/.test(line)) {
            if (!hasDeprecated) {
                console.log(`${YELLOW}⚠️  Deprecated scripts detected in SCRIPTS.md:${RESET}`);
                hasDeprecated = true;
            }
            const parts = line.split('|');
            if (parts.length >= 3) {
                console.log(`   - ${parts[1].trim()}`);
            }
        }
    }
    if (hasDeprecated) {
        console.log("   Consider removing or updating these scripts.");
        console.log("");
    }
}

// 3.7 L0/L1 script drift check
const hasBun = (await $`bun --version`.quiet().nothrow()).exitCode === 0;
if (hasBun) {
    const verifyScripts = path.join('scripts', 'verify-scripts.ts');
    if (fs.existsSync(verifyScripts)) {
        await $`bun ${verifyScripts} --check-drift`.quiet().nothrow();
    }
}

// 3.8 Archive old memory files
const archiveMemoryTs = path.join('scripts', 'archive-memory.ts');
if (fs.existsSync(archiveMemoryTs)) {
    await $`bun ${archiveMemoryTs}`;
}

// 4. Audit gate — variant projects use safety-audit.ts, workspace uses audit.ts
if (isVariant) {
    console.log(`${CYAN}--- Safety OS domain audit ---${RESET}`);
    const safetyAuditRes = await $`bun scripts/safety-audit.ts`.nothrow();
    if (safetyAuditRes.exitCode !== 0) {
        console.log(`${RED}❌ safety-audit.ts failed${RESET}`);
        process.exit(1);
    }

    // 4a. Run domain-specific test suites (variant only)
    const testScripts = [
        'scripts/test-pharma-general-profile.ts',
        'scripts/test-chemical-handling-profile.ts',
        'scripts/test-cross-domain-integration.ts',
        'scripts/test-domain-scenarios.ts',
    ];
    for (const testScript of testScripts) {
        if (fs.existsSync(testScript)) {
            const testRes = await $`bun ${testScript}`.nothrow();
            if (testRes.exitCode !== 0) {
                console.log(`${RED}❌ ${testScript} failed${RESET}`);
                process.exit(1);
            }
        }
    }
    console.log(`${GREEN}✓ All domain tests passed${RESET}\n`);
} else {
    const auditRes = await $`bun scripts/audit.ts`.nothrow();
    if (auditRes.exitCode !== 0) {
        process.exit(1);
    }
}

// 4.5. Generate VERSION_MANIFEST.md
const genManifestTs = path.join('scripts', 'generate-version-manifest.ts');
if (fs.existsSync(genManifestTs)) {
    const genRes = await $`bun ${genManifestTs}`.quiet().nothrow();
    if (genRes.exitCode !== 0) {
        console.log(`${RED}❌ VERSION_MANIFEST.md generation failed${RESET}`);
        console.log(`${RED}   ${genRes.stderr.toString().trim()}${RESET}`);
        process.exit(1);
    }
    console.log(`${GREEN}✓ VERSION_MANIFEST.md generated${RESET}`);
}

// 4.7 L0→L1 publish (workspace root only, skip for variant projects)
const isWorkspaceRoot = !isVariant && fs.existsSync('templates/common') && fs.existsSync('scripts/propagation-map.json');
// L0 context: CONSTITUTION.md exists at workspace root — publish failures are fatal here.
const isL0Context = !isVariant && fs.existsSync('CONSTITUTION.md');
if (isWorkspaceRoot) {
    console.log('\n📦 Publishing L0→L1 (scripts, skills, commands)...');
    try {
        const publishRes = await $`bun scripts/propagate-to-templates.ts --apply`.nothrow();
        if (publishRes.exitCode !== 0) {
            if (isL0Context) {
                console.log(`${RED}❌ L0→L1 publish failed — fatal in L0 context (CONSTITUTION.md present)${RESET}`);
                process.exit(1);
            } else {
                console.log(`${YELLOW}⚠️  L0→L1 publish failed — continuing sync${RESET}`);
            }
        }
    } catch (e) {
        if (isL0Context) {
            console.log(`${RED}❌ L0→L1 publish failed — fatal in L0 context (CONSTITUTION.md present)${RESET}`);
            process.exit(1);
        } else {
            console.log(`${YELLOW}⚠️  L0→L1 publish failed — continuing sync${RESET}`);
        }
    }
}

// 5. Branch -> commit -> push -> PR
let currentBranch = "";
try {
    const { stdout } = await $`git rev-parse --abbrev-ref HEAD`.quiet().nothrow();
    currentBranch = stdout.toString().trim();
} catch {}

let branch = currentBranch;
if (currentBranch === "main" || currentBranch === "master") {
    let slug = msg.replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-').toLowerCase().replace(/-$/, '');
    slug = slug.substring(0, Math.min(40, slug.length));
    
    // yyyyMMdd-HHmmss
    const pad = (n: number) => n.toString().padStart(2, '0');
    const d = new Date();
    const timestamp = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
    
    branch = `pr/${timestamp}-${slug}`.replace(/-+$/, '');
    if (!slug) branch += 'auto';
    try {
        await $`git checkout -b ${branch}`.nothrow();
    } catch {
        console.log(`${RED}❌ Failed to create branch '${branch}'${RESET}`);
        process.exit(1);
    }
} else {
    console.log(`${CYAN}ℹ️  Already on branch '${branch}' - committing here without creating a new branch.${RESET}`);
}

// 6. Guard against sensitive files
try {
    const { stdout } = await $`git ls-files --others --exclude-standard`.quiet().nothrow();
    const untracked = stdout.toString().trim().split('\n').filter(Boolean);
    const sensitive = untracked.filter(f => /\.(pem|key|p12|pfx|jks|keystore|ppk)$|(^|\/)\.env(\.[^sa]|$)|(^|\/)id_(rsa|ed25519|ecdsa|dsa)$|credentials\.json|service.?account\.json|secrets\.ya?ml|\.htpasswd/.test(f));
    
    if (sensitive.length > 0) {
        console.log(`${RED}❌ Potentially sensitive untracked files detected - refusing git add -A:${RESET}`);
        sensitive.forEach(s => console.log(`   ${s}`));
        console.log(`${YELLOW}   Stage files explicitly with 'git add <file>' or add them to .gitignore.${RESET}`);
        process.exit(1);
    }
} catch {}

try {
    const addRes = await $`git add -A`.nothrow();
    if (addRes.exitCode !== 0) throw new Error(addRes.stderr.toString());
} catch (e) {
    console.log(`${RED}❌ git add failed: ${e}${RESET}`);
    process.exit(1);
}

const syncContext = crypto.randomUUID();
process.env.SYNC_ACTIVE = "1";
process.env.DEV_SYNC_CONTEXT = syncContext;
// Clean up stale temp file from any previous crashed run before writing new one
try { if (fs.existsSync('.sync_context.tmp')) fs.unlinkSync('.sync_context.tmp'); } catch {}
fs.writeFileSync('.sync_context.tmp', syncContext);

const cleanupTmp = () => { try { if (fs.existsSync('.sync_context.tmp')) fs.unlinkSync('.sync_context.tmp'); } catch {} };
process.on('exit', cleanupTmp);

try {
    const commitRes = await $`git commit -m ${msg}`.nothrow();
    cleanupTmp();
    if (commitRes.exitCode !== 0) throw new Error(commitRes.stderr.toString());
} catch (e) {
    cleanupTmp();
    console.log(`${RED}❌ git commit failed: ${e}${RESET}`);
    process.exit(1);
}

const pushRetry = await withRetry(
    () => $`git push -u origin ${branch}`.nothrow(),
    { ...DEFAULT_CONFIG, maxRetries: 3, initialDelay: 1000, isSuccess: (r: any) => r.exitCode === 0 },
    'git push'
);
const pushProc = pushRetry.result as { exitCode: number; stderr: { toString(): string } } | undefined;
if (!pushRetry.success) {
    // With isSuccess wired above, pushRetry.success is the single source of truth.
    // pushProc.stderr is kept as defense-in-depth (Trade-off #3 (b)) for the error message.
    const errMsg = pushProc?.stderr.toString().trim() || pushRetry.lastError?.message || 'unknown error';
    console.log(`${RED}❌ git push failed: ${errMsg}${RESET}`);
    process.exit(1);
}

// 7. Generate PR body and open PR
// Always specify --base master to avoid wrong-base issue when repo default
// branch is set to a PR branch instead of master.
//
// gh CLI env precedence: GH_TOKEN/GITHUB_TOKEN, if set, override the keychain-stored
// `gh auth login` credential. Bun auto-loads .env (which defines GITHUB_TOKEN for
// legalize_kr's search_precedent tool) into every `bun run` process, so `gh` calls made
// from within this script were silently picking up that unrelated token and failing with
// "HTTP 401: Bad credentials" — even though `gh auth status` and direct shell `gh` calls
// (outside a bun-launched process) work fine. Strip both vars for gh invocations only;
// .env itself is untouched since GITHUB_TOKEN is legitimately needed elsewhere.
const ghEnv = { ...process.env };
delete ghEnv.GITHUB_TOKEN;
delete ghEnv.GH_TOKEN;

const prBase = 'master';
let prBody = "";
try {
    const { stdout } = await $`bun run scripts/gen-pr-body.ts "${msg}"`.quiet().nothrow();
    prBody = stdout.toString().trim();
} catch {}

let prCreateRetry: Awaited<ReturnType<typeof withRetry>>;
if (prBody) {
    prCreateRetry = await withRetry(
        () => $`gh pr create --base ${prBase} --title ${msg} --body ${prBody}`.env(ghEnv).nothrow(),
        { ...DEFAULT_CONFIG, maxRetries: 3, initialDelay: 1000, isSuccess: (r: any) => r.exitCode === 0 },
        'gh pr create'
    );
} else if (fs.existsSync(path.join('.github', 'pull_request_template.md'))) {
    const prTpl = fs.readFileSync(path.join('.github', 'pull_request_template.md'), 'utf-8');
    prCreateRetry = await withRetry(
        () => $`gh pr create --base ${prBase} --title ${msg} --body ${prTpl}`.env(ghEnv).nothrow(),
        { ...DEFAULT_CONFIG, maxRetries: 3, initialDelay: 1000, isSuccess: (r: any) => r.exitCode === 0 },
        'gh pr create'
    );
} else {
    prCreateRetry = await withRetry(
        () => $`gh pr create --base ${prBase} --fill`.env(ghEnv).nothrow(),
        { ...DEFAULT_CONFIG, maxRetries: 3, initialDelay: 1000, isSuccess: (r: any) => r.exitCode === 0 },
        'gh pr create'
    );
}

if (!prCreateRetry.success) {
    const errMsg = prCreateRetry.lastError?.message || 'unknown error';
    console.log(`${RED}❌ gh pr create failed: ${errMsg}${RESET}`);
    process.exit(1);
}
