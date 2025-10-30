// Centralized Error Handling System

import { createLogger } from './logger.js'
import { Notify } from 'quasar'

const logger = createLogger('ErrorHandler')

/**
 * Error Types
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  AUTHENTICATION: 'AUTH_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  PERMISSION: 'PERMISSION_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
}

/**
 * Error Severity Levels
 */
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

/**
 * Error Handler Class
 */
export class ErrorHandler {
  constructor() {
    this.errorHistory = []
    this.maxHistorySize = 100
  }

  /**
   * Handle and categorize error
   * @param {Error|Object} error - Error object
   * @param {Object} context - Error context
   * @returns {Object} Processed error
   */
  handle(error, context = {}) {
    const processedError = this.processError(error, context)
    
    // Log error
    this.logError(processedError)
    
    // Store in history
    this.addToHistory(processedError)
    
    // Show user notification if needed
    this.showUserNotification(processedError)
    
    return processedError
  }

  /**
   * Process and categorize error
   * @param {Error|Object} error - Raw error
   * @param {Object} context - Error context
   * @returns {Object} Processed error
   */
  processError(error, context) {
    const timestamp = new Date().toISOString()
    const errorId = this.generateErrorId()
    
    let processedError = {
      id: errorId,
      timestamp,
      type: ERROR_TYPES.UNKNOWN,
      severity: ERROR_SEVERITY.MEDIUM,
      message: 'Bilinmeyen hata oluştu',
      originalError: error,
      context,
      userMessage: 'Bir hata oluştu. Lütfen tekrar deneyin.',
      technicalDetails: null,
      retryable: false
    }

    // Network errors
    if (this.isNetworkError(error)) {
      processedError = {
        ...processedError,
        type: ERROR_TYPES.NETWORK,
        severity: ERROR_SEVERITY.HIGH,
        message: 'Ağ bağlantısı hatası',
        userMessage: 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.',
        retryable: true
      }
    }
    // Authentication errors
    else if (this.isAuthError(error)) {
      processedError = {
        ...processedError,
        type: ERROR_TYPES.AUTHENTICATION,
        severity: ERROR_SEVERITY.HIGH,
        message: 'Kimlik doğrulama hatası',
        userMessage: 'Giriş bilgileriniz hatalı veya oturumunuz sona ermiş.',
        retryable: false
      }
    }
    // Validation errors
    else if (this.isValidationError(error)) {
      processedError = {
        ...processedError,
        type: ERROR_TYPES.VALIDATION,
        severity: ERROR_SEVERITY.LOW,
        message: 'Veri doğrulama hatası',
        userMessage: 'Lütfen girdiğiniz bilgileri kontrol edin.',
        retryable: false
      }
    }
    // Permission errors
    else if (this.isPermissionError(error)) {
      processedError = {
        ...processedError,
        type: ERROR_TYPES.PERMISSION,
        severity: ERROR_SEVERITY.HIGH,
        message: 'Yetki hatası',
        userMessage: 'Bu işlem için yetkiniz bulunmuyor.',
        retryable: false
      }
    }
    // Server errors
    else if (this.isServerError(error)) {
      processedError = {
        ...processedError,
        type: ERROR_TYPES.SERVER,
        severity: ERROR_SEVERITY.CRITICAL,
        message: 'Sunucu hatası',
        userMessage: 'Sunucuda bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
        retryable: true
      }
    }
    // Custom error handling
    else if (error.message) {
      processedError.message = error.message
      processedError.userMessage = this.getUserFriendlyMessage(error.message)
    }

    // Add technical details
    processedError.technicalDetails = this.extractTechnicalDetails(error)

    return processedError
  }

