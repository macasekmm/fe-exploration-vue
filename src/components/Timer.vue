<template>
  <div class="timer-component">
    <h3>Timer Component</h3>
    <p class="timer-description">Demonstrates: Lifecycle hooks, intervals, and reactive updates</p>

    <div class="timer-display">
      <span class="time-value">{{ formattedTime }}</span>
      <span class="time-label">{{ isRunning ? 'Running' : 'Stopped' }}</span>
    </div>

    <div class="timer-controls">
      <button @click="start" :disabled="isRunning" class="btn btn-success">Start</button>
      <button @click="pause" :disabled="!isRunning" class="btn btn-warning">Pause</button>
      <button @click="reset" class="btn btn-secondary">Reset</button>
    </div>

    <div class="timer-info">
      <p>Total Sessions: {{ sessionCount }}</p>
      <p>Longest Session: {{ formatTime(longestSession) }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'Timer',
  setup() {
    // Reactive state
    const seconds = ref(0)
    const isRunning = ref(false)
    const sessionCount = ref(0)
    const longestSession = ref(0)
    const currentSessionStart = ref(0)

    let intervalId = null

    // Computed properties
    const formattedTime = computed(() => formatTime(seconds.value))

    // Methods
    const formatTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const secs = totalSeconds % 60

      if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }
      return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const start = () => {
      if (!isRunning.value) {
        isRunning.value = true
        currentSessionStart.value = seconds.value

        intervalId = setInterval(() => {
          seconds.value++
        }, 1000)
      }
    }

    const pause = () => {
      if (isRunning.value) {
        isRunning.value = false
        clearInterval(intervalId)

        // Update session stats
        const sessionLength = seconds.value - currentSessionStart.value
        if (sessionLength > longestSession.value) {
          longestSession.value = sessionLength
        }
        sessionCount.value++
      }
    }

    const reset = () => {
      isRunning.value = false
      clearInterval(intervalId)
      seconds.value = 0
    }

    // Lifecycle hooks
    onMounted(() => {
      console.log('Timer component mounted')
    })

    onUnmounted(() => {
      // Cleanup interval when component is destroyed
      if (intervalId) {
        clearInterval(intervalId)
      }
      console.log('Timer component unmounted')
    })

    return {
      seconds,
      isRunning,
      sessionCount,
      longestSession,
      formattedTime,
      formatTime,
      start,
      pause,
      reset,
    }
  },
}
</script>

<style scoped>
.timer-component {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.timer-display {
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.time-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #3182ce;
  font-family: 'Courier New', monospace;
}

.time-label {
  display: block;
  color: #718096;
  margin-top: 0.5rem;
  font-weight: 500;
}

.timer-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
}

.timer-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #edf2f7;
  border-radius: 4px;
}

.timer-info p {
  margin: 0.25rem 0;
  color: #4a5568;
}
</style>
