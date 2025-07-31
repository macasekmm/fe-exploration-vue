<template>
  <BaseCard title="Counter Example">
    <div class="counter-section">
      <h3>Local Counter (Component State)</h3>
      <div class="counter-display">
        <span class="count-value">{{ localCount }}</span>
      </div>
      <div class="counter-controls">
        <BaseButton @click="decrementLocal" variant="secondary">-</BaseButton>
        <BaseButton @click="resetLocal" variant="outline">Reset</BaseButton>
        <BaseButton @click="incrementLocal" variant="primary">+</BaseButton>
      </div>
    </div>

    <div class="counter-section">
      <h3>Global Counter (Pinia Store)</h3>
      <div class="counter-display">
        <span class="count-value">{{ store.count }}</span>
        <small>Double: {{ store.doubleCount }}</small>
      </div>
      <div class="counter-controls">
        <BaseButton @click="store.decrement" variant="secondary">-</BaseButton>
        <BaseButton @click="store.reset" variant="outline">Reset</BaseButton>
        <BaseButton @click="store.increment" variant="primary">+</BaseButton>
      </div>
    </div>

    <!-- Computed properties demonstration -->
    <div class="computed-demo">
      <h4>Computed Properties Demo</h4>
      <p>Local count squared: {{ localCountSquared }}</p>
      <p>Is local count even: {{ isLocalCountEven }}</p>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCounterStore } from '@/stores/counter'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

// Local reactive state
const localCount = ref<number>(0)

// Store usage
const store = useCounterStore()

// Computed properties - Vue's equivalent to React useMemo but more automatic
const localCountSquared = computed((): number => localCount.value * localCount.value)
const isLocalCountEven = computed((): boolean => localCount.value % 2 === 0)

// Methods
const incrementLocal = (): void => {
  localCount.value++
}
const decrementLocal = (): void => {
  localCount.value--
}
const resetLocal = (): void => {
  localCount.value = 0
}
</script>

<style scoped>
.counter-section {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.counter-display {
  text-align: center;
  margin: 1rem 0;
}

.count-value {
  font-size: 3rem;
  font-weight: bold;
  color: #3b82f6;
}

.counter-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.computed-demo {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}
</style>
