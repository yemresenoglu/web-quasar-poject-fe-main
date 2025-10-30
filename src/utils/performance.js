// Performance Monitoring Utility

import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from 'web-vitals'
import { createLogger } from './logger'

const logger = createLogger('Performance')

function reportWebVital(metric) {
  const { name, value, rating, delta, id } = metric
  
  if (process.env.NODE_ENV === 'development') {
    logger.info(`${name}:`, {
      value: Math.round(value),
      rating,
      delta: Math.round(delta),
      id
    })
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (window.gtag) {
      window.gtag('event', name, {
        value: Math.round(value),
        metric_id: id,
        metric_value: value,
        metric_delta: delta,
        metric_rating: rating
      })
    }
    
  }
}

export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return
  
  logger.info('📊 Performance monitoring initialized')
  
  onCLS(reportWebVital)
  onFCP(reportWebVital)
  onFID(reportWebVital)
  onINP(reportWebVital)
  onLCP(reportWebVital)
  onTTFB(reportWebVital)
}

export async function measurePerformance(name, fn) {
  const startTime = performance.now()
  
  try {
    const result = await fn()
    const duration = performance.now() - startTime
    
    logger.info(`⏱️ ${name}:`, `${Math.round(duration)}ms`)
    
    if (performance.mark) {
      performance.mark(`${name}-start`)
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
    }
    
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    logger.error(`❌ ${name} failed:`, `${Math.round(duration)}ms`, error)
    throw error
  }
}

export function getPerformanceEntries(type) {
  if (typeof performance === 'undefined') return []
  
  if (type) {
    return performance.getEntriesByType(type)
  }
  
  return performance.getEntries()
}

export function clearPerformanceEntries() {
  if (typeof performance === 'undefined') return
  
  if (performance.clearMarks) {
    performance.clearMarks()
  }
  
  if (performance.clearMeasures) {
    performance.clearMeasures()
  }
  
  if (performance.clearResourceTimings) {
    performance.clearResourceTimings()
  }
  
  logger.info('🧹 Performance entries cleared')
}

export function getMemoryUsage() {
  if (typeof performance === 'undefined') return null
  if (!performance.memory) return null
  
  return {
    usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1048576),
    totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1048576),
    jsHeapSizeLimit: Math.round(performance.memory.jsHeapSizeLimit / 1048576)
  }
}

export function logPerformanceMetrics() {
  const memory = getMemoryUsage()
  const navigation = getPerformanceEntries('navigation')[0]
  const resources = getPerformanceEntries('resource')
  
  logger.info('📊 Performance Metrics:', {
    memory,
    navigation: navigation ? {
      domContentLoaded: Math.round(navigation.domContentLoadedEventEnd),
      loadComplete: Math.round(navigation.loadEventEnd),
      domInteractive: Math.round(navigation.domInteractive)
    } : null,
    resourceCount: resources.length
  })
}

export default {
  initPerformanceMonitoring,
  measurePerformance,
  getPerformanceEntries,
  clearPerformanceEntries,
  getMemoryUsage,
  logPerformanceMetrics
}

