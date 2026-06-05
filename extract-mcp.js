const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const targetDir = 'C:\\Users\\USER\\.gemini\\antigravity-cli\\mcp\\korean-law';
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const child = spawn('npx.cmd', ['-y', 'korean-law-mcp@latest'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

let buffer = '';

child.stdout.on('data', (data) => {
  buffer += data.toString();
  // Try to parse the buffer line by line
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; // Keep the last incomplete line

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const msg = JSON.parse(line);
      if (msg.id === 1 && msg.result && msg.result.tools) {
        msg.result.tools.forEach(tool => {
          const schemaPath = path.join(targetDir, `${tool.name}.json`);
          const schemaContent = JSON.stringify({
            name: tool.name,
            description: tool.description || '',
            parameters: tool.inputSchema
          }, null, 2);
          fs.writeFileSync(schemaPath, schemaContent);
          console.log(`Saved ${tool.name}.json`);
        });
        
        console.log('Successfully saved schemas.');
        child.kill();
        process.exit(0);
      }
    } catch (e) {
      // Ignore parse errors from non-JSON output
    }
  }
});

const req = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
};

child.stdin.write(JSON.stringify(req) + '\n');

setTimeout(() => {
  console.log('Timeout waiting for response.');
  child.kill();
  process.exit(1);
}, 15000);
