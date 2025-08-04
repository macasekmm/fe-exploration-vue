import { ref, computed, type Ref, type ComputedRef } from 'vue'

export interface TodoItem {
  id: number
  text: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface UseTodosOptions {
  initialTodos?: TodoItem[]
  autoSave?: boolean
  storageKey?: string
}

export interface UseTodosReturn {
  todos: Ref<TodoItem[]>
  addTodo: (text: string, priority?: TodoItem['priority'], tags?: string[]) => void
  removeTodo: (id: number) => void
  toggleTodo: (id: number) => void
  updateTodo: (id: number, updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>) => void
  clearCompleted: () => void
  toggleAll: () => void
  getTodosByTag: (tag: string) => TodoItem[]
  getTodosByPriority: (priority: TodoItem['priority']) => TodoItem[]
  totalTodos: ComputedRef<number>
  completedTodos: ComputedRef<number>
  activeTodos: ComputedRef<number>
  completionPercentage: ComputedRef<number>
  allTags: ComputedRef<string[]>
  todosByPriority: ComputedRef<Record<TodoItem['priority'], TodoItem[]>>
}

export function useTodos(options: UseTodosOptions = {}): UseTodosReturn {
  const { initialTodos = [], autoSave = false, storageKey = 'vue-todos' } = options

  // Load from localStorage if autoSave is enabled
  const loadFromStorage = (): TodoItem[] => {
    if (!autoSave || typeof localStorage === 'undefined') return initialTodos

    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt),
        }))
      }
    } catch (error) {
      console.warn('Failed to load todos from localStorage:', error)
    }

    return initialTodos
  }

  // Save to localStorage if autoSave is enabled
  const saveToStorage = (todos: TodoItem[]): void => {
    if (!autoSave || typeof localStorage === 'undefined') return

    try {
      localStorage.setItem(storageKey, JSON.stringify(todos))
    } catch (error) {
      console.warn('Failed to save todos to localStorage:', error)
    }
  }

  // State
  const todos = ref<TodoItem[]>(loadFromStorage())

  // Watch for changes and auto-save
  if (autoSave) {
    // Note: In a real app, you might want to debounce this
    const saveChanges = () => saveToStorage(todos.value)
    // You would typically watch the todos ref here, but since we're in a composable,
    // we'll save after each mutation
  }

  // Computed properties
  const totalTodos = computed<number>(() => todos.value.length)

  const completedTodos = computed<number>(() => todos.value.filter((todo) => todo.completed).length)

  const activeTodos = computed<number>(() => todos.value.filter((todo) => !todo.completed).length)

  const completionPercentage = computed<number>(() => {
    if (totalTodos.value === 0) return 0
    return Math.round((completedTodos.value / totalTodos.value) * 100)
  })

  const allTags = computed<string[]>(() => {
    const tagSet = new Set<string>()
    todos.value.forEach((todo) => {
      todo.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  })

  const todosByPriority = computed<Record<TodoItem['priority'], TodoItem[]>>(() => ({
    high: todos.value.filter((todo) => todo.priority === 'high'),
    medium: todos.value.filter((todo) => todo.priority === 'medium'),
    low: todos.value.filter((todo) => todo.priority === 'low'),
  }))

  // Helper to generate unique ID
  const generateId = (): number => {
    return Math.max(0, ...todos.value.map((t) => t.id)) + 1
  }

  // Actions
  const addTodo = (
    text: string,
    priority: TodoItem['priority'] = 'medium',
    tags: string[] = [],
  ): void => {
    const newTodo: TodoItem = {
      id: generateId(),
      text: text.trim(),
      completed: false,
      priority,
      tags: [...tags],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    todos.value.push(newTodo)
    if (autoSave) saveToStorage(todos.value)
  }

  const removeTodo = (id: number): void => {
    const index = todos.value.findIndex((todo) => todo.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
      if (autoSave) saveToStorage(todos.value)
    }
  }

  const toggleTodo = (id: number): void => {
    const todo = todos.value.find((todo) => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
      todo.updatedAt = new Date()
      if (autoSave) saveToStorage(todos.value)
    }
  }

  const updateTodo = (id: number, updates: Partial<Omit<TodoItem, 'id' | 'createdAt'>>): void => {
    const todo = todos.value.find((todo) => todo.id === id)
    if (todo) {
      Object.assign(todo, {
        ...updates,
        updatedAt: new Date(),
      })
      if (autoSave) saveToStorage(todos.value)
    }
  }

  const clearCompleted = (): void => {
    todos.value = todos.value.filter((todo) => !todo.completed)
    if (autoSave) saveToStorage(todos.value)
  }

  const toggleAll = (): void => {
    const allCompleted = todos.value.every((todo) => todo.completed)
    const newCompletedState = !allCompleted

    todos.value.forEach((todo) => {
      todo.completed = newCompletedState
      todo.updatedAt = new Date()
    })

    if (autoSave) saveToStorage(todos.value)
  }

  const getTodosByTag = (tag: string): TodoItem[] => {
    return todos.value.filter((todo) => todo.tags.includes(tag))
  }

  const getTodosByPriority = (priority: TodoItem['priority']): TodoItem[] => {
    return todos.value.filter((todo) => todo.priority === priority)
  }

  return {
    todos,
    addTodo,
    removeTodo,
    toggleTodo,
    updateTodo,
    clearCompleted,
    toggleAll,
    getTodosByTag,
    getTodosByPriority,
    totalTodos,
    completedTodos,
    activeTodos,
    completionPercentage,
    allTags,
    todosByPriority,
  }
}
