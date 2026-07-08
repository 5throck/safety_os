#!/usr/bin/env bun
/**
 * verify-scripts.ts — Script Lifecycle Registry Verifier (Standalone Variant)
 * @version 1.0.0
 *
 * Validates that scripts/SCRIPTS.md Registry is in sync with actual script files,
 * enforces deprecation removal dates, and blocks on security advisories.
 *
 * Adapted from workspace-root verify-scripts.ts (v1.2.2) for standalone variant
 * deployments (no templates/common/scripts/ directory).
 *
 * Usage:
 *   bun scripts/verify-scripts.ts --verify       # CI / pre-commit: fail on drift
 *   bun scripts/verify-scripts.ts --generate    # Generate Registry draft from filesystem
 *   bun scripts/verify-scripts.ts --report      # Human-readable status report
 *   bun scripts/verify-scripts.ts --check-drift # No-op in standalone (exits 0)
 *
 * Exit codes:
 *   0 = all checks passed
 *   1 = drift, expired removal date, or active security advisory detected
 */

import * as fs from "fs";
import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { join, dirname, relative } from "path";

// ── Configuration ────────────────────────────────────────────────────────────

const SCRIPT_EXTENSIONS = [".sh", ".ps1", ".ts"];
const SCRIPTS_MD_FILENAME = "SCRIPTS.md";

