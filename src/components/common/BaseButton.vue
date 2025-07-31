<template>
  <button :type="type" :disabled="disabled" :class="buttonClasses" @click="$emit('click', $event)">
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'danger'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  type: {
    type: String,
    default: 'button',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

// Define emits
const emit = defineEmits(['click'])

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--disabled': props.disabled,
  },
])
</script>

<style scoped>
.base-button {
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.base-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}

/* Variants */
.base-button--primary {
  background: #3b82f6;
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background: #2563eb;
}

.base-button--secondary {
  background: #6b7280;
  color: white;
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background: #4b5563;
}

.base-button--outline {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
}

.base-button--outline:hover:not(.base-button--disabled) {
  background: #f9fafb;
}

.base-button--danger {
  background: #ef4444;
  color: white;
}

.base-button--danger:hover:not(.base-button--disabled) {
  background: #dc2626;
}

/* Sizes */
.base-button--small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.base-button--medium {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.base-button--large {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

/* Disabled state */
.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
