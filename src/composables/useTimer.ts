import { ref, computed, onUnmounted, type Ref, type ComputedRef } from 'vue'

export interface UseTimerOptions {
  autoStart?: boolean
  interval?: number
  countdown?: boolean
  initialTime?: number
}

export interface UseTimerReturn {
  seconds: Ref<number>
  isRunning: Ref<boolean>
  start: () => void
  pause: () => void
  reset: () => void
  toggle: () => void
  formattedTime: ComputedRef<string>
  minutes: ComputedRef<number>
  hours: ComputedRef<number>
}

export function useTimer(options: UseTimerOptions = {}): UseTimerReturn {
  const { autoStart = false, interval = 1000, countdown = false, initialTime = 0 } = options

  // State
  const seconds = ref<number>(initialTime)
  const isRunning = ref<boolean>(false)
  let intervalId: number | null = null

  // Computed properties
  const formattedTime = computed<string>(() => {
    const totalSeconds = Math.abs(seconds.value)
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60

    const sign = seconds.value < 0 ? '-' : ''

    if (hrs > 0) {
      return `${sign}${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${sign}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  })

  const minutes = computed<number>(() => Math.floor(seconds.value / 60))
  const hours = computed<number>(() => Math.floor(seconds.value / 3600))

  // Timer logic
  const tick = (): void => {
    if (countdown) {
      seconds.value--
      if (seconds.value <= 0) {
        pause()
        seconds.value = 0
      }
    } else {
      seconds.value++
    }
  }

  // Actions
  const start = (): void => {
    if (!isRunning.value) {
      isRunning.value = true
      intervalId = window.setInterval(tick, interval)
    }
  }

  const pause = (): void => {
    if (isRunning.value && intervalId !== null) {
      isRunning.value = false
      clearInterval(intervalId)
      intervalId = null
    }
  }

  const reset = (): void => {
    pause()
    seconds.value = initialTime
  }

  const toggle = (): void => {
    if (isRunning.value) {
      pause()
    } else {
      start()
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (intervalId !== null) {
      clearInterval(intervalId)
    }
  })

  // Auto start if requested
  if (autoStart) {
    start()
  }

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    toggle,
    formattedTime,
    minutes,
    hours,
  }
}