// Resolve workspace root — look for variant.json or docs/context.md markers.
function findWorkspaceRoot(startDir: string): string {
  let dir = startDir;
  for (let i = 0; i < 6; i++) {
    if (
      existsSync(join(dir, "CONSTITUTION.md")) ||
      existsSync(join(dir, "variant.json")) ||
      existsSync(join(dir, "docs", "context.md"))
    ) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return dirname(startDir);
}

const scriptDir = import.meta.dir;
const workspaceRoot = findWorkspaceRoot(scriptDir);
const scriptsDir = join(workspaceRoot, "scripts");
const scriptsMdPath = join(scriptsDir, SCRIPTS_MD_FILENAME);

// ── Types ────────────────────────────────────────────────────────────────────

interface RegistryEntry {
  script: string;
  source: string;
  version: string;
  status: "active" | "deprecated" | "experimental";
  removalDate: string; // "—" or "YYYY-MM-DD"
  securityAdvisory: string; // "—" or "CVE-XXXX"
  layer: string;
  pair: string; // "—" or "<script-name>"
}

// ── Registry Parser ──────────────────────────────────────────────────────────

function parseRegistry(content: string): RegistryEntry[] {
  const lines = content.split("\n");
  const entries: RegistryEntry[] = [];

  let inRegistry = false;
  let headerParsed = false;

  for (const line of lines) {
    if (line.startsWith("## Registry")) {
      inRegistry = true;
      headerParsed = false;
      continue;
    }
    if (inRegistry && line.startsWith("## ")) {
      break;
    }
    if (!inRegistry) continue;

    const trimmed = line.trim();
    if (!trimmed.startsWith("|") || trimmed.startsWith("|-")) continue;

    const cols = trimmed
      .split("|")
      .slice(1, -1)
      .map((c) => c.trim());

    if (!headerParsed) {
      headerParsed = true;
      continue;
    }

    if (cols.length < 6) continue;

    const script = cols[0].replace(/`/g, "");
    const status = cols[3] as RegistryEntry["status"];

    entries.push({
      script,
      source: cols[1],
      version: cols[2],
      status,
      removalDate: cols[4],
      securityAdvisory: cols[5],
      layer: cols[6] || "—",
      pair: cols[7] || "—",
    });
  }

  return entries;
}

// ── Filesystem Scanner ───────────────────────────────────────────────────────

function walkScripts(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? walkScripts(join(dir, entry.name))
      : SCRIPT_EXTENSIONS.some((ext) => entry.name.endsWith(ext)) && entry.name !== SCRIPTS_MD_FILENAME
        ? [join(dir, entry.name)]
        : []
  );
}

function getActualScripts(): string[] {
  if (!existsSync(scriptsDir)) return [];
  return walkScripts(scriptsDir)
    .map((absPath) => relative(scriptsDir, absPath).replace(/\\/g, "/"))
    .sort();
}

// ── Drift Detection (No-op in standalone variant) ────────────────────────────
// Standalone variants have no templates/common/scripts/ directory, so there is
// no L0→L1 drift to check. This mode exits 0 for compatibility with callers
// (dev-sync.ts step 3.7, audit.ts).

function checkDriftReport(): void {
  console.log("\n=== Drift Check (Standalone Variant) ===\n");
  console.log("ℹ️  No templates/common/scripts/ directory detected — drift check is N/A.\n");
  process.exit(0);
}

// ── Verify Mode ──────────────────────────────────────────────────────────────

function verify(): boolean {
  let passed = true;
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!existsSync(scriptsMdPath)) {
    console.error(`❌ SCRIPTS.md not found at: ${scriptsMdPath}`);
    console.error(
      "   Run: bun scripts/verify-scripts.ts --generate  to create a draft"
    );
    return false;
  }

  const content = readFileSync(scriptsMdPath, "utf-8");
  const registry = parseRegistry(content);
  const actualScripts = getActualScripts();

  const registeredNames = new Set(registry.map((e) => e.script));
  const actualNames = new Set(actualScripts);

  // Check 0: Architecture compliance (.sh/.ps1 pairs and .ts orchestration)
  const shScripts = actualScripts.filter(s => s.endsWith('.sh')).map(s => s.replace('.sh', ''));
  const ps1Scripts = actualScripts.filter(s => s.endsWith('.ps1')).map(s => s.replace('.ps1', ''));
  const tsBaseNames = new Set(actualScripts.filter(s => s.endsWith('.ts')).map(s => s.replace('.ts', '')));

  for (const name of shScripts) {
    if (!ps1Scripts.includes(name)) {
      errors.push(`Missing cross-platform pair: \`${name}.ps1\` is missing for \`${name}.sh\``);
    }
  }
  for (const name of ps1Scripts) {
    if (!shScripts.includes(name)) {
      errors.push(`Missing cross-platform pair: \`${name}.sh\` is missing for \`${name}.ps1\``);
    }
  }
  for (const script of actualScripts) {
    const baseName = script.replace(/\.(sh|ps1)$/, '');
    const isOrchestrationKeyword = script.includes('lifecycle') || script.includes('verify') || script.includes('validate') || script.includes('agent-') || script.includes('dispatch');
    const isTsWrapper = !script.endsWith('.ts') && tsBaseNames.has(baseName);
    if (isOrchestrationKeyword && !script.endsWith('.ts') && !script.endsWith('.md') && !isTsWrapper) {
      errors.push(`Architecture violation: Orchestration script \`${script}\` must use Bun (.ts)`);
    }
  }

  // Check 1: Scripts on disk but not in registry
  for (const script of actualScripts) {
    if (!registeredNames.has(script)) {
      errors.push(`Unregistered script: \`${script}\` — add to SCRIPTS.md Registry`);
    }
  }

  // Check 2: Scripts in registry but not on disk
  for (const entry of registry) {
    if (!existsSync(join(scriptsDir, entry.script))) {
      errors.push(
        `Ghost entry: \`${entry.script}\` in Registry but not on disk — remove from SCRIPTS.md`
      );
    }
  }

  // Check 3: Security advisories — hard block
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of registry) {
    if (entry.securityAdvisory !== "—" && entry.securityAdvisory !== "") {
      errors.push(
        `🔒 SECURITY ADVISORY on \`${entry.script}\`: ${entry.securityAdvisory} — update or remove this script immediately`
      );
    }
  }

  // Check 4: Expired removal dates — hard block
  // Check 5: deprecated without removal-date
  for (const entry of registry) {
    if (entry.status === "deprecated" && entry.removalDate !== "—" && entry.removalDate !== "") {
      if (entry.removalDate <= today) {
        errors.push(
          `⏰ EXPIRED: \`${entry.script}\` removal-date ${entry.removalDate} has passed — delete this script and remove from Registry`
        );
      } else {
        const daysLeft = Math.ceil(
          (new Date(entry.removalDate).getTime() - new Date(today).getTime()) /
            86400000
        );
        warnings.push(
          `⚠️  DEPRECATED: \`${entry.script}\` — scheduled removal on ${entry.removalDate} (${daysLeft} days remaining)`
        );
      }
    }

    if (entry.status === "deprecated" && (entry.removalDate === "—" || entry.removalDate === "")) {
      errors.push(
        `Missing removal-date for deprecated script: \`${entry.script}\` — add YYYY-MM-DD (min 90 days)`
      );
    }

    // Check 5b: deprecated .sh/.ps1 with pair field should be thin wrappers (≤8 lines)
    if (
      entry.status === "deprecated" &&
      entry.pair !== "—" &&
      entry.pair !== "" &&
      (entry.script.endsWith(".sh") || entry.script.endsWith(".ps1"))
    ) {
      const scriptPath = join(scriptsDir, entry.script);
      if (existsSync(scriptPath)) {
        const scriptContent = readFileSync(scriptPath, "utf-8");
        const lineCount = scriptContent.split("\n").filter(l => l.trim()).length;
        if (lineCount > 8) {
          warnings.push(
            `⚠️  FAT DEPRECATED WRAPPER: \`${entry.script}\` has ${lineCount} non-empty lines — deprecated scripts with a TS pair should be thin wrappers (≤8 lines). Convert to: exec bun $SCRIPT_DIR/${entry.pair.replace('.ps1', '.ts').replace('.sh', '.ts')} "$@"`
          );
        }
      }
    }
  }

  // Check 6: pair field horizontal sync — version and status match
  const byScript = new Map(registry.map(e => [e.script, e]));
  for (const entry of registry) {
    if (entry.pair === "—" || entry.pair === "") continue;
    const pairEntry = byScript.get(entry.pair);
    if (!pairEntry) {
      warnings.push(
        `⚠️  PAIR MISSING: \`${entry.script}\` declares pair \`${entry.pair}\` but it is not in registry`
      );
      continue;
    }
    const [shMaj, shMin] = entry.version.split(".").map(Number);
    const [ps1Maj, ps1Min] = pairEntry.version.split(".").map(Number);
    if (shMaj !== ps1Maj || shMin !== ps1Min) {
      warnings.push(
        `⚠️  PAIR VERSION DRIFT: \`${entry.script}\` v${entry.version} ↔ \`${entry.pair}\` v${pairEntry.version} — consider aligning versions`
      );
    }
    if (entry.status !== pairEntry.status) {
      warnings.push(
        `⚠️  PAIR STATUS DRIFT: \`${entry.script}\` (${entry.status}) ↔ \`${entry.pair}\` (${pairEntry.status}) — statuses should match`
      );
    }
  }

  // Output
  console.log(`\n=== verify-scripts.ts (Standalone Variant) ===`);
  console.log(`Registry: ${scriptsMdPath}`);
  console.log(`Scripts dir: ${scriptsDir}\n`);

  if (warnings.length > 0) {
    for (const w of warnings) console.warn(w);
    console.log();
  }

  if (errors.length > 0) {
    for (const e of errors) console.error(`❌ ${e}`);
    console.log(`\n❌ ${errors.length} error(s) found — pre-commit blocked`);
    passed = false;
  } else {
    console.log(
      `✅ All ${registry.length} registered scripts verified (${warnings.length} warning(s))`
    );
  }

  return passed;
}

