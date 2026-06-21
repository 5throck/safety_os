#!/usr/bin/env bun
// @version 1.4.1
/**
 * Markdown Language Validation Script with I18N Support
 *
 * Policy: Official documents and governance files must contain English sentences.
 * Validates only allowlisted paths: agents/, AGENTS.md, CLAUDE.md, GEMINI.md,
 * CONSTITUTION.md, CHANGELOG.md, docs/constitution/, docs/governance/, skills/,
 * .claude/skills/, .gemini/skills/, .claude/commands/, .gemini/commands/,
 * templates/, and SECURITY.md.
 *
 * Excludes: memory/ logs, docs/_meta/superpowers/, docs/adr/, locale-specific files
 * for all supported I18N languages, and node_modules/.git directories.
 *
 * Locale-only content in excluded paths is acceptable. Mixed-language content
 * is acceptable in all paths.
 *
 * Korean Default Policy Exception:
 * - Layer C (workflows/, docs/ operational docs): Korean is allowed by default
 * - Layer A (governance files): Korean statute citations are allowed via glossary
 *   The glossary at regulations/KR/legal-glossary.yaml provides the canonical
 *   allowlist of Korean statute names. Statute citations (e.g., "산업안전보건법 제36조")
 *   are permitted in Layer A files; other Korean prose is not allowed.
 *
 * Reference: CONSTITUTION.md §3 - Mandatory English Git & PR Artifacts
 *            CONSTITUTION.md §4 - Internationalization (I18N)
 *            CLAUDE.md §4 - Language Policy for Documentation
 *
 * Usage: bun run scripts/validate-md-language.ts
 * Exit codes: 0 (pass), 1 (violation found)
 */

import { readFileSync } from "fs";
import { join, dirname } from "node:path";
import * as yaml from "js-yaml";

/**
 * Supported locale codes are loaded from docs/workspace-schema.json (i18n.locale_codes).
 * To add a new locale: update docs/workspace-schema.json — do NOT hardcode here.
 * Falls back to a built-in list if the schema file is unavailable.
 */
// Read locale codes from workspace-schema.json (SSOT for i18n policy)
// Falls back to a minimal default if schema is unavailable
function loadSupportedLocales(): string[] {
  try {
    const schemaPath = join(dirname(import.meta.path), '..', 'docs', 'workspace-schema.json');
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
    const codes = schema?.i18n?.locale_codes;
    if (Array.isArray(codes) && codes.length > 0) return codes;
  } catch {
    // fall through to default
  }
  // Fallback: minimal set if schema unavailable
  return ['ko', 'ja', 'zh-CN', 'zh-TW', 'de', 'es', 'fr', 'pt', 'vi', 'ms', 'id', 'th', 'ru', 'it', 'ar'];
}

const SUPPORTED_LOCALES: string[] = loadSupportedLocales();

/**
 * Load Korean statute names from legal-glossary.yaml for citation allowlist
 * The statutes map keys are the canonical Korean statute names (e.g., 산업안전보건법)
 */
function loadStatuteGlossary(): Set<string> {
  try {
    const glossaryPath = join(dirname(import.meta.path), '..', 'regulations', 'KR', 'legal-glossary.yaml');
    const glossary = yaml.load(readFileSync(glossaryPath, 'utf-8')) as any;
    const statutes = glossary?.statutes;

    if (!statutes || typeof statutes !== 'object') {
      console.error('❌ Error: statutes object not found in legal-glossary.yaml');
      process.exit(1);
    }

    const statuteNames = Object.keys(statutes);
    console.log(`📚 Loaded ${statuteNames.length} Korean statute names from legal-glossary.yaml`);
    return new Set(statuteNames);
  } catch (error) {
    console.error('❌ Error loading legal-glossary.yaml:', error);
    console.error('The validator requires the legal glossary to distinguish statute citations from other Korean text.');
    process.exit(1);
  }
}

const STATUTE_GLOSSARY: Set<string> = loadStatuteGlossary();

// Korean character range (Hangul syllables and jamo)
const KOREAN_PATTERN = /[가-힯ᄀ-ᇿ]/;

