import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// Create Vue app instance
const app = createApp(App)

// Add Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Mount app to DOM
app.mount('#app')
