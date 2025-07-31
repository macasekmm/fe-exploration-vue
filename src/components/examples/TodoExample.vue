<template>
  <BaseCard title="Todo List Example">
    <div class="todo-container">
      <!-- Add new todo form -->
      <form @submit.prevent="addTodo" class="add-todo-form">
        <BaseInput
          v-model="newTodoText"
          placeholder="Add a new todo..."
          :error="todoError"
          @blur="validateTodoInput"
        />
        <BaseButton type="submit" :disabled="!newTodoText.trim()" variant="primary">
          Add Todo
        </BaseButton>
      </form>

      <!-- Filter controls -->
      <div class="todo-filters">
        <BaseButton
          v-for="filterOption in filterOptions"
          :key="filterOption.value"
          @click="currentFilter = filterOption.value"
          :variant="currentFilter === filterOption.value ? 'primary' : 'outline'"
          size="small"
        >
          {{ filterOption.label }}
        </BaseButton>
      </div>

      <!-- Todo statistics -->
      <div class="todo-stats">
        <p>
          Total: {{ todos.length }} | Completed: {{ completedCount }} | Active: {{ activeCount }}
        </p>
      </div>

      <!-- Todo list -->
      <div class="todo-list">
        <div
          v-for="todo in filteredTodos"
          :key="todo.id"
          class="todo-item"
          :class="{ completed: todo.completed }"
        >
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo.id)"
            class="todo-checkbox"
          />

          <span class="todo-text">{{ todo.text }}</span>

          <div class="todo-actions">
            <BaseButton @click="removeTodo(todo.id)" variant="danger" size="small">
              Delete
            </BaseButton>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredTodos.length === 0" class="empty-state">
          <p>{{ getEmptyMessage() }}</p>
        </div>
      </div>

      <!-- Bulk actions -->
      <div class="bulk-actions" v-if="todos.length > 0">
        <BaseButton @click="toggleAll" variant="outline" size="small">
          {{ allCompleted ? 'Uncheck All' : 'Check All' }}
        </BaseButton>

        <BaseButton
          @click="clearCompleted"
          variant="outline"
          size="small"
          :disabled="completedCount === 0"
        >
          Clear Completed
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import BaseInput from '@/components/common/BaseInput.vue'

// Reactive state
const todos = ref([
  { id: 1, text: 'Learn Vue.js fundamentals', completed: true },
  { id: 2, text: 'Build a todo app', completed: false },
  { id: 3, text: 'Compare Vue with React', completed: false },
])

const newTodoText = ref('')
const currentFilter = ref('all')
const todoError = ref('')
const nextId = ref(4)

// Filter options
const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
]

// Computed properties
const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length)

const activeCount = computed(() => todos.value.filter((todo) => !todo.completed).length)

const allCompleted = computed(
  () => todos.value.length > 0 && todos.value.every((todo) => todo.completed),
)

const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return todos.value.filter((todo) => !todo.completed)
    case 'completed':
      return todos.value.filter((todo) => todo.completed)
    default:
      return todos.value
  }
})

// Methods
const addTodo = () => {
  if (validateTodoInput()) {
    todos.value.push({
      id: nextId.value++,
      text: newTodoText.value.trim(),
      completed: false,
    })
    newTodoText.value = ''
    todoError.value = ''
  }
}

const toggleTodo = (id) => {
  const todo = todos.value.find((t) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

const removeTodo = (id) => {
  const index = todos.value.findIndex((t) => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
  }
}

const toggleAll = () => {
  const shouldComplete = !allCompleted.value
  todos.value.forEach((todo) => {
    todo.completed = shouldComplete
  })
}

const clearCompleted = () => {
  todos.value = todos.value.filter((todo) => !todo.completed)
}

const validateTodoInput = () => {
  const text = newTodoText.value.trim()
  if (!text) {
    todoError.value = 'Todo text cannot be empty'
    return false
  }
  if (text.length < 3) {
    todoError.value = 'Todo must be at least 3 characters'
    return false
  }
  todoError.value = ''
  return true
}

const getEmptyMessage = () => {
  switch (currentFilter.value) {
    case 'active':
      return 'No active todos! 🎉'
    case 'completed':
      return 'No completed todos yet.'
    default:
      return 'No todos yet. Add one above!'
  }
}

// Watchers - Vue's way to perform side effects on reactive data changes
watch(newTodoText, (newValue) => {
  if (newValue && todoError.value) {
    validateTodoInput()
  }
})

watch(
  todos,
  (newTodos) => {
    console.log(`Todo count changed to: ${newTodos.length}`)
  },
  { deep: true },
) // deep watch for nested changes
</script>

<style scoped>
.todo-container {
  max-width: 600px;
  margin: 0 auto;
}

.add-todo-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.todo-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.todo-stats {
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 0.9rem;
}

.todo-list {
  min-height: 200px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition: all 0.2s;
}

.todo-item:hover {
  background: #f8fafc;
}

.todo-item.completed {
  opacity: 0.6;
  background: #f0f9ff;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
}

.todo-checkbox {
  margin: 0;
}

.todo-text {
  flex: 1;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
}

.bulk-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}
</style>
