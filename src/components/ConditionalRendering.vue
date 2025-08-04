<template>
  <div class="conditional-component">
    <h3>Conditional Rendering</h3>
    <p class="conditional-description">
      Demonstrates: v-if, v-else-if, v-else, v-show, and dynamic components
    </p>

    <!-- Toggle Controls -->
    <div class="toggle-controls">
      <button @click="showContent = !showContent" class="btn btn-primary">
        {{ showContent ? 'Hide' : 'Show' }} Content
      </button>
      <button @click="toggleMode" class="btn btn-secondary">
        Switch to {{ currentMode === 'light' ? 'Dark' : 'Light' }} Mode
      </button>
    </div>

    <!-- Basic Conditional Rendering -->
    <div class="conditional-section">
      <h4>Basic v-if / v-else</h4>
      <div v-if="showContent" class="content-box">
        <p>✅ Content is visible! This uses v-if directive.</p>
        <p>The element is added/removed from the DOM.</p>
      </div>
      <div v-else class="content-box empty">
        <p>❌ Content is hidden. This shows when v-if is false.</p>
      </div>
    </div>

    <!-- v-show vs v-if comparison -->
    <div class="conditional-section">
      <h4>v-show vs v-if</h4>
      <div class="comparison-grid">
        <div class="comparison-item">
          <h5>Using v-if (DOM manipulation)</h5>
          <div v-if="showContent" class="demo-box">v-if: Element exists in DOM</div>
          <div v-else class="demo-box">v-if: Different element in DOM</div>
        </div>
        <div class="comparison-item">
          <h5>Using v-show (CSS display)</h5>
          <div v-show="showContent" class="demo-box">
            v-show: Element always in DOM, visibility toggled
          </div>
          <div v-show="!showContent" class="demo-box">
            v-show: Element always in DOM, visibility toggled
          </div>
        </div>
      </div>
    </div>

    <!-- Multiple Conditions -->
    <div class="conditional-section">
      <h4>Multiple Conditions (v-else-if)</h4>
      <div class="mode-selector">
        <button
          v-for="mode in modes"
          :key="mode"
          @click="currentMode = mode"
          :class="['mode-btn', { active: currentMode === mode }]"
        >
          {{ mode }}
        </button>
      </div>

      <div class="mode-display" :class="`mode-${currentMode}`">
        <div v-if="currentMode === 'light'" class="mode-content">
          ☀️ Light Mode Active
          <p>Clean, bright interface with light backgrounds</p>
        </div>
        <div v-else-if="currentMode === 'dark'" class="mode-content">
          🌙 Dark Mode Active
          <p>Sleek, dark interface that's easy on the eyes</p>
        </div>
        <div v-else-if="currentMode === 'auto'" class="mode-content">
          🔄 Auto Mode Active
          <p>Automatically switches based on system preference</p>
        </div>
        <div v-else class="mode-content">
          ❓ Unknown Mode
          <p>This shouldn't happen, but v-else catches it!</p>
        </div>
      </div>
    </div>

    <!-- Dynamic Components -->
    <div class="conditional-section">
      <h4>Dynamic Components</h4>
      <div class="component-selector">
        <button
          v-for="comp in availableComponents"
          :key="comp.name"
          @click="currentComponent = comp.name"
          :class="['comp-btn', { active: currentComponent === comp.name }]"
        >
          {{ comp.label }}
        </button>
      </div>

      <div class="dynamic-component-container">
        <component :is="currentComponent" :data="componentData" />
      </div>
    </div>

    <!-- Complex Conditional Logic -->
    <div class="conditional-section">
      <h4>Complex Conditional Logic</h4>
      <div class="user-controls">
        <label class="checkbox-label">
          <input v-model="user.isLoggedIn" type="checkbox" />
          User Logged In
        </label>
        <label class="checkbox-label">
          <input v-model="user.isPremium" type="checkbox" />
          Premium User
        </label>
        <label class="checkbox-label">
          <input v-model="user.isAdmin" type="checkbox" />
          Admin User
        </label>
      </div>

      <div class="user-status">
        <div v-if="!user.isLoggedIn" class="status-box guest">
          👤 Guest User
          <p>Please log in to access features</p>
          <button class="btn btn-primary">Log In</button>
        </div>

        <div v-else-if="user.isAdmin" class="status-box admin">
          👑 Admin User
          <p>Full access to all features and admin panel</p>
          <button class="btn btn-danger">Admin Dashboard</button>
        </div>

        <div v-else-if="user.isPremium" class="status-box premium">
          ⭐ Premium User
          <p>Access to premium features and priority support</p>
          <button class="btn btn-success">Premium Features</button>
        </div>

        <div v-else class="status-box basic">
          ✨ Basic User
          <p>Access to standard features</p>
          <button class="btn btn-secondary">Upgrade to Premium</button>
        </div>
      </div>
    </div>

    <!-- Template v-if -->
    <div class="conditional-section">
      <h4>Template Groups (v-if on &lt;template&gt;)</h4>
      <label class="checkbox-label">
        <input v-model="showAdvanced" type="checkbox" />
        Show Advanced Options
      </label>

      <template v-if="showAdvanced">
        <div class="advanced-section">
          <h5>Advanced Configuration</h5>
          <div class="form-group">
            <label>API Endpoint:</label>
            <input type="text" value="https://api.example.com" class="form-input" />
          </div>
          <div class="form-group">
            <label>Timeout (ms):</label>
            <input type="number" value="5000" class="form-input" />
          </div>
          <div class="form-group">
            <label>Max Retries:</label>
            <input type="number" value="3" class="form-input" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'

