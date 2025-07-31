import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'

const app = createApp(App)

// Vue 3 uses createApp() instead of new Vue()
// Plugins are installed using app.use()
app.use(createPinia()) // State management
app.use(router) // Routing

app.mount('#app')
