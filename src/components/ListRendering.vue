<template>
  <div class="list-component">
    <h3>List Rendering & Iteration</h3>
    <p class="list-description">
      Demonstrates: v-for directive, key attributes, and dynamic list operations
    </p>

    <!-- Add New Item Form -->
    <div class="add-item-section">
      <h4>Add New Items</h4>
      <div class="add-form">
        <input v-model="newItem.name" type="text" placeholder="Item name" class="form-input" />
        <select v-model="newItem.category" class="form-select">
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="food">Food</option>
          <option value="other">Other</option>
        </select>
        <input
          v-model.number="newItem.price"
          type="number"
          placeholder="Price"
          step="0.01"
          class="form-input"
        />
        <button @click="addItem" class="btn btn-primary">Add Item</button>
      </div>
    </div>

    <!-- List Controls -->
    <div class="list-controls">
      <div class="filter-section">
        <h4>Filters & Sorting</h4>
        <div class="control-group">
          <label>Category Filter:</label>
          <select v-model="selectedCategory" class="form-select">
            <option value="">All Categories</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }} ({{ getCategoryCount(category) }})
            </option>
          </select>
        </div>

        <div class="control-group">
          <label>Sort By:</label>
          <select v-model="sortBy" class="form-select">
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="category">Category</option>
            <option value="id">ID</option>
          </select>
          <button
            @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
            class="btn btn-secondary"
          >
            {{ sortOrder === 'asc' ? '↑' : '↓' }}
          </button>
        </div>

        <div class="control-group">
          <label>Search:</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search items..."
            class="form-input"
          />
        </div>
      </div>

      <div class="bulk-actions">
        <button @click="selectAll" class="btn btn-info">
          {{ allSelected ? 'Deselect All' : 'Select All' }}
        </button>
        <button
          @click="deleteSelected"
          :disabled="selectedItems.length === 0"
          class="btn btn-danger"
        >
          Delete Selected ({{ selectedItems.length }})
        </button>
        <button @click="shuffleItems" class="btn btn-secondary">Shuffle Items</button>
      </div>
    </div>

    <!-- List Statistics -->
    <div class="list-stats">
      <div class="stat-grid">
        <div class="stat-item">
          <span class="stat-value">{{ filteredItems.length }}</span>
          <span class="stat-label">Filtered Items</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ items.length }}</span>
          <span class="stat-label">Total Items</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${{ totalValue.toFixed(2) }}</span>
          <span class="stat-label">Total Value</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">${{ averagePrice.toFixed(2) }}</span>
          <span class="stat-label">Average Price</span>
        </div>
      </div>
    </div>

    <!-- Main List -->
    <div class="items-list">
      <h4>Items List ({{ filteredItems.length }} items)</h4>

      <div v-if="filteredItems.length === 0" class="empty-list">
        <p>No items match your current filters.</p>
        <button @click="clearFilters" class="btn btn-primary">Clear Filters</button>
      </div>

      <div v-else class="list-container">
        <!-- List View Toggle -->
        <div class="view-toggle">
          <button @click="viewMode = 'list'" :class="['view-btn', { active: viewMode === 'list' }]">
            📋 List
          </button>
          <button @click="viewMode = 'grid'" :class="['view-btn', { active: viewMode === 'grid' }]">
            ▦ Grid
          </button>
          <button
            @click="viewMode = 'table'"
            :class="['view-btn', { active: viewMode === 'table' }]"
          >
            📊 Table
          </button>
        </div>

        <!-- List View -->
        <div v-if="viewMode === 'list'" class="list-view">
          <div
            v-for="(item, index) in filteredItems"
            :key="item.id"
            class="list-item"
            :class="{ selected: selectedItems.includes(item.id) }"
            @click="toggleSelection(item.id)"
          >
            <div class="item-checkbox">
              <input
                type="checkbox"
                :checked="selectedItems.includes(item.id)"
                @click.stop
                @change="toggleSelection(item.id)"
              />
            </div>
            <div class="item-content">
              <div class="item-main">
                <span class="item-name">{{ item.name }}</span>
                <span class="item-price">${{ item.price.toFixed(2) }}</span>
              </div>
              <div class="item-meta">
                <span class="item-category" :class="`category-${item.category}`">
                  {{ item.category }}
                </span>
                <span class="item-id">ID: {{ item.id }}</span>
                <span class="item-index">Index: {{ index }}</span>
              </div>
            </div>
            <div class="item-actions">
              <button @click.stop="editItem(item)" class="btn btn-small btn-info">Edit</button>
              <button @click.stop="deleteItem(item.id)" class="btn btn-small btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid-view">
          <div
            v-for="item in filteredItems"
            :key="item.id"
            class="grid-item"
            :class="{ selected: selectedItems.includes(item.id) }"
          >
            <div class="grid-item-header">
              <input
                type="checkbox"
                :checked="selectedItems.includes(item.id)"
                @change="toggleSelection(item.id)"
              />
              <button @click="deleteItem(item.id)" class="btn btn-small btn-danger">×</button>
            </div>
            <div class="grid-item-content">
              <h5>{{ item.name }}</h5>
              <p class="grid-price">${{ item.price.toFixed(2) }}</p>
              <span class="grid-category" :class="`category-${item.category}`">
                {{ item.category }}
              </span>
            </div>
          </div>
        </div>

        <!-- Table View -->
        <div v-else-if="viewMode === 'table'" class="table-view">
          <table class="items-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" :checked="allSelected" @change="selectAll" />
                </th>
                <th @click="setSortBy('id')" class="sortable">ID {{ getSortIcon('id') }}</th>
                <th @click="setSortBy('name')" class="sortable">Name {{ getSortIcon('name') }}</th>
                <th @click="setSortBy('category')" class="sortable">
                  Category {{ getSortIcon('category') }}
                </th>
                <th @click="setSortBy('price')" class="sortable">
                  Price {{ getSortIcon('price') }}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in filteredItems"
                :key="item.id"
                :class="{ selected: selectedItems.includes(item.id) }"
              >
                <td>
                  <input
                    type="checkbox"
                    :checked="selectedItems.includes(item.id)"
                    @change="toggleSelection(item.id)"
                  />
                </td>
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <span class="table-category" :class="`category-${item.category}`">
                    {{ item.category }}
                  </span>
                </td>
                <td>${{ item.price.toFixed(2) }}</td>
                <td class="table-actions"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
