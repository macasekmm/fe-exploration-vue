<template>
  <div class="child-component">
    <h4>Child Component</h4>
    <p class="child-description">This child component can emit events to its parent</p>

    <div class="child-controls">
      <button @click="sendMessage" class="btn btn-primary">Send Message to Parent</button>
      <button @click="sendData" class="btn btn-info">Send Data to Parent</button>
      <button @click="triggerAlert" class="btn btn-warning">Trigger Parent Alert</button>
    </div>

    <div class="child-input">
      <label for="childMessage">Custom Message:</label>
      <input
        id="childMessage"
        v-model="customMessage"
        type="text"
        placeholder="Enter a custom message"
        class="form-input"
      />
      <button @click="sendCustomMessage" class="btn btn-secondary">Send Custom</button>
    </div>

    <div class="child-counter">
      <p>Child Counter: {{ childCounter }}</p>
      <button @click="incrementCounter" class="btn btn-success">Increment & Notify Parent</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'EventEmitterChild',
  // Define custom events that this component can emit
  emits: ['message-sent', 'data-sent', 'alert-triggered', 'counter-changed'],

  setup(props, { emit }) {
    // Local reactive state
    const customMessage = ref('')
    const childCounter = ref(0)

    // Methods that emit events to parent
    const sendMessage = () => {
      // Emit a simple event with a message
      emit('message-sent', {
        message: 'Hello from child component!',
        timestamp: new Date().toLocaleTimeString(),
        source: 'EventEmitterChild',
      })
    }

    const sendData = () => {
      // Emit event with complex data object
      const data = {
        id: Math.random().toString(36).substr(2, 9),
        value: Math.floor(Math.random() * 100),
        type: 'random-data',
        metadata: {
          generated: new Date().toISOString(),
          component: 'EventEmitterChild',
        },
      }
      emit('data-sent', data)
    }

    const triggerAlert = () => {
      // Emit event that parent should handle as an alert
      emit('alert-triggered', {
        level: 'warning',
        message: 'This is an alert from the child component!',
        action: 'display-alert',
      })
    }

    const sendCustomMessage = () => {
      if (customMessage.value.trim()) {
        emit('message-sent', {
          message: customMessage.value,
          timestamp: new Date().toLocaleTimeString(),
          source: 'EventEmitterChild',
          type: 'custom',
        })
        customMessage.value = '' // Clear input after sending
      }
    }

    const incrementCounter = () => {
      childCounter.value++
      // Emit the new counter value to parent
      emit('counter-changed', {
        newValue: childCounter.value,
        component: 'child',
        action: 'increment',
      })
    }

    return {
      customMessage,
      childCounter,
      sendMessage,
      sendData,
      triggerAlert,
      sendCustomMessage,
      incrementCounter,
    }
  },
}
</script>

<style scoped>
.child-component {
  padding: 1rem;
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  background: #f7fafc;
  margin: 1rem 0;
}

.child-component h4 {
  color: #2d3748;
  margin-bottom: 0.5rem;
}

.child-description {
  color: #718096;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.child-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.child-input {
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.child-input label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.child-counter {
  padding: 1rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.child-counter p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  color: #4a5568;
}

/* Button styles are inherited from global styles */
</style>
