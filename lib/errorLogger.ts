/**
 * Comprehensive error logging utility for the Soar application
 * Provides structured error logging with context and metadata
 */

export interface ErrorContext {
  userId?: string
  userEmail?: string
  operation?: string
  endpoint?: string
  method?: string
  requestId?: string
  userAgent?: string
  ip?: string
  timestamp?: string
  additionalData?: Record<string, any>
}

export interface LoggedError {
  message: string
  stack?: string
  name: string
  context: ErrorContext
  level: 'error' | 'warn' | 'info' | 'debug'
  timestamp: string
}

export class ErrorLogger {
  private static instance: ErrorLogger
  private logBuffer: LoggedError[] = []
  private readonly maxBufferSize = 100

  private constructor() {}

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger()
    }
    return ErrorLogger.instance
  }

  /**
   * Log an error with full context
   */
  logError(
    error: Error | unknown,
    context: ErrorContext = {},
    level: 'error' | 'warn' | 'info' | 'debug' = 'error'
  ): void {
    const timestamp = new Date().toISOString()

    const errorInfo: LoggedError = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError',
      context: {
        ...context,
        timestamp,
      },
      level,
      timestamp,
    }

    // Add to buffer for potential export/debugging
    this.addToBuffer(errorInfo)

    // Console logging with structured format
    const logMessage = this.formatLogMessage(errorInfo)

    switch (level) {
      case 'error':
        console.error(logMessage)
        break
      case 'warn':
        console.warn(logMessage)
        break
      case 'info':
        console.info(logMessage)
        break
      case 'debug':
        console.debug(logMessage)
        break
    }

    // In production, you might want to send to external logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToExternalService(errorInfo)
    }
  }

  /**
   * Log API route errors specifically
   */
  logApiError(
    error: Error | unknown,
    req: Request,
    operation: string,
    additionalContext: Record<string, any> = {}
  ): void {
    const context: ErrorContext = {
      operation,
      endpoint: req.url,
      method: req.method,
      userAgent: req.headers.get('user-agent') || undefined,
      timestamp: new Date().toISOString(),
      additionalData: additionalContext,
    }

    this.logError(error, context, 'error')
  }

  /**
   * Log service layer errors
   */
  logServiceError(
    error: Error | unknown,
    serviceName: string,
    operation: string,
    additionalContext: Record<string, any> = {}
  ): void {
    const context: ErrorContext = {
      operation: `${serviceName}.${operation}`,
      timestamp: new Date().toISOString(),
      additionalData: additionalContext,
    }

    this.logError(error, context, 'error')
  }

  /**
   * Log database operation errors
   */
  logDatabaseError(
    error: Error | unknown,
    operation: string,
    model: string,
    query?: any
  ): void {
    const context: ErrorContext = {
      operation: `database.${model}.${operation}`,
      timestamp: new Date().toISOString(),
      additionalData: {
        model,
        query: query ? JSON.stringify(query, null, 2) : undefined,
      },
    }

    this.logError(error, context, 'error')
  }

  /**
   * Log authentication errors
   */
  logAuthError(
    error: Error | unknown,
    operation: string,
    userIdentifier?: string
  ): void {
    const context: ErrorContext = {
      operation: `auth.${operation}`,
      userId: userIdentifier,
      timestamp: new Date().toISOString(),
    }

    this.logError(error, context, 'error')
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(count: number = 10): LoggedError[] {
    return this.logBuffer.slice(-count)
  }

  /**
   * Clear the error buffer
   */
  clearBuffer(): void {
    this.logBuffer = []
  }

  private formatLogMessage(errorInfo: LoggedError): string {
    const { message, stack, name, context, level, timestamp } = errorInfo

    return `
[${level.toUpperCase()}] ${timestamp}
Operation: ${context.operation || 'unknown'}
Error: ${name} - ${message}
Context: ${JSON.stringify(context, null, 2)}
${stack ? `Stack: ${stack}` : ''}
${'='.repeat(80)}
    `.trim()
  }

  private addToBuffer(errorInfo: LoggedError): void {
    this.logBuffer.push(errorInfo)

    // Keep buffer size manageable
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize)
    }
  }

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  private sendToExternalService(_errorInfo: LoggedError): void {
    // Placeholder for external logging service integration
    // You could integrate with services like:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - Custom logging API
    // Example for future implementation:
    // try {
    //   fetch('/api/logs', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(errorInfo)
    //   })
    // } catch (e) {
    //   console.error('Failed to send error to external service:', e)
    // }
  }
}

// Export singleton instance
export const errorLogger = ErrorLogger.getInstance()

// Convenience functions for common error types
export function logApiError(
  error: Error | unknown,
  req: Request,
  operation: string,
  context?: Record<string, any>
) {
  return errorLogger.logApiError(error, req, operation, context)
}

export function logServiceError(
  error: Error | unknown,
  serviceName: string,
  operation: string,
  context?: Record<string, any>
) {
  return errorLogger.logServiceError(error, serviceName, operation, context)
}

export function logDatabaseError(
  error: Error | unknown,
  operation: string,
  model: string,
  query?: any
) {
  return errorLogger.logDatabaseError(error, operation, model, query)
}

export function logAuthError(
  error: Error | unknown,
  operation: string,
  userIdentifier?: string
) {
  return errorLogger.logAuthError(error, operation, userIdentifier)
}

export function logError(
  error: Error | unknown,
  context?: ErrorContext,
  level?: 'error' | 'warn' | 'info' | 'debug'
) {
  return errorLogger.logError(error, context, level)
}
