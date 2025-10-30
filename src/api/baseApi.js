import { createLogger } from 'src/utils/logger.js'
import { API_CONFIG } from './index.js'
import apiClient from './index.js'

const logger = createLogger('BaseAPI')

class APIClient {
  constructor() {
    this.axiosInstance = apiClient
  }

  /**
   * Dispatch API çağrısı
   * @param {string} cmd - Backend'e gönderilecek komut
   * @param {object|FormData} payload - Gönderilecek veri
   * @param {object} options - Ekstra ayarlar (headers vb.)
   */
  async dispatch(cmd, payload = {}, { headers = {}, ...rest } = {}) {
    let requestData

    if (payload instanceof FormData) {
      requestData = new FormData()
      requestData.append('cmd', cmd)

      const token = localStorage.getItem('sessionInfo').token

      if (token) {
        requestData.append('token', token)
      }

      for (const [key, value] of payload.entries()) {
        requestData.append(key, value)
      }
      Object.keys(rest).forEach((key) => {
        requestData.append(key, rest[key])
      })
    } else {
      requestData = { cmd, ...rest, jp: JSON.stringify(payload) }
    }

    const response = await this.axiosInstance.post(API_CONFIG.ENDPOINTS.DISPATCH, requestData, {
      headers,
    })

    return response
  }
}

const api = new APIClient()

/**
 * Dispatch çağrısı için wrapper
 */
export const dispatchCall = async (cmd, payload = {}, options = {}) => {
  try {
    logger.info(`Dispatch API: ${cmd} request`, payload)
    const response = await api.dispatch(cmd, payload, options)
    logger.info(`Dispatch API: ${cmd} successful`, response.data)
    return response
  } catch (error) {
    logger.error(`Dispatch API: ${cmd} failed`, error)
    throw error
  }
}

/**
 * Base API Export
 */
export const baseApi = {
  dispatchCall,
  getClient: () => api,
}

export default baseApi
