import { ref, onUnmounted, Ref } from 'vue'

interface UseTimerReturn {
  seconds: Ref<number>
  isRunning: Ref<boolean>
  start: () => void
  pause: () => void
  reset: () => void
  formatTime: (totalSeconds: number) => string
}

// Composables are Vue's equivalent to React custom hooks
// They encapsulate reactive logic and can be reused across components
export function useTimer(): UseTimerReturn {
  const seconds = ref<number>(0)
  const isRunning = ref<boolean>(false)
  let intervalId: NodeJS.Timeout | null = null

  const start = (): void => {
    if (!isRunning.value) {
      isRunning.value = true
      intervalId = setInterval(() => {
        seconds.value++
      }, 1000)
    }
  }

  const pause = (): void => {
    if (isRunning.value) {
      isRunning.value = false
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
  }

  const reset = (): void => {
    pause()
    seconds.value = 0
  }

  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount - similar to useEffect cleanup in React
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    formatTime,
  }
}
