#!/usr/bin/env bun
/**
 * verify-scripts.ts — Script Lifecycle Registry Verifier
 * @version 1.1.0
 *
 * Validates that scripts/SCRIPTS.md Registry is in sync with actual script files,
 * enforces deprecation removal dates, and blocks on security advisories.
 *
 * Usage:
 *   bun scripts/verify-scripts.ts --verify       # CI / pre-commit: fail on drift; reads scripts/SCRIPTS.md
 *   bun scripts/verify-scripts.ts --generate    # Generate Registry draft from filesystem
 *   bun scripts/verify-scripts.ts --report      # Human-readable status report
 *   bun scripts/verify-scripts.ts --check-drift # Detect scripts in package.json missing from scripts/ directory
 *
 * Exit codes:
 *   0 = all checks passed
 *   1 = drift, expired removal date, or active security advisory detected
 */

import * as fs from "fs";
import { readFileSync, readdirSync, existsSync, writeFileSync } from "fs";
import { join, dirname, relative } from "path";

// ── Configuration ────────────────────────────────────────────────────────────

const SCRIPT_EXTENSIONS = [".ts"];
const SCRIPTS_MD_FILENAME = "SCRIPTS.md";

// Resolve workspace root from cwd
function findWorkspaceRoot(startDir: string): string {
  let dir = startDir;
  for (let i = 0; i < 6; i++) {
    if (existsSync(join(dir, "AGENTS.md")) || existsSync(join(dir, "CONSTITUTION.md"))) return dir;
    dir = dirname(dir);
  }
  return process.cwd();
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
  removalDate: string;
  securityAdvisory: string;
  drift: string;
  pair: string;
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
      drift: cols[6] ?? "—",
      pair: cols[7] ?? "—",
    });
  }

  return entries;
}

// ── Filesystem Scanner ───────────────────────────────────────────────────────

function walkScripts(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? entry.name === "node_modules"
        ? []
        : walkScripts(join(dir, entry.name))
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

// ── Verify Mode ──────────────────────────────────────────────────────────────

function verify(): boolean {
  let passed = true;
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!existsSync(scriptsMdPath)) {
    console.error(`❌ SCRIPTS.md not found at: ${scriptsMdPath}`);
    return false;
  }

  const content = readFileSync(scriptsMdPath, "utf-8");
  const registry = parseRegistry(content);
  const actualScripts = getActualScripts();

  const registeredNames = new Set(registry.map((e) => e.script));

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
  for (const entry of registry) {
    if (entry.securityAdvisory !== "—" && entry.securityAdvisory !== "") {
      errors.push(
        `SECURITY ADVISORY on \`${entry.script}\`: ${entry.securityAdvisory} — update or remove this script immediately`
      );
    }
  }

  // Check 4: Expired removal dates — hard block
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of registry) {
    if (entry.status === "deprecated" && entry.removalDate !== "—" && entry.removalDate !== "") {
      if (entry.removalDate <= today) {
        errors.push(
          `EXPIRED: \`${entry.script}\` removal-date ${entry.removalDate} has passed — delete this script`
        );
      } else {
        const daysLeft = Math.ceil(
          (new Date(entry.removalDate).getTime() - new Date(today).getTime()) / 86400000
        );
        warnings.push(
          `DEPRECATED: \`${entry.script}\` — scheduled removal on ${entry.removalDate} (${daysLeft} days remaining)`
        );
      }
    }

    if (entry.status === "deprecated" && (entry.removalDate === "—" || entry.removalDate === "")) {
      errors.push(
        `Missing removal-date for deprecated script: \`${entry.script}\` — add YYYY-MM-DD (min 90 days)`
      );
    }
  }

  // Output
  console.log(`\n=== verify-scripts.ts ===`);
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

// ── Entry Point ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes("--verify") || args.length === 0) {
  const ok = verify();
  process.exit(ok ? 0 : 1);
} else {
  console.error(`Usage: bun scripts/verify-scripts.ts [--verify]`);
  process.exit(1);
}
