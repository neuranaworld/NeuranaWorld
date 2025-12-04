/**
 * Logging utility for the application
 * Provides structured logging with different levels
 */

const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

const isDevelopment = import.meta.env.DEV;

class Logger {
  log(level, message, data = null) {
    if (!isDevelopment && level === LOG_LEVELS.DEBUG) {
      return; // Skip debug logs in production
    }

    const timestamp = new Date().toISOString();
    const logData = data ? { message, data, timestamp } : { message, timestamp };

    switch (level) {
      case LOG_LEVELS.ERROR:
        console.error(`[ERROR] ${timestamp}:`, message, data || '');
        break;
      case LOG_LEVELS.WARN:
        console.warn(`[WARN] ${timestamp}:`, message, data || '');
        break;
      case LOG_LEVELS.INFO:
        if (isDevelopment) {
          console.info(`[INFO] ${timestamp}:`, message, data || '');
        }
        break;
      case LOG_LEVELS.DEBUG:
        if (isDevelopment) {
          console.log(`[DEBUG] ${timestamp}:`, message, data || '');
        }
        break;
      default:
        console.log(message, data || '');
    }
  }

  error(message, data) {
    this.log(LOG_LEVELS.ERROR, message, data);
  }

  warn(message, data) {
    this.log(LOG_LEVELS.WARN, message, data);
  }

  info(message, data) {
    this.log(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data) {
    this.log(LOG_LEVELS.DEBUG, message, data);
  }
}

export const logger = new Logger();
export default logger;