// ── Generate Mode ────────────────────────────────────────────────────────────

function generate(): void {
  const actualScripts = getActualScripts();

  if (!existsSync(scriptsMdPath)) {
    console.log(`ℹ️  SCRIPTS.md not found — generating from scratch`);
  } else {
    const existing = readFileSync(scriptsMdPath, "utf-8");
    const existingRegistry = parseRegistry(existing);
    const existingMap = new Map(existingRegistry.map((e) => [e.script, e]));

    const rows = actualScripts.map((script) => {
      const known = existingMap.get(script);
      if (known) {
        return `| \`${known.script}\` | ${known.source} | ${known.version} | ${known.status} | ${known.removalDate} | ${known.securityAdvisory} | ${known.layer} | ${known.pair} |`;
      }
      return `| \`${script}\` | — | 1.0.0 | active | — | — | — | — |`;
    });

    const header =
      "| script | source | version | status | removal-date | security-advisory | layer | pair |\n" +
      "|--------|--------|---------|--------|--------------|-------------------|-------|------|";

    const updated = existing.replace(
      /(\| script \|.*?\n\|[-| ]+\|\n)([\s\S]*?)(?=\n---|\n## )/,
      `${header}\n${rows.join("\n")}\n`
    );

    writeFileSync(scriptsMdPath, updated, "utf-8");
    console.log(
      `✅ Registry updated: ${rows.length} scripts (${actualScripts.length} on disk)`
    );
    console.log(`   Review SCRIPTS.md before committing — metadata is preserved for known scripts`);
    return;
  }

  // Fresh generate
  const rows = actualScripts
    .map(
      (s) => `| \`${s}\` | — | 1.0.0 | active | — | — | — | — |`
    )
    .join("\n");

  const draft = `# SCRIPTS.md — Script Lifecycle Registry

> Auto-generated draft. Review and fill in the Guide section before committing.

---

## Registry

| script | source | version | status | removal-date | security-advisory | layer | pair |
|--------|--------|---------|--------|--------------|-------------------|-------|------|
${rows}

---

## Guide

<!-- Add human-readable documentation for each script here -->
`;

  writeFileSync(scriptsMdPath, draft, "utf-8");
  console.log(`✅ Generated SCRIPTS.md draft with ${actualScripts.length} scripts`);
  console.log(`   Path: ${scriptsMdPath}`);
  console.log(`   Next: fill in Guide section, then commit`);
}

// ── Report Mode ──────────────────────────────────────────────────────────────

function report(): void {
  if (!existsSync(scriptsMdPath)) {
    console.error(`❌ SCRIPTS.md not found. Run --generate first.`);
    process.exit(1);
  }

  const content = readFileSync(scriptsMdPath, "utf-8");
  const registry = parseRegistry(content);
  const actual = getActualScripts();
  const registeredNames = new Set(registry.map((e) => e.script));
  const today = new Date().toISOString().slice(0, 10);

  const active = registry.filter((e) => e.status === "active");
  const deprecated = registry.filter((e) => e.status === "deprecated");
  const experimental = registry.filter((e) => e.status === "experimental");
  const unregistered = actual.filter((s) => !registeredNames.has(s));
  const advisories = registry.filter((e) => e.securityAdvisory !== "—" && e.securityAdvisory !== "");

  console.log(`\n=== Script Lifecycle Report ===`);
  console.log(`Date: ${today}`);
  console.log(`Registry: ${registry.length} entries | Disk: ${actual.length} files\n`);

  console.log(`📦 Active (${active.length})`);
  for (const e of active) console.log(`   ✅ ${e.script} v${e.version}`);

  if (deprecated.length > 0) {
    console.log(`\n⚠️  Deprecated (${deprecated.length})`);
    for (const e of deprecated) {
      const expired = e.removalDate !== "—" && e.removalDate <= today;
      const marker = expired ? "❌ EXPIRED" : "⏰";
      console.log(`   ${marker} ${e.script} — removal: ${e.removalDate}`);
    }
  }

  if (experimental.length > 0) {
    console.log(`\n🧪 Experimental (${experimental.length})`);
    for (const e of experimental) console.log(`   🔬 ${e.script} v${e.version}`);
  }

  if (advisories.length > 0) {
    console.log(`\n🔒 Security Advisories (${advisories.length})`);
    for (const e of advisories) console.log(`   🚨 ${e.script}: ${e.securityAdvisory}`);
  }

  if (unregistered.length > 0) {
    console.log(`\n❓ Unregistered on disk (${unregistered.length})`);
    for (const s of unregistered) console.log(`   ➕ ${s}`);
  }

  console.log();
}

// ── Entry Point ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes("--generate")) {
  generate();
} else if (args.includes("--report")) {
  report();
} else if (args.includes("--check-drift")) {
  checkDriftReport();
} else if (args.includes("--verify") || args.length === 0) {
  const ok = verify();
  if (import.meta.main) {
    process.exit(ok ? 0 : 1);
  }
} else {
  console.error(`Usage: bun scripts/verify-scripts.ts [--verify | --generate | --report | --check-drift]`);
  if (import.meta.main) {
    process.exit(1);
  }
}
