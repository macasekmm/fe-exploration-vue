<template>
  <div class="todo-component">
    <h3>Todo List with Pinia State Management</h3>
    <p class="todo-description">
      Demonstrates: Global state management, computed properties, and list operations
    </p>

    <!-- Add Todo Form -->
    <form @submit.prevent="addTodo" class="add-todo-form">
      <div class="input-group">
        <input
          v-model="newTodoText"
          type="text"
          placeholder="Enter a new todo..."
          class="todo-input"
          required
        />
        <select v-model="newTodoPriority" class="priority-select">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" class="btn btn-primary">Add Todo</button>
      </div>
    </form>

    <!-- Filter Controls -->
    <div class="filter-controls">
      <button @click="setFilter('all')" :class="['filter-btn', { active: filter === 'all' }]">
        All ({{ totalTodos }})
      </button>
      <button @click="setFilter('active')" :class="['filter-btn', { active: filter === 'active' }]">
        Active ({{ activeTodos }})
      </button>
      <button
        @click="setFilter('completed')"
        :class="['filter-btn', { active: filter === 'completed' }]"
      >
        Completed ({{ completedTodos }})
      </button>
    </div>

    <!-- Todo Statistics -->
    <div class="todo-stats">
      <div class="stat-item">
        <span class="stat-value">{{ completionPercentage }}%</span>
        <span class="stat-label">Complete</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ highPriorityCount }}</span>
        <span class="stat-label">High Priority</span>
      </div>
    </div>

    <!-- Todo List -->
    <div class="todo-list">
      <div
        v-for="todo in filteredTodos"
        :key="todo.id"
        class="todo-item"
        :class="{
          completed: todo.completed,
          'high-priority': todo.priority === 'high',
          'medium-priority': todo.priority === 'medium',
        }"
      >
        <div class="todo-content">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="toggleTodo(todo.id)"
            class="todo-checkbox"
          />
          <span class="todo-text">{{ todo.text }}</span>
          <span class="todo-priority" :class="`priority-${todo.priority}`">
            {{ todo.priority }}
          </span>
        </div>
        <div class="todo-actions">
          <button @click="removeTodo(todo.id)" class="btn btn-danger btn-small">Delete</button>
        </div>
      </div>
      <p v-if="filteredTodos.length === 0" class="empty-message">
        {{ getEmptyMessage() }}
      </p>
    </div>

    <!-- Bulk Actions -->
    <div v-if="totalTodos > 0" class="bulk-actions">
      <button @click="toggleAll" class="btn btn-secondary">
        {{ allCompleted ? 'Mark All Incomplete' : 'Mark All Complete' }}
      </button>
      <button @click="clearCompleted" class="btn btn-warning" :disabled="completedTodos === 0">
        Clear Completed
      </button>
      <button @click="clearAll" class="btn btn-danger">Clear All</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useTodoStore } from '../stores/todo'

export default {
  name: 'TodoList',
  setup() {
    // Use Pinia store
    const todoStore = useTodoStore()

    // Local component state
    const newTodoText = ref('')
    const newTodoPriority = ref('medium')
    const filter = ref('all')

    // Computed properties from store
    const totalTodos = computed(() => todoStore.totalTodos)
    const activeTodos = computed(() => todoStore.activeTodos)
    const completedTodos = computed(() => todoStore.completedTodos)
    const allCompleted = computed(() => todoStore.allCompleted)
    const completionPercentage = computed(() => todoStore.completionPercentage)
    const highPriorityCount = computed(() => todoStore.highPriorityCount)

    // Filtered todos based on current filter
    const filteredTodos = computed(() => {
      switch (filter.value) {
        case 'active':
          return todoStore.activeTodosList
        case 'completed':
          return todoStore.completedTodosList
        default:
          return todoStore.todos
      }
    })

    // Methods
    const addTodo = () => {
      if (newTodoText.value.trim()) {
        todoStore.addTodo(newTodoText.value.trim(), newTodoPriority.value)
        newTodoText.value = ''
        newTodoPriority.value = 'medium'
      }
    }

    const toggleTodo = (id) => {
      todoStore.toggleTodo(id)
    }

    const removeTodo = (id) => {
      todoStore.removeTodo(id)
    }

    const setFilter = (newFilter) => {
      filter.value = newFilter
    }

    const toggleAll = () => {
      todoStore.toggleAll()
    }

    const clearCompleted = () => {
      todoStore.clearCompleted()
    }

    const clearAll = () => {
      todoStore.clearAll()
    }

    const getEmptyMessage = () => {
      switch (filter.value) {
        case 'active':
          return 'No active todos. Great job!'
        case 'completed':
          return 'No completed todos yet.'
        default:
          return 'No todos yet. Add one above!'
      }
    }

    return {
      // Local state
      newTodoText,
      newTodoPriority,
      filter,
      // Computed
      totalTodos,
      activeTodos,
      completedTodos,
      allCompleted,
      completionPercentage,
      highPriorityCount,
      filteredTodos,
      // Methods
      addTodo,
      toggleTodo,
      removeTodo,
      setFilter,
      toggleAll,
      clearCompleted,
      clearAll,
      getEmptyMessage,
    }
  },
}
</script>

<style scoped>
.todo-component {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  max-width: 600px;
  margin: 0 auto;
}

.add-todo-form {
  margin-bottom: 1.5rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.todo-input {
  flex: 1;
  min-width: 200px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.todo-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.priority-select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
}

.filter-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #e2e8f0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #3b82f6;
}

.filter-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.todo-stats {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #3b82f6;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.todo-list {
  margin-bottom: 1.5rem;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: white;
  transition: all 0.2s;
}

.todo-item:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-item.completed {
  background: #f0f9ff;
  opacity: 0.7;
}

.todo-item.high-priority {
  border-left: 4px solid #ef4444;
}

.todo-item.medium-priority {
  border-left: 4px solid #f59e0b;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.todo-checkbox {
  width: 1.25rem;
  height: 1.25rem;
}

.todo-text {
  flex: 1;
  color: #374151;
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: #6b7280;
}

.todo-priority {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.priority-high {
  background: #fee2e2;
  color: #dc2626;
}

.priority-medium {
  background: #fef3c7;
  color: #d97706;
}

.priority-low {
  background: #e0f2fe;
  color: #0369a1;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

.empty-message {
  text-align: center;
  color: #6b7280;
  font-style: italic;
  padding: 2rem;
  background: #f9fafb;
  border-radius: 6px;
  border: 2px dashed #d1d5db;
}

.bulk-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-small {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}
</style>
