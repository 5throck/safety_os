#!/usr/bin/env bun
// @version 1.3.1
// sync-md.ts - Update memory/MEMORY.md index
// Usage:
//   bun run scripts/sync-md.ts "YYYY-MM-DD" "summary"              # session entry
//   bun run scripts/sync-md.ts "YYYY-MM-DD" "summary" --meeting    # meeting entry
//   bun run scripts/sync-md.ts "YYYY-MM-DD" "summary" --adr "ID"   # ADR entry

const args = process.argv.slice(2);

const date: string = args[0] ?? (() => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
})();
const summary: string = args[1] ?? 'update';

let type: 'session' | 'meeting' | 'adr' = 'session';
let adrId: string = '';

for (let i = 2; i < args.length; i++) {
  if (args[i] === '--meeting') type = 'meeting';
  else if (args[i] === '--adr') type = 'adr';
  else if (args[i].startsWith('ADR-')) adrId = args[i];
}

const MEMORY_FILE = 'memory/MEMORY.md';

const INIT_CONTENT = `# Memory Index

## Sessions

| Date | Summary |
|------|---------|

## Meetings

| Date | Topic | File |
|------|-------|------|

## ADRs

| ID | Title | Status | File |
|----|-------|--------|------|
`;

// ── Initialize MEMORY.md with 3-section structure if missing ─────────────────
const file = Bun.file(MEMORY_FILE);
let exists = await file.exists();
if (!exists) {
  await Bun.write(MEMORY_FILE, INIT_CONTENT);
}

let content = await Bun.file(MEMORY_FILE).text();

// ── Migrate legacy flat index if no ## Sessions section ──────────────────────
if (!content.includes('## Sessions')) {
  // Prepend Sessions section after # Memory Index heading
  content = content.replace(/(# Memory Index\r?\n)/, '$1\n## Sessions\n\n');
  content = content + `
## Meetings

| Date | Topic | File |
|------|-------|------|

## ADRs

| ID | Title | Status | File |
|----|-------|--------|------|
`;
  await Bun.write(MEMORY_FILE, content);
  content = await Bun.file(MEMORY_FILE).text();
}

// ── Self-heal: repair table structures if headers/separators are missing ──────
// All repairs operate on the in-memory content to avoid redundant I/O.
// Single write at the end of the self-heal block.
let healed = false;

if (!/\n## Sessions\r?\n\r?\n\| Date \|/.test(content)) {
  content = content.replace(
    /(## Sessions\r?\n)([\s\S]*?)(\n## Meetings)/,
    `$1\n| Date | Summary |\n|------|---------|\n$3`
  );
  healed = true;
}

if (!/\n## Meetings\r?\n\r?\n\| Date \|/.test(content)) {
  content = content.replace(
    /(## Meetings\r?\n)([\s\S]*?)(\n## ADRs)/,
    `$1\n| Date | Topic | File |\n|------|-------|------|\n$3`
  );
  healed = true;
}

if (!/\n## ADRs\r?\n\r?\n\| ID \|/.test(content)) {
  content = content.replace(
    /(## ADRs\r?\n)([\s\S]*?)$/,
    `$1\n| ID | Title | Status | File |\n|----|-------|--------|------|`
  );
  healed = true;
}

if (healed) {
  await Bun.write(MEMORY_FILE, content);
  content = await Bun.file(MEMORY_FILE).text();
}

// ── Append to appropriate section ────────────────────────────────────────────
function makeSlug(str: string, maxLen: number): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/-$/, '')
    .substring(0, maxLen);
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

if (type === 'meeting') {
  const slug = makeSlug(summary, 40);
  const meetingFile = `meeting-${date}-${slug}.md`;
  // Only insert if not already present (dedup by date + summary in same table row)
  if (!new RegExp(`\\| ${escapeRegex(date)} \\| ${escapeRegex(summary)} \\|`).test(content)) {
    // Insert row after the separator line of the ## Meetings table
    content = content.replace(
      /(## Meetings\r?\n\r?\n\| Date \|[^\n]+\r?\n\|[-| ]+\|)/,
      `$1\n| ${date} | ${summary} | [${meetingFile}](${meetingFile}) |`
    );
    await Bun.write(MEMORY_FILE, content);
  }
} else if (type === 'adr') {
  const slug = makeSlug(summary, 50);
  const id = adrId || 'ADR-XXXX';
  const adrFile = `${id}-${slug}.md`;
  // Only insert if not already present (dedup by id + summary in same table row)
  if (!new RegExp(`\\| ${escapeRegex(id)} \\| ${escapeRegex(summary)} \\|`).test(content)) {
    content = content.replace(
      /(## ADRs\r?\n\r?\n\| ID \|[^\n]+\r?\n\|[-| ]+\|)/,
      `$1\n| ${id} | ${summary} | Accepted | [${adrFile}](${adrFile}) |`
    );
    await Bun.write(MEMORY_FILE, content);
  }
} else {
  // Session: dedup by date (scoped to Sessions table to avoid false positives)
  if (!new RegExp(`\\| \\[${escapeRegex(date)}\\]`).test(content)) {
    content = content.replace(
      /(## Sessions\r?\n\r?\n\| Date \|[^\n]+\r?\n\|[-| ]+\|)/,
      `$1\n| [${date}](${date}.md) | ${summary} |`
    );
    await Bun.write(MEMORY_FILE, content);
  }
}
