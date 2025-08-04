<template>
  <div class="counter-component">
    <h3>Counter Component</h3>
    <p class="counter-description">
      Demonstrates: Reactive data, computed properties, methods, and local state
    </p>

    <div class="counter-display">
      <span class="count-value">{{ count }}</span>
      <span class="count-label">Current Count</span>
    </div>

    <div class="counter-controls">
      <button @click="decrement" :disabled="count <= 0" class="btn btn-danger">-1</button>
      <button @click="increment" class="btn btn-primary">+1</button>
      <button @click="reset" class="btn btn-secondary">Reset</button>
    </div>

    <div class="counter-info">
      <p>Double: {{ doubleCount }}</p>
      <p>Status: {{ countStatus }}</p>
    </div>
  </div>
</template>

<script>
// Using Composition API with <script setup>
import { ref, computed } from 'vue'

export default {
  name: 'Counter',
  setup() {
    // Reactive state using ref()
    const count = ref(0)

    // Computed properties - automatically reactive
    const doubleCount = computed(() => count.value * 2)

    const countStatus = computed(() => {
      if (count.value === 0) return 'Zero'
      if (count.value > 0) return 'Positive'
      return 'Negative'
    })

    // Methods
    const increment = () => {
      count.value++
    }

    const decrement = () => {
      if (count.value > 0) {
        count.value--
      }
    }

    const reset = () => {
      count.value = 0
    }

    // Return everything that template needs
    return {
      count,
      doubleCount,
      countStatus,
      increment,
      decrement,
      reset,
    }
  },
}
</script>

<style scoped>
.counter-component {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.counter-display {
  text-align: center;
  margin: 1rem 0;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
}

.count-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
  color: #42b883;
}

.count-label {
  display: block;
  color: #718096;
  margin-top: 0.5rem;
}

.counter-controls {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
}

.counter-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #edf2f7;
  border-radius: 4px;
}

.counter-info p {
  margin: 0.25rem 0;
  color: #4a5568;
}
</style>
