/**
 * Structured logger for IAs Academy API.
 *
 * Outputs JSON-formatted log lines in production for easy parsing by
 * log aggregation services (Vercel, Datadog, etc.).
 * Falls back to pretty console output in development.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Course created', { courseId: 'abc', userId: 'xyz' });
 *   logger.error('Failed to create course', { error, input: body });
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  [key: string]: unknown;
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function formatError(err: unknown): Record<string, unknown> {
  if (err instanceof Error) {
    return {
      errorName: err.name,
      errorMessage: err.message,
      stack: IS_PRODUCTION ? undefined : err.stack,
    };
  }
  return { errorValue: String(err) };
}

function log(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  // Normalize error objects in meta
  if (meta?.error) {
    Object.assign(entry, formatError(meta.error));
    delete entry.error;
  }

  if (IS_PRODUCTION) {
    // JSON for log aggregation
    const output = JSON.stringify(entry);
    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  } else {
    // Pretty output for dev
    const prefix = {
      debug: '🔍',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
    }[level];

    const metaStr = meta
      ? '\n  ' + Object.entries(meta)
          .filter(([k]) => k !== 'error')
          .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
          .join('\n  ')
      : '';

    const errorStr = meta?.error ? `\n  ${formatError(meta.error).errorMessage}` : '';

    console[level === 'debug' ? 'log' : level](
      `${prefix} [${level.toUpperCase()}] ${message}${metaStr}${errorStr}`
    );
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => log('debug', message, meta),
  info: (message: string, meta?: Record<string, unknown>) => log('info', message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => log('warn', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => log('error', message, meta),
};
