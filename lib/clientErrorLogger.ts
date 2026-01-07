/**
 * Client-side error logging utility for React components
 * Provides structured error logging for frontend errors
 */

export interface ClientErrorContext {
  userId?: string
  userEmail?: string
  component?: string
  operation?: string
  url?: string
  userAgent?: string
  timestamp?: string
  additionalData?: Record<string, any>
}

export interface ClientLoggedError {
  message: string
  stack?: string
  name: string
  context: ClientErrorContext
  level: 'error' | 'warn' | 'info' | 'debug'
  timestamp: string
}

class ClientErrorLogger {
  private static instance: ClientErrorLogger
  private logBuffer: ClientLoggedError[] = []
  private readonly maxBufferSize = 50

  private constructor() {}

  static getInstance(): ClientErrorLogger {
    if (!ClientErrorLogger.instance) {
      ClientErrorLogger.instance = new ClientErrorLogger()
    }
    return ClientErrorLogger.instance
  }

  /**
   * Log an error with full context
   */
  logError(
    error: Error | unknown,
    context: ClientErrorContext = {},
    level: 'error' | 'warn' | 'info' | 'debug' = 'error'
  ): void {
    const timestamp = new Date().toISOString()

    const errorInfo: ClientLoggedError = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'UnknownError',
      context: {
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
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
      this.sendToAnalytics(errorInfo)
    }
  }

  /**
   * Log component-specific errors
   */
  logComponentError(
    error: Error | unknown,
    componentName: string,
    operation: string,
    additionalContext: Record<string, any> = {}
  ): void {
    const context: ClientErrorContext = {
      component: componentName,
      operation,
      timestamp: new Date().toISOString(),
      additionalData: additionalContext,
    }

    this.logError(error, context, 'error')
  }

  /**
   * Log API call errors from frontend
   */
  logApiCallError(
    error: Error | unknown,
    endpoint: string,
    method: string,
    requestData?: any,
    responseData?: any
  ): void {
    const context: ClientErrorContext = {
      operation: `api.${method}.${endpoint}`,
      timestamp: new Date().toISOString(),
      additionalData: {
        endpoint,
        method,
        requestData,
        responseData,
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
    const context: ClientErrorContext = {
      operation: `auth.${operation}`,
      userId: userIdentifier,
      timestamp: new Date().toISOString(),
    }

    this.logError(error, context, 'error')
  }

  /**
   * Log user interaction errors
   */
  logUserInteractionError(
    error: Error | unknown,
    interactionType: string,
    element?: string,
    additionalContext: Record<string, any> = {}
  ): void {
    const context: ClientErrorContext = {
      operation: `interaction.${interactionType}`,
      timestamp: new Date().toISOString(),
      additionalData: {
        element,
        ...additionalContext,
      },
    }

    this.logError(error, context, 'error')
  }

  /**
   * Get recent errors for debugging
   */
  getRecentErrors(count: number = 10): ClientLoggedError[] {
    return this.logBuffer.slice(-count)
  }

  /**
   * Clear the error buffer
   */
  clearBuffer(): void {
    this.logBuffer = []
  }

  /**
   * Export error logs as JSON for debugging
   */
  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2)
  }

  private formatLogMessage(errorInfo: ClientLoggedError): string {
    const { message, stack, name, context, level, timestamp } = errorInfo

    return `
[${level.toUpperCase()}] ${timestamp}
Component: ${context.component || 'unknown'}
Operation: ${context.operation || 'unknown'}
Error: ${name} - ${message}
URL: ${context.url || 'unknown'}
Context: ${JSON.stringify(context.additionalData || {}, null, 2)}
${stack ? `Stack: ${stack}` : ''}
${'='.repeat(80)}
    `.trim()
  }

  private addToBuffer(errorInfo: ClientLoggedError): void {
    this.logBuffer.push(errorInfo)

    // Keep buffer size manageable
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize)
    }
  }

  private sendToAnalytics(_errorInfo: ClientLoggedError): void {
    // Placeholder for analytics/monitoring service integration
    // You could integrate with services like:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Custom analytics API
    // Example for future implementation:
    try {
      // Send to your analytics service
      // analytics.track('error_occurred', {
      //   error: errorInfo.name,
      //   message: errorInfo.message,
      //   component: errorInfo.context.component,
      //   operation: errorInfo.context.operation
      // })
    } catch (e) {
      console.error('Failed to send error to analytics:', e)
    }
  }
}

// Export singleton instance
export const clientErrorLogger = ClientErrorLogger.getInstance()

// Convenience functions for common error types
export function logComponentError(
  error: Error | unknown,
  componentName: string,
  operation: string,
  context?: Record<string, any>
) {
  return clientErrorLogger.logComponentError(
    error,
    componentName,
    operation,
    context
  )
}

export function logApiCallError(
  error: Error | unknown,
  endpoint: string,
  method: string,
  requestData?: any,
  responseData?: any
) {
  return clientErrorLogger.logApiCallError(
    error,
    endpoint,
    method,
    requestData,
    responseData
  )
}

export function logAuthError(
  error: Error | unknown,
  operation: string,
  userIdentifier?: string
) {
  return clientErrorLogger.logAuthError(error, operation, userIdentifier)
}

export function logUserInteractionError(
  error: Error | unknown,
  interactionType: string,
  element?: string,
  context?: Record<string, any>
) {
  return clientErrorLogger.logUserInteractionError(
    error,
    interactionType,
    element,
    context
  )
}

export function logClientError(
  error: Error | unknown,
  context?: ClientErrorContext,
  level?: 'error' | 'warn' | 'info' | 'debug'
) {
  return clientErrorLogger.logError(error, context, level)
}
