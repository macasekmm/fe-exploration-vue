<template>
  <div class="parent-component">
    <h3>Event Communication Demo</h3>
    <p class="parent-description">
      Demonstrates: Parent-child communication, custom events, and event handling
    </p>

    <!-- Parent State Display -->
    <div class="parent-state">
      <h4>Parent Component State</h4>
      <div class="state-grid">
        <div class="state-item"><strong>Messages Received:</strong> {{ messagesReceived }}</div>
        <div class="state-item"><strong>Data Packets:</strong> {{ dataPackets.length }}</div>
        <div class="state-item"><strong>Child Counter Value:</strong> {{ childCounterValue }}</div>
        <div class="state-item"><strong>Last Alert:</strong> {{ lastAlert || 'None' }}</div>
      </div>
    </div>

    <!-- Event Log -->
    <div class="event-log">
      <div class="log-header">
        <h4>Event Log</h4>
        <button @click="clearLog" class="btn btn-small btn-secondary">Clear Log</button>
      </div>
      <div class="log-content">
        <div
          v-for="(event, index) in eventLog"
          :key="index"
          class="log-entry"
          :class="`log-${event.type}`"
        >
          <span class="log-time">{{ event.timestamp }}</span>
          <span class="log-message">{{ event.message }}</span>
        </div>
        <p v-if="eventLog.length === 0" class="log-empty">
          No events yet. Interact with the child component below.
        </p>
      </div>
    </div>

    <!-- Child Component -->
    <div class="child-container">
      <EventEmitterChild
        @message-sent="handleMessageSent"
        @data-sent="handleDataSent"
        @alert-triggered="handleAlertTriggered"
        @counter-changed="handleCounterChanged"
      />
    </div>

    <!-- Parent Controls -->
    <div class="parent-controls">
      <h4>Parent Actions</h4>
      <button @click="sendMessageToChild" class="btn btn-primary">
        Send Message to Child (via props)
      </button>
      <button @click="resetParentState" class="btn btn-warning">Reset Parent State</button>
    </div>

    <!-- Data Display -->
    <div v-if="dataPackets.length > 0" class="data-display">
      <h4>Received Data Packets</h4>
      <div class="data-grid">
        <div v-for="(packet, index) in dataPackets.slice(-3)" :key="index" class="data-packet">
          <div class="packet-header">Packet {{ packet.id }}</div>
          <div class="packet-content">
            <p><strong>Value:</strong> {{ packet.value }}</p>
            <p><strong>Type:</strong> {{ packet.type }}</p>
            <p><strong>Generated:</strong> {{ formatTime(packet.metadata.generated) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import EventEmitterChild from './EventEmitterChild.vue'

export default {
  name: 'EventEmitterParent',
  components: {
    EventEmitterChild,
  },

  setup() {
    // Reactive state for tracking child events
    const messagesReceived = ref(0)
    const dataPackets = reactive([])
    const childCounterValue = ref(0)
    const lastAlert = ref('')
    const eventLog = reactive([])

    // Helper methods
    const addToLog = (type, message) => {
      eventLog.unshift({
        type,
        message,
        timestamp: new Date().toLocaleTimeString(),
      })

      // Keep only last 20 events
      if (eventLog.length > 20) {
        eventLog.splice(20)
      }
    }

    const formatTime = (isoString) => {
      return new Date(isoString).toLocaleTimeString()
    }

    // Event handlers for child events
    const handleMessageSent = (payload) => {
      messagesReceived.value++
      addToLog('message', `Message: "${payload.message}" from ${payload.source}`)

      console.log('Parent received message:', payload)
    }

    const handleDataSent = (data) => {
      dataPackets.push(data)
      addToLog('data', `Data packet received: ID ${data.id}, Value ${data.value}`)

      console.log('Parent received data:', data)
    }

    const handleAlertTriggered = (alertData) => {
      lastAlert.value = `${alertData.level.toUpperCase()}: ${alertData.message}`
      addToLog('alert', `Alert triggered: ${alertData.message}`)

      // Show browser alert for demonstration
      alert(`Child Component Alert\n\nLevel: ${alertData.level}\nMessage: ${alertData.message}`)

      console.log('Parent received alert:', alertData)
    }

    const handleCounterChanged = (counterData) => {
      childCounterValue.value = counterData.newValue
      addToLog('counter', `Child counter changed to ${counterData.newValue}`)

      console.log('Parent received counter update:', counterData)
    }

    // Parent actions
    const sendMessageToChild = () => {
      // In a real app, you might pass props or use a different communication method
      addToLog('parent', 'Parent sent message to child (via props)')
      alert('In a real application, this would send data to child via props or provide/inject')
    }

    const resetParentState = () => {
      messagesReceived.value = 0
      dataPackets.splice(0)
      childCounterValue.value = 0
      lastAlert.value = ''
      addToLog('parent', 'Parent state reset')
    }

    const clearLog = () => {
      eventLog.splice(0)
    }

    return {
      messagesReceived,
      dataPackets,
      childCounterValue,
      lastAlert,
      eventLog,
      handleMessageSent,
      handleDataSent,
      handleAlertTriggered,
      handleCounterChanged,
      sendMessageToChild,
      resetParentState,
      clearLog,
      formatTime,
    }
  },
}
</script>

<style scoped>
.parent-component {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.parent-state {
  margin: 1rem 0;
  padding: 1rem;
  background: #edf2f7;
  border-radius: 8px;
  border: 1px solid #cbd5e0;
}

.state-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.state-item {
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  border: 1px solid #e2e8f0;
}

.event-log {
  margin: 1rem 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: #edf2f7;
  border-radius: 8px 8px 0 0;
}

.log-header h4 {
  margin: 0;
  color: #2d3748;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
}

.log-entry {
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.log-message {
  color: #2d3748;
}

.log-time {
  color: #718096;
  font-family: 'Courier New', monospace;
  flex-shrink: 0;
}

.log-message {
  flex: 1;
}

.log-entry.log-message {
  background: #e6fffa;
  border-left: 3px solid #38b2ac;
}

.log-entry.log-data {
  background: #ebf8ff;
  border-left: 3px solid #3182ce;
}

.log-entry.log-alert {
  background: #fffbeb;
  border-left: 3px solid #f6ad55;
}

.log-entry.log-counter {
  background: #f0fff4;
  border-left: 3px solid #48bb78;
}

.log-entry.log-parent {
  background: #faf5ff;
  border-left: 3px solid #9f7aea;
}

.log-empty {
  text-align: center;
  color: #718096;
  font-style: italic;
  padding: 2rem;
}

.child-container {
  margin: 1.5rem 0;
}

.parent-controls {
  margin: 1rem 0;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.parent-controls h4 {
  margin: 0 0 1rem 0;
  color: #2d3748;
}

.parent-controls button {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.data-display {
  margin: 1rem 0;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #bfdbfe;
}

.data-display h4 {
  margin: 0 0 1rem 0;
  color: #1e40af;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.data-packet {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.packet-header {
  background: #3b82f6;
  color: white;
  padding: 0.5rem;
  font-weight: 500;
}

.packet-content {
  padding: 0.75rem;
}

.packet-content p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.btn-small {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}
</style>
