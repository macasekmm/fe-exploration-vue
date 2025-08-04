import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface UseCounterOptions {
  initialValue?: number
  min?: number
  max?: number
  step?: number
}

export interface UseCounterReturn {
  count: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
  set: (value: number) => void
  doubled: ComputedRef<number>
  isAtMin: ComputedRef<boolean>
  isAtMax: ComputedRef<boolean>
  canIncrement: ComputedRef<boolean>
  canDecrement: ComputedRef<boolean>
}

export function useCounter(options: UseCounterOptions = {}): UseCounterReturn {
  const { initialValue = 0, min = -Infinity, max = Infinity, step = 1 } = options

  // Ensure initial value is within bounds
  const clampedInitial = Math.max(min, Math.min(max, initialValue))
  const count = ref<number>(clampedInitial)

  // Computed properties
  const doubled = computed<number>(() => count.value * 2)
  const isAtMin = computed<boolean>(() => count.value <= min)
  const isAtMax = computed<boolean>(() => count.value >= max)
  const canIncrement = computed<boolean>(() => count.value + step <= max)
  const canDecrement = computed<boolean>(() => count.value - step >= min)

  // Helper function to clamp value within bounds
  const clamp = (value: number): number => {
    return Math.max(min, Math.min(max, value))
  }

  // Actions
  const increment = (): void => {
    if (canIncrement.value) {
      count.value = clamp(count.value + step)
    }
  }

  const decrement = (): void => {
    if (canDecrement.value) {
      count.value = clamp(count.value - step)
    }
  }

  const reset = (): void => {
    count.value = clampedInitial
  }

  const set = (value: number): void => {
    count.value = clamp(value)
  }

  return {
    count,
    increment,
    decrement,
    reset,
    set,
    doubled,
    isAtMin,
    isAtMax,
    canIncrement,
    canDecrement,
  }
}
