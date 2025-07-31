<template>
  <div class="examples-page">
    <header class="page-header">
      <h1>Vue.js Framework Examples</h1>
      <p>Comprehensive examples demonstrating Vue 3 concepts and patterns</p>
    </header>

    <div class="examples-grid">
      <CounterExample />
      <TimerExample />
      <TodoExample />
      <FormExample />
      <ComponentCommunication />
    </div>
  </div>
</template>

<script setup>
import CounterExample from '@/components/examples/CounterExample.vue'
import TimerExample from '@/components/examples/TimerExample.vue'
import TodoExample from '@/components/examples/TodoExample.vue'
import FormExample from '@/components/examples/FormExample.vue'
import ComponentCommunication from '@/components/examples/ComponentCommunication.vue'
</script>

<style scoped>
.examples-page {
  padding: 2rem 0;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.page-header p {
  font-size: 1.125rem;
  color: #6b7280;
}

.examples-grid {
  display: grid;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .examples-grid {
    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  }
}
</style>
