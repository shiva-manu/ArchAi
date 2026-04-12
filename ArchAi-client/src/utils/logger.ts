/**
 * Structured logging utility.
 * Only outputs to console in development mode.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel = import.meta.env.DEV ? 'debug' : 'warn';
const PREFIX = '[ArchAi]';

function log(level: LogLevel, message: string, data?: unknown) {
  if (LOG_LEVELS[level] < LOG_LEVELS[MIN_LEVEL]) return;

  const timestamp = new Date().toISOString();
  const formatted = `${PREFIX} [${level.toUpperCase()}] ${timestamp} — ${message}`;

  switch (level) {
    case 'debug':
      // eslint-disable-next-line no-console
      console.debug(formatted, data ?? '');
      break;
    case 'info':
      // eslint-disable-next-line no-console
      console.info(formatted, data ?? '');
      break;
    case 'warn':
      // eslint-disable-next-line no-console
      console.warn(formatted, data ?? '');
      break;
    case 'error':
      // eslint-disable-next-line no-console
      console.error(formatted, data ?? '');
      break;
  }
}

export const logger = {
  debug: (message: string, data?: unknown) => log('debug', message, data),
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
};
