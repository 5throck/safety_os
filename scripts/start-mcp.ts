/**
 * @version 1.0.0
 * Scripts to spawn local MCP servers via stdio
 */
import { spawn } from "child_process";
import path from "path";

const servers = [
  "vendor/k-skill/index.ts",
  "vendor/legalize-kr/index.ts",
  "vendor/mcp-kr-legislation/index.ts"
];

console.log("Starting mock MCP servers...");

for (const server of servers) {
  const fullPath = path.resolve(process.cwd(), server);
  
  // Using bun to run the typescript files
  const child = spawn("bun", ["run", fullPath], {
    // MCP servers communicate over stdin/stdout, so we might want to map them appropriately
    // But for a simple start script that runs them together, we might just inherit or pipe.
    stdio: "inherit"
  });

  child.on("error", (err) => {
    console.error(`[${server}] Failed to start:`, err);
  });

  child.on("exit", (code) => {
    console.log(`[${server}] Exited with code ${code}`);
  });
}
