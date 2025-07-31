<template>
  <BaseCard title="Form Validation Example">
    <form @submit.prevent="handleSubmit" class="form-container">
      <!-- Name field -->
      <div class="form-group">
        <label for="name">Name *</label>
        <BaseInput
          id="name"
          v-model="values.name"
          :error="touched.name && errors.name"
          @blur="setFieldTouched('name')"
          placeholder="Enter your name"
        />
      </div>

      <!-- Email field -->
      <div class="form-group">
        <label for="email">Email *</label>
        <BaseInput
          id="email"
          type="email"
          v-model="values.email"
          :error="touched.email && errors.email"
          @blur="setFieldTouched('email')"
          placeholder="Enter your email"
        />
      </div>

      <!-- Age field -->
      <div class="form-group">
        <label for="age">Age</label>
        <BaseInput
          id="age"
          type="number"
          v-model.number="values.age"
          :error="touched.age && errors.age"
          @blur="setFieldTouched('age')"
          placeholder="Enter your age"
        />
      </div>

      <!-- Category field -->
      <div class="form-group">
        <label for="category">Category</label>
        <select
          id="category"
          v-model="values.category"
          @blur="setFieldTouched('category')"
          class="form-select"
        >
          <option value="">Select a category</option>
          <option value="developer">Developer</option>
          <option value="designer">Designer</option>
          <option value="manager">Manager</option>
          <option value="other">Other</option>
        </select>
        <span v-if="touched.category && errors.category" class="error-text">
          {{ errors.category }}
        </span>
      </div>

      <!-- Interests checkboxes -->
      <div class="form-group">
        <label>Interests</label>
        <div class="checkbox-group">
          <label v-for="interest in availableInterests" :key="interest" class="checkbox-label">
            <input
              type="checkbox"
              :value="interest"
              v-model="values.interests"
              @change="setFieldTouched('interests')"
            />
            {{ interest }}
          </label>
        </div>
        <span v-if="touched.interests && errors.interests" class="error-text">
          {{ errors.interests }}
        </span>
      </div>

      <!-- Newsletter subscription -->
      <div class="form-group">
        <label class="checkbox-label">
          <input
            type="checkbox"
            v-model="values.newsletter"
            @change="setFieldTouched('newsletter')"
          />
          Subscribe to newsletter
        </label>
      </div>

      <!-- Comments textarea -->
      <div class="form-group">
        <label for="comments">Comments</label>
        <textarea
          id="comments"
          v-model="values.comments"
          @blur="setFieldTouched('comments')"
          class="form-textarea"
          placeholder="Any additional comments..."
          rows="4"
        ></textarea>
        <span v-if="touched.comments && errors.comments" class="error-text">
          {{ errors.comments }}
        </span>
      </div>

      <!-- Form actions -->
      <div class="form-actions">
        <BaseButton type="submit" :disabled="!isValid || isSubmitting" variant="primary">
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </BaseButton>

        <BaseButton type="button" @click="reset" variant="outline"> Reset </BaseButton>
      </div>

      <!-- Form state display -->
      <div class="form-debug" v-if="showDebug">
        <h4>Form State (Debug)</h4>
        <pre>{{ JSON.stringify({ values, errors, touched, isValid }, null, 2) }}</pre>
      </div>

      <BaseButton @click="showDebug = !showDebug" variant="outline" size="small">
        {{ showDebug ? 'Hide' : 'Show' }} Debug Info
      </BaseButton>
    </form>

    <!-- Submission result -->
    <div v-if="submissionResult" class="submission-result">
      <h3>Form Submitted Successfully!</h3>
      <pre>{{ JSON.stringify(submissionResult, null, 2) }}</pre>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'

// Form state
const isSubmitting = ref(false)
const submissionResult = ref(null)
const showDebug = ref(false)

const availableInterests = ['Programming', 'Design', 'Music', 'Sports', 'Reading', 'Travel']

// Initial form values
const initialValues = {
  name: '',
  email: '',
  age: null,
  category: '',
  interests: [],
  newsletter: false,
  comments: '',
}

// Use form validation composable
const {
  values,
  errors,
  touched,
  isValid,
  setFieldValue,
  setFieldTouched,
  setFieldRule,
  validateAll,
  reset,
} = useFormValidation(initialValues)

// Validation rules
const setupValidationRules = () => {
  setFieldRule('name', (value) => {
    if (!value || !value.trim()) return 'Name is required'
    if (value.trim().length < 2) return 'Name must be at least 2 characters'
    return null
  })

  setFieldRule('email', (value) => {
    if (!value || !value.trim()) return 'Email is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return 'Please enter a valid email'
    return null
  })

  setFieldRule('age', (value) => {
    if (value !== null && value !== undefined && value !== '') {
      if (value < 13) return 'Must be at least 13 years old'
      if (value > 120) return 'Please enter a valid age'
    }
    return null
  })

  setFieldRule('category', (value) => {
    // Optional field, no validation needed
    return null
  })

  setFieldRule('interests', (value) => {
    if (value && value.length > 5) return 'Please select at most 5 interests'
    return null
  })

  setFieldRule('comments', (value) => {
    if (value && value.length > 500) return 'Comments must be less than 500 characters'
    return null
  })
}

// Form submission
const handleSubmit = async () => {
  if (!validateAll()) {
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    submissionResult.value = {
      ...values.value,
      submittedAt: new Date().toISOString(),
    }

    console.log('Form submitted:', submissionResult.value)
  } catch (error) {
    console.error('Submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Setup validation rules on component mount
onMounted(() => {
  setupValidationRules()
})
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: normal;
  cursor: pointer;
}

.checkbox-label input[type='checkbox'] {
  margin: 0;
}

.error-text {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.form-debug {
  background: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
  margin: 1rem 0;
  font-size: 0.875rem;
}

.form-debug pre {
  margin: 0;
  white-space: pre-wrap;
}

.submission-result {
  background: #ecfdf5;
  border: 1px solid #10b981;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 2rem;
}

.submission-result h3 {
  color: #047857;
  margin-bottom: 1rem;
}

.submission-result pre {
  background: white;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
