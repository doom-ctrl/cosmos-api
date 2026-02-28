type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  method: string;
  path: string;
  status?: number;
  duration?: number;
  ip?: string;
  error?: string;
}

class Logger {
  private formatEntry(entry: LogEntry): string {
    const { timestamp, level, method, path, status, duration, ip, error } = entry;
    const parts = [
      timestamp,
      `[${level.toUpperCase()}]`,
      method,
      path,
    ];
    
    if (status) parts.push(`${status}`);
    if (duration) parts.push(`${duration}ms`);
    if (ip) parts.push(`[${ip}]`);
    if (error) parts.push(`- ${error}`);
    
    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      method: '',
      path: '',
      ...meta,
    };

    const formatted = this.formatEntry(entry);
    
    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.log(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }
  }

  debug(message: string, meta?: Record<string, any>) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, any>) {
    this.log('error', message, meta);
  }

  request(method: string, path: string, status: number, duration: number, ip?: string) {
    this.info(`${method} ${path}`, {
      method,
      path,
      status,
      duration,
      ip,
    });
  }
}

export const logger = new Logger();