// Citation/particle characters allowed in statute citations (제36조, Article 36, etc.)
const CITATION_PATTERN = /[제조의및등\d\s\(\)\[\]\.ArticleArt]/g;

// English sentence pattern (requires letters, spaces, and sentence punctuation)
const ENGLISH_SENTENCE_PATTERN = /[A-Za-z][A-Za-z\s,;\.!\?]{10,}/;

interface Violation {
  file: string;
  reason: string;
}

/**
 * Check if file path is an OFFICIAL document that requires English validation
 *
 * Only validates these allowlisted paths:
 * - agents/ (subdirectories)
 * - AGENTS.md, CLAUDE.md, GEMINI.md, CONSTITUTION.md, CHANGELOG.md, SECURITY.md
 * - docs/constitution/ (subdirectories)
 * - docs/governance/ (subdirectories)
 * - skills/ (subdirectories)
 * - .claude/skills/, .claude/commands/ (subdirectories)
 * - .gemini/skills/, .gemini/commands/ (subdirectories)
 * - templates/ (subdirectories)
 */
function isOfficialDocument(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, "/");

  // Allowlisted official paths
  const officialPatterns = [
    /^agents\/.*\.md$/,
    /^AGENTS\.md$/,
    /^CLAUDE\.md$/,
    /^GEMINI\.md$/,
    /^CONSTITUTION\.md$/,
    /^CHANGELOG\.md$/,
    /^SECURITY\.md$/,
    /^docs\/constitution\/.*\.md$/,
    /^docs\/governance\/.*\.md$/,
    /^skills\/.*\.md$/,
    /^\.claude\/skills\/.*\.md$/,
    /^\.claude\/commands\/.*\.md$/,
    /^\.gemini\/skills\/.*\.md$/,
    /^\.gemini\/commands\/.*\.md$/,
    /^templates\/.*\.md$/,
  ];

  return officialPatterns.some(pattern => pattern.test(normalizedPath));
}

/**
 * Check if file path is a locale-specific path for any supported I18N language.
 * Dynamically built from SUPPORTED_LOCALES to support extensibility.
 */
function isI18nLocalePath(filePath: string): boolean {
  const normalized = filePath.replace(/\\/g, "/");
  return SUPPORTED_LOCALES.some(locale => {
    return (
      normalized.endsWith(`_${locale}.md`) ||        // README_ko.md
      normalized.endsWith(`-${locale}.md`) ||        // README-ko.md
      normalized.endsWith(`.${locale}.md`) ||        // README.ko.md
      normalized.startsWith(`${locale}/`) ||         // ko/...
      normalized.includes(`/${locale}/`) ||          // .../ko/...
      normalized.startsWith(`locales/${locale}/`) || // locales/ko/...
      normalized.includes(`/locales/${locale}/`)     // .../locales/ko/...
    );
  });
}

/**
 * Check if file path should be explicitly excluded (locale files, infrastructure)
 */
function isExcludedPath(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, "/");

  // I18N: exclude locale-specific files and directories for all supported languages
  if (isI18nLocalePath(normalizedPath)) {
    return true;
  }

  // Exclude planning/draft docs (locale-only content is acceptable here)
  if (normalizedPath.startsWith("docs/_meta/superpowers/") ||
      normalizedPath.startsWith("docs/adr/")) {
    return true;
  }

  return false;
}

/**
 * Check if a Korean text run is a statute citation (allowed in Layer A files)
 *
 * Algorithm:
 * 1. Extract Korean text runs from the content
 * 2. For each run, check if it consists only of:
 *    - Glossary statute names (substring match)
 *    - Citation/particle characters (제, 조, 의, 및, 등, digits, spaces, parentheses)
 *    - English (Article, Art, abbreviations)
 * 3. Remove statute names and citation characters; if no Korean syllables remain → it's a citation
 * 4. If residual Korean syllables remain → it's prose (violation in Layer A)
 */
