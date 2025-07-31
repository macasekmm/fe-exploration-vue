<template>
  <BaseCard title="Component Communication Example">
    <div class="communication-demo">
      <!-- Parent to Child: Props -->
      <section class="demo-section">
        <h3>Parent → Child (Props)</h3>
        <div class="controls">
          <BaseButton @click="parentMessage = 'Hello from Parent!'" variant="primary">
            Send Message
          </BaseButton>
          <BaseButton @click="parentCount++" variant="secondary"> Increment Count </BaseButton>
        </div>

        <ChildComponent :message="parentMessage" :count="parentCount" :user="parentUser" />
      </section>

      <!-- Child to Parent: Events -->
      <section class="demo-section">
        <h3>Child → Parent (Events)</h3>
        <p>Messages from child: {{ childMessages.length }}</p>
        <div class="message-list">
          <div v-for="(msg, index) in childMessages" :key="index" class="message-item">
            {{ msg }}
          </div>
        </div>

        <EventEmitterChild @child-event="handleChildEvent" @count-changed="handleCountChange" />
      </section>

      <!-- Provide/Inject -->
      <section class="demo-section">
        <h3>Provide/Inject (Deep Nesting)</h3>
        <p>Theme: {{ currentTheme }}</p>
        <BaseButton @click="toggleTheme" variant="outline"> Toggle Theme </BaseButton>

        <GrandparentComponent />
      </section>

      <!-- Store/Global State -->
      <section class="demo-section">
        <h3>Global State (Pinia Store)</h3>
        <p>Global counter: {{ store.count }}</p>
        <StoreConsumerChild />
      </section>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, provide } from 'vue'
import { useCounterStore } from '@/stores/counter'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

// Import child components (these would be separate files)
import ChildComponent from './communication/ChildComponent.vue'
import EventEmitterChild from './communication/EventEmitterChild.vue'
import GrandparentComponent from './communication/GrandparentComponent.vue'
import StoreConsumerChild from './communication/StoreConsumerChild.vue'

// Parent state
const parentMessage = ref('Initial message')
const parentCount = ref(0)
const parentUser = ref({
  name: 'John Doe',
  role: 'Developer',
})

const childMessages = ref([])
const currentTheme = ref('light')

// Store
const store = useCounterStore()

// Event handlers
const handleChildEvent = (data) => {
  childMessages.value.push(`Child said: ${data.message} at ${new Date().toLocaleTimeString()}`)
}

const handleCountChange = (newCount) => {
  console.log('Child count changed to:', newCount)
}

const toggleTheme = () => {
  currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
}

// Provide theme to all children
provide('theme', currentTheme)
provide('toggleTheme', toggleTheme)
</script>

<style scoped>
.communication-demo {
  max-width: 800px;
  margin: 0 auto;
}

.demo-section {
  margin-bottom: 3rem;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.demo-section h3 {
  margin-bottom: 1rem;
  color: #1f2937;
}

.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.message-list {
  max-height: 200px;
  overflow-y: auto;
  background: #f8fafc;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
}

.message-item {
  padding: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.9rem;
}

.message-item:last-child {
  border-bottom: none;
}
</style>
