<template>
  <!-- Vue uses template syntax with directives -->
  <div id="app">
    <AppHeader />
    <AppNavigation />

    <!-- Router outlet for different views -->
    <main class="main-content">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
// Composition API setup - Vue 3's recommended approach
import { onMounted, provide } from 'vue'
import AppHeader from './components/layout/AppHeader.vue'
import AppNavigation from './components/layout/AppNavigation.vue'
import AppFooter from './components/layout/AppFooter.vue'

// Provide/Inject - Vue's dependency injection system
provide('appName', 'Vue Framework Showcase')

onMounted(() => {
  console.log('Vue app mounted - similar to React useEffect with empty deps')
})
</script>

<style scoped>
/* Scoped styles - unique to Vue, prevents CSS leakage */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
