import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CounterState {
  count: number
  history: number[]
  maxValue: number
  minValue: number
}

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref<number>(0)
  const history = ref<number[]>([0])
  const maxValue = ref<number>(0)
  const minValue = ref<number>(0)

  // Getters (computed)
  const doubleCount = computed<number>(() => count.value * 2)

  const isPositive = computed<boolean>(() => count.value > 0)

  const isNegative = computed<boolean>(() => count.value < 0)

  const isZero = computed<boolean>(() => count.value === 0)

  const countStatus = computed<string>(() => {
    if (count.value > 0) return 'positive'
    if (count.value < 0) return 'negative'
    return 'zero'
  })

  const historyLength = computed<number>(() => history.value.length)

  const average = computed<number>(() => {
    if (history.value.length === 0) return 0
    const sum = history.value.reduce((acc, val) => acc + val, 0)
    return sum / history.value.length
  })

  const range = computed<number>(() => maxValue.value - minValue.value)

  // Actions
  const increment = (amount: number = 1): void => {
    count.value += amount
    updateHistory()
  }

  const decrement = (amount: number = 1): void => {
    count.value -= amount
    updateHistory()
  }

  const reset = (): void => {
    count.value = 0
    history.value = [0]
    maxValue.value = 0
    minValue.value = 0
  }

  const setCount = (newCount: number): void => {
    count.value = newCount
    updateHistory()
  }

  const updateHistory = (): void => {
    history.value.push(count.value)

    // Update max/min values
    if (count.value > maxValue.value) {
      maxValue.value = count.value
    }
    if (count.value < minValue.value) {
      minValue.value = count.value
    }

    // Keep only last 100 entries
    if (history.value.length > 100) {
      history.value = history.value.slice(-100)
    }
  }

  const clearHistory = (): void => {
    history.value = [count.value]
    maxValue.value = count.value
    minValue.value = count.value
  }

  const undo = (): boolean => {
    if (history.value.length > 1) {
      history.value.pop() // Remove current value
      const previousValue = history.value[history.value.length - 1]
      count.value = previousValue
      return true
    }
    return false
  }

  return {
    // State
    count,
    history,
    maxValue,
    minValue,
    // Getters
    doubleCount,
    isPositive,
    isNegative,
    isZero,
    countStatus,
    historyLength,
    average,
    range,
    // Actions
    increment,
    decrement,
    reset,
    setCount,
    clearHistory,
    undo,
  }
})
