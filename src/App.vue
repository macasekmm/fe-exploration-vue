<template>
  <div id="app">
    <header class="app-header">
      <h1>Vue.js Showcase Application</h1>
      <p>Demonstrating Vue's core concepts and patterns</p>
    </header>

    <main class="app-main">
      <!-- Component Architecture Section -->
      <section class="showcase-section">
        <h2>Component Architecture & Reactivity</h2>
        <div class="component-grid">
          <Counter />
          <Timer />
        </div>
      </section>

      <!-- State Management Section -->
      <section class="showcase-section">
        <h2>State Management with Pinia</h2>
        <TodoList />
      </section>

      <!-- Form Handling Section -->
      <section class="showcase-section">
        <h2>Form Handling & Validation</h2>
        <FormValidation />
      </section>

      <!-- Event Communication Section -->
      <section class="showcase-section">
        <h2>Inter-Component Communication</h2>
        <EventEmitterParent />
      </section>

      <!-- Conditional & List Rendering Section -->
      <section class="showcase-section">
        <h2>Conditional & List Rendering</h2>
        <div class="component-grid">
          <ConditionalRendering />
          <ListRendering />
        </div>
      </section>
    </main>
  </div>
</template>

<script>
// Import all showcase components
import Counter from './components/Counter.vue'
import Timer from './components/Timer.vue'
import TodoList from './components/TodoList.vue'
import FormValidation from './components/FormValidation.vue'
import EventEmitterParent from './components/EventEmitterParent.vue'
import ConditionalRendering from './components/ConditionalRendering.vue'
import ListRendering from './components/ListRendering.vue'

export default {
  name: 'App',
  components: {
    Counter,
    Timer,
    TodoList,
    FormValidation,
    EventEmitterParent,
    ConditionalRendering,
    ListRendering,
  },
}
</script>

<style scoped>
.app-header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #42b883 0%, #347474 100%);
  color: white;
  margin-bottom: 2rem;
}

.showcase-section {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.showcase-section h2 {
  color: #2d3748;
  margin-bottom: 1rem;
  border-bottom: 2px solid #42b883;
  padding-bottom: 0.5rem;
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}
</style>
