// Simple logger utility for the application
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, unknown>
  stack?: string
}

class Logger {
  private minLevel: LogLevel
  private serviceName: string

  constructor(serviceName: string, minLevel: LogLevel = LogLevel.INFO) {
    this.serviceName = serviceName
    this.minLevel = minLevel
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG]
    return levels.indexOf(level) <= levels.indexOf(this.minLevel)
  }

  private formatLog(entry: LogEntry): string {
    const baseLog = `[${entry.timestamp}] [${this.serviceName}] [${entry.level}] ${entry.message}`

    if (entry.metadata) {
      return `${baseLog} ${JSON.stringify(entry.metadata)}`
    }

    return baseLog
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    }

    if (error?.stack) {
      entry.stack = error.stack
    }

    const formattedLog = this.formatLog(entry)

    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog)
        break
      case LogLevel.WARN:
        console.warn(formattedLog)
        break
      case LogLevel.INFO:
        console.info(formattedLog)
        break
      case LogLevel.DEBUG:
        console.debug(formattedLog)
        break
      default:
        console.log(formattedLog)
    }
  }

  error(message: string, metadata?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.ERROR, message, metadata, error)
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, metadata)
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, metadata)
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, metadata)
  }
}

// Create loggers for different services
export const databaseLogger = new Logger('DATABASE')
export const authLogger = new Logger('AUTH')
export const srsLogger = new Logger('SRS')
export const analyticsLogger = new Logger('ANALYTICS')
export const aiLogger = new Logger('AI')

export default Logger