function isStatuteCitation(text: string): boolean {
  // Find all Korean runs in the text
  const koreanRuns = text.match(/[가-힯ᄀ-ᇿ]+(?:[^\s\w가-힯ᄀ-ᇿ]*[가-힯ᄀ-ᇿ]+)*/g) || [];

  for (const run of koreanRuns) {
    let residual = run;

    // Remove glossary statute names (substring match - statute names are the anchor)
    for (const statuteName of STATUTE_GLOSSARY) {
      if (residual.includes(statuteName)) {
        residual = residual.replace(statuteName, '');
      }
    }

    // Remove citation/particle characters and English
    residual = residual.replace(CITATION_PATTERN, '');

    // If any Korean syllables remain after stripping statute names and citation characters,
    // this is Korean prose (not a pure statute citation)
    if (KOREAN_PATTERN.test(residual)) {
      return false; // Found non-citation Korean content
    }
  }

  return true; // All Korean runs are statute citations
}

/**
 * Analyze file content for language violations
 */
function analyzeFile(filePath: string): Violation | null {
  try {
    const content = readFileSync(filePath, "utf-8");

    // Remove code blocks and inline code from analysis
    const contentWithoutCode = content.replace(/```[\s\S]*?```/g, "")
      .replace(/`[^`]+`/g, "")
      .replace(/\[[^\]]+\]\([^)]+\)/g, ""); // Remove markdown links

    // Check for Korean characters
    const hasKorean = KOREAN_PATTERN.test(contentWithoutCode);

    // Check for English sentences
    const hasEnglish = ENGLISH_SENTENCE_PATTERN.test(contentWithoutCode);

    // Violation: Korean-only content (has Korean but no English)
    if (hasKorean && !hasEnglish) {
      // Exception: Korean statute citations are allowed in Layer A files
      if (isStatuteCitation(contentWithoutCode)) {
        return null; // This is a statute citation, not a violation
      }

      return {
        file: filePath,
        reason: "Korean-only content detected (no English sentences found)"
      };
    }

    return null;
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

/**
 * Main validation function
 */
async function validateMarkdownLanguage(): Promise<void> {
  console.log("🔍 Scanning for Korean-only markdown files...\n");

  // Find all .md files using Bun's built-in Glob API
  const globber = new Bun.Glob("**/*.md");
  const allFiles = await Array.fromAsync(globber.scan({ cwd: process.cwd(), onlyFiles: true }));
  const mdFiles = allFiles.filter((f) => {
    const normalized = f.replace(/\\/g, "/");
    return !normalized.includes("node_modules/") &&
           !normalized.includes(".git/") &&
           !normalized.includes("dist/") &&
           !normalized.includes("build/");
  });

  const violations: Violation[] = [];
  let officialCount = 0;

  for (const file of mdFiles) {
    // Skip excluded paths (locales, planning docs)
    if (isExcludedPath(file)) {
      continue;
    }

    // Only validate official documents
    if (!isOfficialDocument(file)) {
      continue;
    }

    officialCount++;
    const violation = analyzeFile(file);
    if (violation) {
      violations.push(violation);
    }
  }

  // Report results
  if (violations.length === 0) {
    console.log("✅ No language-only violations in official documents.\n");
    console.log(`   Scanned ${officialCount} official markdown files (agents, governance, skills, templates)`);
    console.log(`   I18N locale files excluded: ${SUPPORTED_LOCALES.length} language codes (${SUPPORTED_LOCALES.join(", ")})`);
    process.exit(0);
  } else {
    console.log(`❌ Found ${violations.length} Korean-only violation(s) in official documents:\n`);
    violations.forEach((v) => {
      console.log(`   📄 ${v.file}`);
      console.log(`      Reason: ${v.reason}\n`);
    });
    console.log("Policy: Official documents (agents, governance, skills, templates, etc.) must contain English sentences.");
    console.log("See: CONSTITUTION.md §3 - Mandatory English Git & PR Artifacts\n");
    process.exit(1);
  }
}

// Run validation
validateMarkdownLanguage().catch((error) => {
  console.error("Validation error:", error);
  process.exit(1);
});
