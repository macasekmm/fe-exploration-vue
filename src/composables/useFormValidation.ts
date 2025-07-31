import { ref, computed, watch, Ref, ComputedRef } from 'vue'

type ValidationRule<T = any> = (value: T) => string | null

interface FormValues {
  [key: string]: any
}

interface UseFormValidationReturn<T extends FormValues> {
  values: Ref<T>
  errors: Ref<Record<string, string>>
  touched: Ref<Record<string, boolean>>
  isValid: ComputedRef<boolean>
  setFieldValue: (field: keyof T, value: any) => void
  setFieldTouched: (field: keyof T, isTouched?: boolean) => void
  setFieldRule: (field: keyof T, rule: ValidationRule) => void
  validateField: (field: keyof T) => void
  validateAll: () => boolean
  reset: () => void
}

export function useFormValidation<T extends FormValues>(
  initialValues: T,
): UseFormValidationReturn<T> {
  const values = ref<T>({ ...initialValues } as T)
  const errors = ref<Record<string, string>>({})
  const touched = ref<Record<string, boolean>>({})

  // Validation rules
  const rules = ref<Record<string, ValidationRule>>({})

  const isValid = computed((): boolean => {
    return Object.keys(errors.value).length === 0
  })

  const setFieldValue = (field: keyof T, value: any): void => {
    ;(values.value as any)[field] = value
    validateField(field)
  }

  const setFieldTouched = (field: keyof T, isTouched: boolean = true): void => {
    touched.value[field as string] = isTouched
  }

  const setFieldRule = (field: keyof T, rule: ValidationRule): void => {
    rules.value[field as string] = rule
  }

  const validateField = (field: keyof T): void => {
    const rule = rules.value[field as string]
    const value = (values.value as any)[field]

    if (rule && typeof rule === 'function') {
      const error = rule(value)
      if (error) {
        errors.value[field as string] = error
      } else {
        delete errors.value[field as string]
      }
    }
  }

  const validateAll = (): boolean => {
    Object.keys(rules.value).forEach((field) => {
      setFieldTouched(field as keyof T)
      validateField(field as keyof T)
    })
    return isValid.value
  }

  const reset = (): void => {
    values.value = { ...initialValues } as T
    errors.value = {}
    touched.value = {}
  }

  // Watch for changes and validate
  watch(
    values,
    (newValues) => {
      Object.keys(newValues).forEach((field) => {
        if (touched.value[field]) {
          validateField(field as keyof T)
        }
      })
    },
    { deep: true },
  )

  return {
    values,
    errors,
    touched,
    isValid,
    setFieldValue,
    setFieldTouched,
    setFieldRule,
    validateField,
    validateAll,
    reset,
  }
}