// Simple components for dynamic component demo
const InfoCard = {
  props: ['data'],
  template: `
    <div class="info-card">
      <h5>📊 Information Card</h5>
      <p>{{ data.message }}</p>
      <ul>
        <li v-for="item in data.items" :key="item">{{ item }}</li>
      </ul>
    </div>
  `,
}

const StatsWidget = {
  props: ['data'],
  template: `
    <div class="stats-widget">
      <h5>📈 Statistics Widget</h5>
      <div class="stats-grid">
        <div class="stat-item" v-for="stat in data.stats" :key="stat.label">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  `,
}

const MessageBox = {
  props: ['data'],
  template: `
    <div class="message-box">
      <h5>💬 Message Box</h5>
      <div class="message" :class="data.type">
        {{ data.message }}
      </div>
      <small>Type: {{ data.type }}</small>
    </div>
  `,
}

export default {
  name: 'ConditionalRendering',
  components: {
    InfoCard,
    StatsWidget,
    MessageBox,
  },

  setup() {
    // Basic state
    const showContent = ref(true)
    const currentMode = ref('light')
    const modes = ['light', 'dark', 'auto']
    const showAdvanced = ref(false)

    // User state for complex conditions
    const user = reactive({
      isLoggedIn: false,
      isPremium: false,
      isAdmin: false,
    })

    // Dynamic component state
    const currentComponent = ref('InfoCard')
    const availableComponents = [
      { name: 'InfoCard', label: 'Info Card' },
      { name: 'StatsWidget', label: 'Stats Widget' },
      { name: 'MessageBox', label: 'Message Box' },
    ]

    const componentData = reactive({
      message: 'This is dynamically rendered content!',
      items: ['Feature 1', 'Feature 2', 'Feature 3'],
      stats: [
        { label: 'Users', value: '1,234' },
        { label: 'Sales', value: '$56.7K' },
        { label: 'Growth', value: '+12%' },
      ],
      type: 'success',
    })

    // Methods
    const toggleMode = () => {
      const currentIndex = modes.indexOf(currentMode.value)
      const nextIndex = (currentIndex + 1) % modes.length
      currentMode.value = modes[nextIndex]
    }

    return {
      showContent,
      currentMode,
      modes,
      showAdvanced,
      user,
      currentComponent,
      availableComponents,
      componentData,
      toggleMode,
    }
  },
}
</script>

<style scoped>
.conditional-component {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.toggle-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.conditional-section {
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.conditional-section h4 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.content-box {
  padding: 1rem;
  border-radius: 6px;
  border: 2px solid;
  margin: 0.5rem 0;
}

.content-box:not(.empty) {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #15803d;
}

.content-box.empty {
  background: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.comparison-item h5 {
  margin: 0 0 0.5rem 0;
  color: #374151;
  font-size: 0.9rem;
}

.demo-box {
  padding: 0.75rem;
  background: #ddd6fe;
  border: 1px solid #8b5cf6;
  border-radius: 4px;
  color: #5b21b6;
  text-align: center;
  font-size: 0.875rem;
}

.mode-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.mode-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.mode-btn:hover {
  border-color: #3b82f6;
}

.mode-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.mode-display {
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid;
  transition: all 0.3s;
}

.mode-light {
  background: #fffbeb;
  border-color: #f59e0b;
  color: #92400e;
}

.mode-dark {
  background: #1f2937;
  border-color: #6b7280;
  color: #f9fafb;
}

.mode-auto {
  background: linear-gradient(45deg, #fffbeb 50%, #1f2937 50%);
  border-color: #8b5cf6;
  color: #1f2937;
}

.mode-content {
  text-align: center;
}

.mode-content p {
  margin: 0.5rem 0 0 0;
  opacity: 0.8;
}

.component-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.comp-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.comp-btn:hover {
  border-color: #8b5cf6;
}

.comp-btn.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.dynamic-component-container {
  min-height: 150px;
  padding: 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: white;
}

.info-card,
.stats-widget,
.message-box {
  height: 100%;
}

.info-card h5,
.stats-widget h5,
.message-box h5 {
  margin: 0 0 1rem 0;
  color: #374151;
}

.info-card ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: bold;
  color: #1f2937;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.message {
  padding: 0.75rem;
  border-radius: 6px;
  margin: 0.5rem 0;
}

.message.success {
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #22c55e;
}

.user-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.status-box {
  padding: 1.5rem;
  border-radius: 8px;
  border: 2px solid;
  text-align: center;
}

.status-box.guest {
  background: #f3f4f6;
  border-color: #6b7280;
  color: #374151;
}

.status-box.admin {
  background: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
}

.status-box.premium {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #15803d;
}

.status-box.basic {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #1d4ed8;
}

.status-box p {
  margin: 0.5rem 0 1rem 0;
}

.advanced-section {
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.advanced-section h5 {
  margin: 0 0 1rem 0;
  color: #374151;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
