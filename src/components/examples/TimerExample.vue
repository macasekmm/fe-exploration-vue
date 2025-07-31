<template>
  <BaseCard title="Timer Example">
    <div class="timer-container">
      <div class="timer-display">
        {{ formatTime(seconds) }}
      </div>

      <div class="timer-controls">
        <BaseButton @click="start" :disabled="isRunning" variant="primary"> Start </BaseButton>

        <BaseButton @click="pause" :disabled="!isRunning" variant="secondary"> Pause </BaseButton>

        <BaseButton @click="reset" variant="outline"> Reset </BaseButton>
      </div>

      <div class="timer-info">
        <p>Status: {{ isRunning ? 'Running' : 'Stopped' }}</p>
        <p>Total seconds: {{ seconds }}</p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { useTimer } from '@/composables/useTimer'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'

// Using the custom composable
const { seconds, isRunning, start, pause, reset, formatTime } = useTimer()
</script>

<style scoped>
.timer-container {
  text-align: center;
}

.timer-display {
  font-size: 4rem;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  color: #1f2937;
  margin: 2rem 0;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
}

.timer-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;
}

.timer-info {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
}
</style>
