import axios from 'axios'
import { createLogger } from 'src/utils/logger.js'

const logger = createLogger('API')

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8080',
  ENDPOINTS: {
    DISPATCH: process.env.VUE_APP_DISPATCH_ENDPOINT || '/sigorta/dispatch',
    CAPTCHA: process.env.VUE_APP_CAPTCHA_ENDPOINT || '/sigorta/simpleCaptcha.png',
  },
  ENVIRONMENT: {
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    API_TIMEOUT: parseInt(process.env.VUE_APP_API_TIMEOUT) || 30000,
    ENABLE_LOGGING: process.env.VUE_APP_ENABLE_LOGGING === 'true',
  },
}

// Helper Functions
export const getApiUrl = (endpoint = '') => `${API_CONFIG.BASE_URL}${endpoint}`
export const getBaseUrl = () => API_CONFIG.BASE_URL
export const getCaptchaUrl = () => `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CAPTCHA}`
export const getEnvironmentInfo = () => ({
  environment: process.env.NODE_ENV,
  baseUrl: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.ENVIRONMENT.API_TIMEOUT,
  enableLogging: API_CONFIG.ENVIRONMENT.ENABLE_LOGGING,
})

// Axios Configuration
const AXIOS_CONFIG = {
  baseURL: getBaseUrl(),
  timeout: getEnvironmentInfo().timeout,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Accept: 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'X-Requested-With': 'XMLHttpRequest',
  },
}

const apiClient = axios.create(AXIOS_CONFIG)

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() }

    if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      config.data = new URLSearchParams(config.data).toString()
    }

    if (API_CONFIG.ENVIRONMENT.ENABLE_LOGGING) {
      logger.info('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        headers: config.headers,
        timeout: config.timeout,
      })
    }

    return config
  },
  (error) => {
    logger.error('API Request Error:', {
      message: error.message,
      code: error.code,
      config: error.config,
    })
    return Promise.reject(error)
  },
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime

    if (API_CONFIG.ENVIRONMENT.ENABLE_LOGGING) {
      logger.info('API Response:', {
        status: response.status,
        duration: `${duration}ms`,
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        dataSize: JSON.stringify(response.data).length,
      })
    }

    return response
  },
  (error) => {
    const duration = error.config?.metadata?.startTime
      ? new Date() - error.config.metadata.startTime
      : 0

    const errorInfo = {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      code: error.code,
      duration: `${duration}ms`,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
    }

    let userMessage = 'Beklenmeyen bir hata oluştu'
    if (error.code === 'ERR_CONNECTION_REFUSED' || error.code === 'ERR_NETWORK') {
      userMessage =
        'Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin veya daha sonra tekrar deneyin.'
    } else if (error.code === 'ECONNABORTED') {
      userMessage = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.'
    } else if (error.response?.status >= 500) {
      userMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.'
      logger.error('Server Error:', errorInfo)
    } else if (error.response?.status >= 400) {
      userMessage = 'İstek hatası oluştu. Lütfen bilgilerinizi kontrol edin.'
      logger.warn('Client Error:', errorInfo)
    } else {
      logger.error('Network Error:', errorInfo)
    }

    error.userMessage = userMessage
    return Promise.reject(error)
  },
)

export default apiClient
export { API_CONFIG, AXIOS_CONFIG }
