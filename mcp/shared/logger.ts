type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const LEVELS: Record<LogLevel, number> = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
const currentLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'INFO';

function log(level: LogLevel, serverName: string, message: string): void {
  if (LEVELS[level] >= LEVELS[currentLevel]) {
    process.stderr.write(`[${level}][${serverName}] ${message}\n`);
  }
}

export function createLogger(serverName: string) {
  return {
    debug: (msg: string) => log('DEBUG', serverName, msg),
    info:  (msg: string) => log('INFO',  serverName, msg),
    warn:  (msg: string) => log('WARN',  serverName, msg),
    error: (msg: string) => log('ERROR', serverName, msg),
  };
}