  /**
   * Check if error is network related
   */
  isNetworkError(error) {
    return (
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('timeout') ||
      error.message?.includes('ERR_NETWORK') ||
      !navigator.onLine
    )
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(error) {
    return (
      error.status === 401 ||
      error.response?.status === 401 ||
      error.message?.includes('Unauthorized') ||
      error.message?.includes('Token expired') ||
      error.message?.includes('Invalid credentials')
    )
  }

  /**
   * Check if error is validation related
   */
  isValidationError(error) {
    return (
      error.status === 400 ||
      error.response?.status === 400 ||
      error.message?.includes('validation') ||
      error.message?.includes('invalid') ||
      error.errors
    )
  }

  /**
   * Check if error is permission related
   */
  isPermissionError(error) {
    return (
      error.status === 403 ||
      error.response?.status === 403 ||
      error.message?.includes('Forbidden') ||
      error.message?.includes('Access denied')
    )
  }

  /**
   * Check if error is server related
   */
  isServerError(error) {
    return (
      error.status >= 500 ||
      error.response?.status >= 500 ||
      error.message?.includes('Internal Server Error')
    )
  }

  /**
   * Get user-friendly message
   */
  getUserFriendlyMessage(message) {
    const friendlyMessages = {
      'Too many login attempts': 'Çok fazla başarısız giriş denemesi. Lütfen 5 dakika bekleyin.',
      'Invalid user code or password': 'Kullanıcı adı veya şifre hatalı.',
      'Session expired': 'Oturumunuz sona ermiş. Lütfen tekrar giriş yapın.',
      'Network Error': 'Ağ bağlantısı hatası. İnternet bağlantınızı kontrol edin.',
      'Timeout': 'İşlem zaman aşımına uğradı. Lütfen tekrar deneyin.'
    }

    return friendlyMessages[message] || message
  }

  /**
   * Extract technical details from error
   */
  extractTechnicalDetails(error) {
    return {
      name: error.name,
      stack: error.stack,
      status: error.status || error.response?.status,
      response: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        timeout: error.config?.timeout
      }
    }
  }

  /**
   * Log error with appropriate level
   */
  logError(error) {
    const logData = {
      id: error.id,
      type: error.type,
      severity: error.severity,
      message: error.message,
      context: error.context,
      technicalDetails: error.technicalDetails
    }

    switch (error.severity) {
      case ERROR_SEVERITY.CRITICAL:
        logger.error('Critical Error:', logData)
        break
      case ERROR_SEVERITY.HIGH:
        logger.error('High Priority Error:', logData)
        break
      case ERROR_SEVERITY.MEDIUM:
        logger.warn('Medium Priority Error:', logData)
        break
      case ERROR_SEVERITY.LOW:
        logger.info('Low Priority Error:', logData)
        break
    }
  }

  /**
   * Show user notification
   */
  showUserNotification(error) {
    // Don't show notifications for low severity errors in production
    if (process.env.NODE_ENV === 'production' && error.severity === ERROR_SEVERITY.LOW) {
      return
    }

    const notificationType = this.getNotificationType(error.severity)
    
    Notify.create({
      type: notificationType,
      message: error.userMessage,
      caption: error.retryable ? 'Tekrar deneyebilirsiniz.' : '',
      timeout: this.getNotificationTimeout(error.severity),
      actions: error.retryable ? [
        {
          label: 'Tekrar Dene',
          color: 'white',
          handler: () => {
            // Retry logic can be implemented here
            this.retryLastAction()
          }
        }
      ] : []
    })
  }

  /**
   * Get notification type based on severity
   */
  getNotificationType(severity) {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
        return 'negative'
      case ERROR_SEVERITY.HIGH:
        return 'negative'
      case ERROR_SEVERITY.MEDIUM:
        return 'warning'
      case ERROR_SEVERITY.LOW:
        return 'info'
      default:
        return 'warning'
    }
  }

  /**
   * Get notification timeout based on severity
   */
  getNotificationTimeout(severity) {
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
        return 0 // Don't auto-dismiss
      case ERROR_SEVERITY.HIGH:
        return 5000
      case ERROR_SEVERITY.MEDIUM:
        return 3000
      case ERROR_SEVERITY.LOW:
        return 2000
      default:
        return 3000
    }
  }

  /**
   * Add error to history
   */
  addToHistory(error) {
    this.errorHistory.unshift(error)
    
    // Keep only recent errors
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize)
    }
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Retry last action (placeholder)
   */
  retryLastAction() {
    logger.info('Retry action requested')
    // Implementation depends on the specific use case
  }

  /**
   * Get error history
   */
  getErrorHistory(limit = 10) {
    return this.errorHistory.slice(0, limit)
  }

  /**
   * Clear error history
   */
  clearErrorHistory() {
    this.errorHistory = []
  }
}

// Create singleton instance
export const errorHandler = new ErrorHandler()

// Export convenience functions
export const handleError = (error, context) => errorHandler.handle(error, context)
export const handleAsyncError = async (asyncFn, context) => {
  try {
    return await asyncFn()
  } catch (error) {
    return errorHandler.handle(error, context)
  }
}

export default errorHandler
