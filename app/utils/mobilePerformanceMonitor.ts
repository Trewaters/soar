/**
 * Mobile Performance Monitor - Track and optimize mobile input performance
 * in the Soar yoga application. Provides performance metrics and optimization
 * recommendations for mobile keyboard interactions.
 */

export interface PerformanceMetrics {
  inputLatency: number
  keyboardOpenTime: number
  keyboardCloseTime: number
  keyboardTransition: number
  focusTransitionTime: number
  focusTransition: number
  renderTime: number
  memoryUsage?: number
  timestamp: number
}

export interface PerformanceThresholds {
  inputLatency: number
  keyboardTransition: number
  focusTransition: number
  renderTime: number
}

class MobilePerformanceMonitor {
  private metrics: PerformanceMetrics[] = []
  private isMonitoring: boolean = false
  private performanceThresholds: PerformanceThresholds = {
    inputLatency: 16, // 60fps target
    keyboardTransition: 300, // Reasonable keyboard animation
    focusTransition: 100, // Fast focus changes
    renderTime: 16, // Single frame budget
  }

  /**
   * Start performance monitoring for mobile inputs
   */
  startMonitoring(): void {
    if (typeof window === 'undefined') return

    this.isMonitoring = true

    // Monitor performance for key mobile interactions
    this.monitorInputLatency()
    this.monitorKeyboardTransitions()
    this.monitorFocusTransitions()
    this.monitorRenderPerformance()
  }

  /**
   * Stop performance monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false
  }

  /**
   * Monitor input latency for mobile text inputs
   */
  private monitorInputLatency(): void {
    if (!this.isMonitoring) return

    let inputStartTime: number

    const handleInputStart = () => {
      inputStartTime = performance.now()
    }

    const handleInputEnd = () => {
      if (inputStartTime) {
        const latency = performance.now() - inputStartTime
        this.recordMetric('inputLatency', latency)
      }
    }

    // Monitor all text inputs
    document.addEventListener('input', handleInputStart, { passive: true })
    document.addEventListener('change', handleInputEnd, { passive: true })
  }

