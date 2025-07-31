import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Pinia store - Vue's official state management
// Similar to Redux but more Vue-integrated
export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref<number>(0)
  const multiplier = ref<number>(2)

  // Getters (computed properties)
  const doubleCount = computed((): number => count.value * 2)
  const multipliedCount = computed((): number => count.value * multiplier.value)

  // Actions
  function increment(): void {
    count.value++
  }

  function decrement(): void {
    count.value--
  }

  function reset(): void {
    count.value = 0
  }

  function setMultiplier(value: number): void {
    multiplier.value = value
  }

  return {
    // Expose state, getters, and actions
    count,
    multiplier,
    doubleCount,
    multipliedCount,
    increment,
    decrement,
    reset,
    setMultiplier,
  }
})
