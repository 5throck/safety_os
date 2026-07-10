/**
 * Archives memory markdown files older than 7 days.
 * @version 1.1.2
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

const memoryDir = 'memory';
const archiveDir = path.join(memoryDir, 'archive');

fs.mkdirSync(archiveDir, { recursive: true });

const files = fs.readdirSync(memoryDir);
const today = new Date();
today.setHours(0, 0, 0, 0);

for (const file of files) {
    if (!file.endsWith('.md')) continue;
    if (file === 'MEMORY.md') continue;

    const fullPath = path.join(memoryDir, file);
    if (fs.statSync(fullPath).isDirectory()) continue;

    const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2})\.md$/);
    let fileDate: Date;
    if (dateMatch) {
        fileDate = new Date(dateMatch[1] + 'T00:00:00');
    } else {
        fileDate = fs.statSync(fullPath).mtime;
    }
    
    const diffTime = today.getTime() - fileDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    
    if (diffDays > 7) {
        const dest = path.join(archiveDir, file);
        if (fs.existsSync(dest)) {
            console.error(`ERROR: ${file} already exists in archive — not overwriting.`);
            process.exit(1);
        }
        // Use copyFileSync + unlinkSync instead of renameSync to avoid
        // EXDEV cross-device link errors on Windows (SMB mounts, WSL, etc.)
        try {
            fs.copyFileSync(fullPath, dest);
            fs.unlinkSync(fullPath);
            console.log(`Archived ${file}`);
        } catch (e) {
            console.error(`ERROR: Failed to archive ${file}: ${e}`);
            // If copy succeeded but unlink failed, the file exists in both locations.
            // Do not exit — the archive copy is preserved; the original can be cleaned up manually.
        }
    }
}