  /**
   * Monitor virtual keyboard transitions
   */
  private monitorKeyboardTransitions(): void {
    if (typeof window === 'undefined' || !this.isMonitoring) return

    let keyboardStartTime: number
    let previousViewportHeight = window.innerHeight

    const checkKeyboardState = () => {
      const currentHeight = window.innerHeight
      const heightChange = Math.abs(currentHeight - previousViewportHeight)

      // Significant height change indicates keyboard state change
      if (heightChange > 150) {
        if (currentHeight < previousViewportHeight) {
          // Keyboard opened
          keyboardStartTime = performance.now()
        } else if (keyboardStartTime) {
          // Keyboard closed
          const transitionTime = performance.now() - keyboardStartTime
          this.recordMetric('keyboardTransition', transitionTime)
        }
        previousViewportHeight = currentHeight
      }
    }

    // Use Visual Viewport API if available
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', checkKeyboardState)
    } else {
      // Fallback to window resize
      const windowObj = window as any
      windowObj.addEventListener('resize', checkKeyboardState, {
        passive: true,
      })
    }
  }

  /**
   * Monitor focus transition performance
   */
  private monitorFocusTransitions(): void {
    if (!this.isMonitoring) return

    let focusStartTime: number

    const handleFocusStart = () => {
      focusStartTime = performance.now()
    }

    const handleFocusEnd = () => {
      if (focusStartTime) {
        const transitionTime = performance.now() - focusStartTime
        this.recordMetric('focusTransition', transitionTime)
      }
    }

    document.addEventListener('focusin', handleFocusStart, { passive: true })
    document.addEventListener('focusout', handleFocusEnd, { passive: true })
  }

  /**
   * Monitor rendering performance for mobile components
   */
  private monitorRenderPerformance(): void {
    if (!this.isMonitoring || typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()

      entries.forEach((entry) => {
        if (entry.entryType === 'measure' || entry.entryType === 'navigation') {
          this.recordMetric('renderTime', entry.duration)
        }
      })
    })

    // Observe performance entries
    try {
      observer.observe({ entryTypes: ['measure', 'navigation'] })
    } catch (error) {
      console.warn('Performance monitoring not supported:', error)
    }
  }

  /**
   * Record a performance metric
   */
  private recordMetric(type: keyof PerformanceMetrics, value: number): void {
    const metric: Partial<PerformanceMetrics> = {
      timestamp: Date.now(),
      [type]: value,
    }

    // Add memory usage if available
    if ('memory' in performance) {
      metric.memoryUsage = (performance as any).memory.usedJSHeapSize
    }

    this.metrics.push(metric as PerformanceMetrics)

    // Keep only recent metrics (last 100)
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Check for performance issues
    this.checkPerformanceThresholds(type, value)
  }

  /**
   * Check if performance metrics exceed thresholds
   */
  private checkPerformanceThresholds(
    type: keyof PerformanceMetrics,
    value: number
  ): void {
    let threshold: number

    switch (type) {
      case 'inputLatency':
        threshold = this.performanceThresholds.inputLatency
        break
      case 'keyboardOpenTime':
      case 'keyboardCloseTime':
        threshold = this.performanceThresholds.keyboardTransition
        break
      case 'focusTransitionTime':
        threshold = this.performanceThresholds.focusTransition
        break
      case 'renderTime':
        threshold = this.performanceThresholds.renderTime
        break
      default:
        return
    }

    if (value > threshold) {
      console.warn(
        `Mobile performance issue detected: ${type} = ${value}ms (threshold: ${threshold}ms)`
      )

      // Suggest optimizations
      this.suggestOptimizations(type)
    }
  }

  /**
   * Suggest performance optimizations
   */
  private suggestOptimizations(type: keyof PerformanceMetrics): void {
    const suggestions: Record<string, string[]> = {
      inputLatency: [
        'Consider debouncing input handlers',
        'Use React.memo for input components',
        'Optimize onChange handlers',
        'Reduce component re-renders',
      ],
      keyboardTransition: [
        'Optimize viewport meta tag settings',
        'Reduce layout thrashing during keyboard transitions',
        'Use transform instead of changing layout properties',
        'Consider using will-change CSS property',
      ],
      focusTransition: [
        'Optimize focus event handlers',
        'Reduce DOM queries during focus changes',
        'Use requestAnimationFrame for focus-related animations',
        'Minimize work in focus/blur handlers',
      ],
      renderTime: [
        'Break down large components into smaller ones',
        'Use React.lazy for code splitting',
        'Optimize heavy computations with useMemo',
        'Consider virtualizing long lists',
      ],
    }

    const typeKey = type as string
    if (suggestions[typeKey]) {
      console.group(`Optimization suggestions for ${type}:`)
      suggestions[typeKey].forEach((suggestion) => {
        console.log(`• ${suggestion}`)
      })
      console.groupEnd()
    }
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): {
    averages: Partial<PerformanceMetrics>
    peaks: Partial<PerformanceMetrics>
    issueCount: number
    suggestions: string[]
  } {
    if (this.metrics.length === 0) {
      return {
        averages: {},
        peaks: {},
        issueCount: 0,
        suggestions: [],
      }
    }

    const averages: Partial<PerformanceMetrics> = {}
    const peaks: Partial<PerformanceMetrics> = {}
    let issueCount = 0

    // Calculate averages and peaks
    const keys = [
      'inputLatency',
      'keyboardOpenTime',
      'keyboardCloseTime',
      'focusTransitionTime',
      'renderTime',
    ] as const

    keys.forEach((key) => {
      const values = this.metrics
        .map((m) => m[key])
        .filter((v): v is number => typeof v === 'number')

      if (values.length > 0) {
        averages[key] =
          values.reduce((sum, val) => sum + val, 0) / values.length
        peaks[key] = Math.max(...values)

        // Count issues
        const threshold = this.getThresholdForMetric(key)
        issueCount += values.filter((v) => v > threshold).length
      }
    })

    return {
      averages,
      peaks,
      issueCount,
      suggestions: this.getGeneralSuggestions(),
    }
  }

  /**
   * Get threshold for a specific metric
   */
  private getThresholdForMetric(metric: string): number {
    switch (metric) {
      case 'inputLatency':
        return this.performanceThresholds.inputLatency
      case 'keyboardOpenTime':
      case 'keyboardCloseTime':
        return this.performanceThresholds.keyboardTransition
      case 'focusTransitionTime':
        return this.performanceThresholds.focusTransition
      case 'renderTime':
        return this.performanceThresholds.renderTime
      default:
        return 100
    }
  }

  /**
   * Get general performance suggestions
   */
  private getGeneralSuggestions(): string[] {
    return [
      'Use passive event listeners for better scroll performance',
      'Implement proper React key props for list items',
      'Minimize DOM manipulations in event handlers',
      'Use CSS transforms for animations instead of layout properties',
      'Consider using Web Workers for heavy computations',
      'Optimize images and use appropriate formats',
      'Implement lazy loading for off-screen content',
    ]
  }

  /**
   * Clear all recorded metrics
   */
  clearMetrics(): void {
    this.metrics = []
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): PerformanceMetrics[] {
    return [...this.metrics]
  }
}

// Global performance monitor instance
export const mobilePerformanceMonitor = new MobilePerformanceMonitor()

/**
 * React hook for mobile performance monitoring
 */
export function useMobilePerformanceMonitor() {
  const startMonitoring = () => mobilePerformanceMonitor.startMonitoring()
  const stopMonitoring = () => mobilePerformanceMonitor.stopMonitoring()
  const getStats = () => mobilePerformanceMonitor.getPerformanceStats()
  const clearMetrics = () => mobilePerformanceMonitor.clearMetrics()
  const exportMetrics = () => mobilePerformanceMonitor.exportMetrics()

  return {
    startMonitoring,
    stopMonitoring,
    getStats,
    clearMetrics,
    exportMetrics,
  }
}

/**
 * Performance optimization utilities
 */
export const performanceOptimizations = {
  /**
   * Debounce function for input handlers
   */
  debounce: <T extends Function>(func: T, delay: number): T => {
    let timeoutId: NodeJS.Timeout
    return ((...args: any[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => (func as any)(...args), delay)
    }) as unknown as T
  },

  /**
   * Throttle function for frequent events
   */
  throttle: <T extends Function>(func: T, delay: number): T => {
    let lastCall = 0
    return ((...args: any[]) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        ;(func as any)(...args)
      }
    }) as unknown as T
  },

  /**
   * Optimized event listener with passive option
   */
  addPassiveListener: (
    element: EventTarget,
    event: string,
    handler: EventListener
  ): (() => void) => {
    element.addEventListener(event, handler, { passive: true })
    return () => element.removeEventListener(event, handler)
  },

  /**
   * Optimize component rendering with RAF
   */
  scheduleUpdate: (callback: () => void): void => {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback)
    })
  },
}
