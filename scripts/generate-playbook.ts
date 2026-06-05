/**
 * @version 1.0.0
 * Generates the v4.0 Safety OS Playbook from blueprints, industry profiles, workflows, and regulations.
 */

import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import { join, basename, extname } from "path";
import { existsSync } from "fs";

const WORKSPACE_ROOT = join(__dirname, "..");
const OUTPUT_DIR = join(WORKSPACE_ROOT, "docs");

// Helper: Format date to YYYY-MM-DD
function getFormattedDate(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function getSortedMarkdownFiles(dirPath: string): Promise<string[]> {
  if (!existsSync(dirPath)) return [];
  const entries = await readdir(dirPath, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name)
    .sort()
    .map((f) => join(dirPath, f));
}

function parseYamlBasic(content: string) {
  const result: any = { name: "", psm_required: false, core_regulations: [] };
  
  const lines = content.split(/\r?\n/);
  let inCoreRegs = false;
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    // name
    const nameMatch = line.match(/^name:\s*(.+)/);
    if (nameMatch) {
      result.name = nameMatch[1].replace(/['"]/g, '').trim();
      inCoreRegs = false;
      continue;
    }
    
    // psm_required
    const psmMatch = line.match(/^psm_required:\s*(true|false)/i);
    if (psmMatch) {
      result.psm_required = psmMatch[1].toLowerCase() === 'true';
      inCoreRegs = false;
      continue;
    }
    
    // core_regulations
    if (line.match(/^core_regulations:/)) {
      inCoreRegs = true;
      continue;
    }
    
    if (inCoreRegs) {
      const listItemMatch = line.match(/^\s*-\s*(.+)/);
      if (listItemMatch) {
        result.core_regulations.push(listItemMatch[1].replace(/['"]/g, '').trim());
      } else if (line.match(/^\w/)) {
        inCoreRegs = false; // another top level key
      }
    }
  }
  
  return result;
}

async function readIndustryProfiles(): Promise<string> {
  const profilesDir = join(WORKSPACE_ROOT, "industry-profiles");
  if (!existsSync(profilesDir)) return "";

  let output = "## Industry Profile Summary\n\n";
  output += "| Industry | PSM Required | Core Regulations |\n";
  output += "|---|---|---|\n";

  const entries = await readdir(profilesDir, { withFileTypes: true });
  const yamlFiles = entries
    .filter((e) => e.isFile() && (e.name.endsWith(".yaml") || e.name.endsWith(".yml")))
    .map((e) => e.name)
    .sort();

  for (const file of yamlFiles) {
    const content = await readFile(join(profilesDir, file), "utf-8");
    try {
      const parsed = parseYamlBasic(content);
      const name = parsed.name || basename(file, extname(file));
      const psm = parsed.psm_required ? "Yes" : "No";
      const coreRegs = parsed.core_regulations && parsed.core_regulations.length > 0 
        ? parsed.core_regulations.join(", ") 
        : "";
      output += `| ${name} | ${psm} | ${coreRegs} |\n`;
    } catch (e) {
      console.warn(`Failed to parse YAML: ${file}`);
    }
  }

  return output + "\n";
}

async function readWorkflows(): Promise<string> {
  const workflowsDir = join(WORKSPACE_ROOT, "workflows");
  if (!existsSync(workflowsDir)) return "";

  let output = "## Complete Workflow Index\n\n";
  const subdirs = ["daily", "compliance", "emergency"];

  for (const subdir of subdirs) {
    const indexPath = join(workflowsDir, subdir, "_INDEX.md");
    if (existsSync(indexPath)) {
      output += `### ${subdir.charAt(0).toUpperCase() + subdir.slice(1)} Workflows\n\n`;
      const content = await readFile(indexPath, "utf-8");
      output += content.trim() + "\n\n";
    }
  }

  return output;
}

async function readRegulations(): Promise<string> {
  const registryPath = join(WORKSPACE_ROOT, "regulations", "_REGISTRY.md");
  if (!existsSync(registryPath)) return "";

  let output = "## Regulation Registry\n\n";
  const content = await readFile(registryPath, "utf-8");
  output += content.trim() + "\n\n";

  return output;
}

async function generatePlaybook() {
  console.log("Generating Safety OS Playbook...");
  const dateStr = getFormattedDate();
  const outputPath = join(OUTPUT_DIR, `v4.0-playbook-${dateStr}.md`);

  if (!existsSync(OUTPUT_DIR)) {
    await mkdir(OUTPUT_DIR, { recursive: true });
  }

  let playbookContent = `# Safety OS Playbook v4.0\n\n`;

  // 1. Read and append all .md files in docs/blueprint/ (excluding appendix)
  const blueprintDir = join(WORKSPACE_ROOT, "docs", "blueprint");
  const blueprintFiles = await getSortedMarkdownFiles(blueprintDir);
  for (const file of blueprintFiles) {
    const content = await readFile(file, "utf-8");
    playbookContent += content.trim() + "\n\n";
  }

  // 2. Append Industry Profile Summary
  playbookContent += await readIndustryProfiles();

  // 3. Append Complete Workflow Index
  playbookContent += await readWorkflows();

  // 4. Append Regulation Registry
  playbookContent += await readRegulations();

  // 5. Append Appendices
  const appendixDir = join(blueprintDir, "appendix");
  const appendixFiles = await getSortedMarkdownFiles(appendixDir);
  if (appendixFiles.length > 0) {
    playbookContent += "## Appendices\n\n";
    for (const file of appendixFiles) {
      const content = await readFile(file, "utf-8");
      playbookContent += content.trim() + "\n\n";
    }
  }

  await writeFile(outputPath, playbookContent.trim() + "\n", "utf-8");
  console.log(`Playbook generated successfully at: ${outputPath}`);
}

generatePlaybook().catch((err) => {
  console.error("Error generating playbook:", err);
  process.exit(1);
});
