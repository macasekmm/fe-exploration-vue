<template>
  <div class="form-component">
    <h3>Form Handling & Validation</h3>
    <p class="form-description">
      Demonstrates: Two-way binding, form validation, computed properties, and watchers
    </p>

    <form @submit.prevent="handleSubmit" class="validation-form" novalidate>
      <!-- Name Field -->
      <div class="form-group">
        <label for="name" class="form-label"> Full Name * </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="form-input"
          :class="{ error: errors.name, success: form.name && !errors.name }"
          placeholder="Enter your full name"
        />
        <div v-if="errors.name" class="error-message">
          {{ errors.name }}
        </div>
      </div>

      <!-- Email Field -->
      <div class="form-group">
        <label for="email" class="form-label"> Email Address * </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-input"
          :class="{ error: errors.email, success: form.email && !errors.email }"
          placeholder="Enter your email"
        />
        <div v-if="errors.email" class="error-message">
          {{ errors.email }}
        </div>
      </div>

      <!-- Phone Field -->
      <div class="form-group">
        <label for="phone" class="form-label"> Phone Number </label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          class="form-input"
          :class="{ error: errors.phone, success: form.phone && !errors.phone }"
          placeholder="(555) 123-4567"
        />
        <div v-if="errors.phone" class="error-message">
          {{ errors.phone }}
        </div>
      </div>

      <!-- Age Field -->
      <div class="form-group">
        <label for="age" class="form-label"> Age * </label>
        <input
          id="age"
          v-model.number="form.age"
          type="number"
          min="1"
          max="120"
          class="form-input"
          :class="{ error: errors.age, success: form.age && !errors.age }"
          placeholder="Enter your age"
        />
        <div v-if="errors.age" class="error-message">
          {{ errors.age }}
        </div>
      </div>

      <!-- Password Field -->
      <div class="form-group">
        <label for="password" class="form-label"> Password * </label>
        <div class="password-input-wrapper">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="form-input"
            :class="{ error: errors.password, success: form.password && !errors.password }"
            placeholder="Enter a secure password"
          />
          <button type="button" @click="showPassword = !showPassword" class="password-toggle">
            {{ showPassword ? '👁️' : '🙈' }}
          </button>
        </div>
        <div v-if="errors.password" class="error-message">
          {{ errors.password }}
        </div>
        <div class="password-strength">
          <div class="strength-bar">
            <div
              class="strength-fill"
              :class="`strength-${passwordStrength.level}`"
              :style="{ width: passwordStrength.percentage + '%' }"
            ></div>
          </div>
          <span class="strength-text">{{ passwordStrength.text }}</span>
        </div>
      </div>

      <!-- Confirm Password Field -->
      <div class="form-group">
        <label for="confirmPassword" class="form-label"> Confirm Password * </label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          class="form-input"
          :class="{
            error: errors.confirmPassword,
            success: form.confirmPassword && !errors.confirmPassword,
          }"
          placeholder="Confirm your password"
        />
        <div v-if="errors.confirmPassword" class="error-message">
          {{ errors.confirmPassword }}
        </div>
      </div>

      <!-- Terms Checkbox -->
      <div class="form-group">
        <label class="checkbox-label">
          <input v-model="form.acceptTerms" type="checkbox" class="form-checkbox" />
          <span class="checkbox-text">
            I accept the <a href="#" @click.prevent>terms and conditions</a> *
          </span>
        </label>
        <div v-if="errors.acceptTerms" class="error-message">
          {{ errors.acceptTerms }}
        </div>
      </div>

      <!-- Newsletter Checkbox -->
      <div class="form-group">
        <label class="checkbox-label">
          <input v-model="form.newsletter" type="checkbox" class="form-checkbox" />
          <span class="checkbox-text"> Subscribe to our newsletter </span>
        </label>
      </div>

      <!-- Submit Button -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary btn-large"
          :disabled="!isFormValid || isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Create Account' }}
        </button>
        <button type="button" @click="resetForm" class="btn btn-secondary">Reset Form</button>
      </div>

      <!-- Form Summary -->
      <div class="form-summary">
        <h4>Form Status</h4>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Valid:</span>
            <span :class="isFormValid ? 'text-success' : 'text-error'">
              {{ isFormValid ? 'Yes' : 'No' }}
            </span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Errors:</span>
            <span class="text-error">{{ totalErrors }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Fields Completed:</span>
            <span class="text-info">{{ completedFields }}/{{ totalFields }}</span>
          </div>
        </div>
      </div>
    </form>

    <!-- Submission Result -->
    <div v-if="submissionResult" class="submission-result" :class="submissionResult.type">
      <h4>{{ submissionResult.type === 'success' ? 'Success!' : 'Error!' }}</h4>
      <p>{{ submissionResult.message }}</p>
      <pre v-if="submissionResult.data">{{ JSON.stringify(submissionResult.data, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, watch } from 'vue'

export default {
  name: 'FormValidation',
  setup() {
    // Form data
    const form = reactive({
      name: '',
      email: '',
      phone: '',
      age: null,
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      newsletter: false,
    })

    // Form state
    const errors = reactive({})
    const showPassword = ref(false)
    const isSubmitting = ref(false)
    const submissionResult = ref(null)

    // Validation rules
    const validateName = (name) => {
      if (!name) return 'Name is required'
      if (name.length < 2) return 'Name must be at least 2 characters'
      if (name.length > 50) return 'Name must be less than 50 characters'
      if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name can only contain letters and spaces'
      return null
    }

    const validateEmail = (email) => {
      if (!email) return 'Email is required'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) return 'Please enter a valid email address'
      return null
    }

    const validatePhone = (phone) => {
      if (!phone) return null // Phone is optional
      const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
      if (!phoneRegex.test(phone)) return 'Please enter a valid phone number'
      return null
    }

    const validateAge = (age) => {
      if (!age) return 'Age is required'
      if (isNaN(age)) return 'Age must be a number'
      if (age < 1 || age > 120) return 'Age must be between 1 and 120'
      return null
    }

    const validatePassword = (password) => {
      if (!password) return 'Password is required'
      if (password.length < 8) return 'Password must be at least 8 characters'
      if (!/(?=.*[a-z])/.test(password))
        return 'Password must contain at least one lowercase letter'
      if (!/(?=.*[A-Z])/.test(password))
        return 'Password must contain at least one uppercase letter'
      if (!/(?=.*\d)/.test(password)) return 'Password must contain at least one number'
      if (!/(?=.*[@$!%*?&])/.test(password))
        return 'Password must contain at least one special character'
      return null
    }

    const validateConfirmPassword = (confirmPassword, password) => {
      if (!confirmPassword) return 'Please confirm your password'
      if (confirmPassword !== password) return 'Passwords do not match'
      return null
    }

    const validateTerms = (acceptTerms) => {
      if (!acceptTerms) return 'You must accept the terms and conditions'
      return null
    }

    // Computed properties
    const passwordStrength = computed(() => {
      const password = form.password
      if (!password) return { level: 'none', percentage: 0, text: 'Enter a password' }

      let score = 0
      const checks = []

      if (password.length >= 8) {
        score += 20
        checks.push('8+ characters')
      }
      if (/[a-z]/.test(password)) {
        score += 20
        checks.push('lowercase')
      }
      if (/[A-Z]/.test(password)) {
        score += 20
        checks.push('uppercase')
      }
      if (/\d/.test(password)) {
        score += 20
        checks.push('number')
      }
      if (/[@$!%*?&]/.test(password)) {
        score += 20
        checks.push('special char')
      }

      let level, text
      if (score < 40) {
        level = 'weak'
        text = 'Weak'
      } else if (score < 80) {
        level = 'medium'
        text = 'Medium'
      } else {
        level = 'strong'
        text = 'Strong'
      }

      return { level, percentage: score, text: `${text} (${checks.join(', ')})` }
    })

    const isFormValid = computed(() => {
      return (
        Object.keys(errors).length === 0 &&
        form.name &&
        form.email &&
        form.age &&
        form.password &&
        form.confirmPassword &&
        form.acceptTerms
      )
    })

    const totalErrors = computed(() => Object.keys(errors).length)

    const completedFields = computed(() => {
      let count = 0
      if (form.name) count++
      if (form.email) count++
      if (form.phone) count++
      if (form.age) count++
      if (form.password) count++
      if (form.confirmPassword) count++
      if (form.acceptTerms) count++
      return count
    })

    const totalFields = 7

    // Watchers for real-time validation
    watch(
      () => form.name,
      (newVal) => {
        const error = validateName(newVal)
        if (error) {
          errors.name = error
        } else {
          delete errors.name
        }
      },
    )

    watch(
      () => form.email,
      (newVal) => {
        const error = validateEmail(newVal)
        if (error) {
          errors.email = error
        } else {
          delete errors.email
        }
      },
    )

    watch(
      () => form.phone,
      (newVal) => {
        const error = validatePhone(newVal)
        if (error) {
          errors.phone = error
        } else {
          delete errors.phone
        }
      },
    )

    watch(
      () => form.age,
      (newVal) => {
        const error = validateAge(newVal)
        if (error) {
          errors.age = error
        } else {
          delete errors.age
        }
      },
    )

    watch(
      () => form.password,
      (newVal) => {
        const error = validatePassword(newVal)
        if (error) {
          errors.password = error
        } else {
          delete errors.password
        }

        // Also revalidate confirm password
        if (form.confirmPassword) {
          const confirmError = validateConfirmPassword(form.confirmPassword, newVal)
          if (confirmError) {
            errors.confirmPassword = confirmError
          } else {
            delete errors.confirmPassword
          }
        }
      },
    )

    watch(
      () => form.confirmPassword,
      (newVal) => {
        const error = validateConfirmPassword(newVal, form.password)
        if (error) {
          errors.confirmPassword = error
        } else {
          delete errors.confirmPassword
        }
      },
    )

    watch(
      () => form.acceptTerms,
      (newVal) => {
        const error = validateTerms(newVal)
        if (error) {
          errors.acceptTerms = error
        } else {
          delete errors.acceptTerms
        }
      },
    )

    // Methods
    const handleSubmit = async () => {
      // Clear previous result
      submissionResult.value = null

      if (!isFormValid.value) {
        submissionResult.value = {
          type: 'error',
          message: 'Please fix all validation errors before submitting.',
        }
        return
      }

      isSubmitting.value = true

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate random success/failure
        if (Math.random() > 0.2) {
          submissionResult.value = {
            type: 'success',
            message: 'Account created successfully!',
            data: {
              name: form.name,
              email: form.email,
              phone: form.phone || 'Not provided',
              age: form.age,
              newsletter: form.newsletter,
              timestamp: new Date().toISOString(),
            },
          }

          // Reset form on success
          setTimeout(() => {
            resetForm()
          }, 3000)
        } else {
          throw new Error('Server error occurred')
        }
      } catch (error) {
        submissionResult.value = {
          type: 'error',
          message: 'Failed to create account. Please try again.',
        }
      } finally {
        isSubmitting.value = false
      }
    }

    const resetForm = () => {
      // Reset form data
      Object.assign(form, {
        name: '',
        email: '',
        phone: '',
        age: null,
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        newsletter: false,
      })

      // Clear errors
      Object.keys(errors).forEach((key) => delete errors[key])

      // Clear submission result
      submissionResult.value = null
      showPassword.value = false
    }

    return {
      form,
      errors,
      showPassword,
      isSubmitting,
      submissionResult,
      passwordStrength,
      isFormValid,
      totalErrors,
      completedFields,
      totalFields,
      handleSubmit,
      resetForm,
    }
  },
}
</script>

<style scoped>
.form-component {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  max-width: 600px;
  margin: 0 auto;
}

.validation-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input.success {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.password-input-wrapper {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.error-message {
  margin-top: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
}

.password-strength {
  margin-top: 0.5rem;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s;
}

.strength-weak {
  background: #ef4444;
}

.strength-medium {
  background: #f59e0b;
}

.strength-strong {
  background: #10b981;
}

.strength-text {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.form-checkbox {
  margin-top: 0.125rem;
}

.checkbox-text {
  flex: 1;
  color: #374151;
}

.checkbox-text a {
  color: #3b82f6;
  text-decoration: underline;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn-large {
  padding: 0.875rem 2rem;
  font-size: 1.1rem;
}

.form-summary {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.form-summary h4 {
  margin: 0 0 0.75rem 0;
  color: #374151;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  color: #6b7280;
  font-weight: 500;
}

.text-success {
  color: #10b981;
  font-weight: 600;
}

.text-error {
  color: #ef4444;
  font-weight: 600;
}

.text-info {
  color: #3b82f6;
  font-weight: 600;
}

.submission-result {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid;
}

.submission-result.success {
  background: #f0fdf4;
  border-color: #22c55e;
  color: #15803d;
}

.submission-result.error {
  background: #fef2f2;
  border-color: #ef4444;
  color: #dc2626;
}

.submission-result h4 {
  margin: 0 0 0.5rem 0;
}

.submission-result pre {
  background: rgba(0, 0, 0, 0.05);
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-top: 0.75rem;
  overflow-x: auto;
}
</style>
