<template>
  <div class="task-list">
    <div class="header-section">
      <div class="header-actions">
        <div>
          <router-link to="/dashboard" class="back-link">← Back</router-link>
          <h2>{{ projectName || 'Tasks' }}</h2>
        </div>
        <button @click="showCreateForm = true" class="btn-primary">Add New Task</button>
      </div>
    </div>

    <div v-if="showCreateForm || editingTask" class="form-container">
      <h3>{{ editingTask ? 'Edit Task' : 'Create New Task' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Task Name: <span class="required">*</span></label>
          <input v-model="formData.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Due Date:</label>
          <input v-model="formData.dueDate" type="date" />
        </div>
        <div v-if="editingTask" class="form-group">
          <label>Status:</label>
          <select v-model="formData.status">
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">{{ editingTask ? 'Update' : 'Create' }}</button>
          <button type="button" @click="cancelForm" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="tasks.length === 0" class="empty-state">No tasks found. Create one to get started!</div>
    <div v-else class="table-container">
      <table class="tasks-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in tasks" :key="task.id" :class="{ 'task-done': task.status === 'done' }">
            <td>{{ task.name }}</td>
            <td>{{ formatDate(task.dueDate) }}</td>
            <td>
              <select 
                :value="task.status" 
                @change="toggleStatus(task.id, $event.target.value)"
                class="status-select"
                :class="{ 'status-pending': task.status === 'pending', 'status-done': task.status === 'done' }"
              >
                <option value="pending">Pending</option>
                <option value="done">Done</option>
              </select>
            </td>
            <td>
              <button @click="editTask(task)" class="btn-edit">Edit</button>
              <button @click="deleteTask(task.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { taskService, projectService } from '../services/api';

export default {
  name: 'TaskList',
  props: {
    projectId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tasks: [],
      projectName: '',
      loading: false,
      error: null,
      showCreateForm: false,
      editingTask: null,
      formData: {
        name: '',
        dueDate: '',
        status: 'pending'
      }
    };
  },
  mounted() {
    this.fetchProject();
    this.fetchTasks();
  },
  watch: {
    projectId() {
      this.fetchProject();
      this.fetchTasks();
    }
  },
  methods: {
    async fetchProject() {
      try {
        const response = await projectService.getProjectById(this.projectId);
        if (response.success) {
          this.projectName = response.data.name;
        }
      } catch (err) {
        console.error('Error fetching project:', err);
      }
    },
    async fetchTasks() {
      this.loading = true;
      this.error = null;
      try {
        const response = await taskService.getAllTasks(this.projectId);
        this.tasks = response.data || [];
      } catch (err) {
        this.error = 'Failed to fetch tasks. Please make sure the backend server is running.';
        console.error('Error fetching tasks:', err);
      } finally {
        this.loading = false;
      }
    },
    async handleSubmit() {
      try {
        if (this.editingTask) {
          const response = await taskService.updateTask(this.editingTask.id, this.formData);
          if (response.success) {
            await this.fetchTasks();
            this.cancelForm();
          }
        } else {
          const response = await taskService.createTask(this.projectId, this.formData);
          if (response.success) {
            await this.fetchTasks();
            this.cancelForm();
          }
        }
      } catch (err) {
        this.error = 'Failed to save task. Please try again.';
        console.error('Error saving task:', err);
      }
    },
    async toggleStatus(taskId, status) {
      try {
        const response = await taskService.updateTaskStatus(taskId, status);
        if (response.success) {
          await this.fetchTasks();
        }
      } catch (err) {
        this.error = 'Failed to update task status. Please try again.';
        console.error('Error updating task status:', err);
      }
    },
    editTask(task) {
      this.editingTask = task;
      this.formData = {
        name: task.name,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        status: task.status || 'pending'
      };
      this.showCreateForm = false;
    },
    async deleteTask(id) {
      if (!confirm('Are you sure you want to delete this task?')) {
        return;
      }
      try {
        const response = await taskService.deleteTask(id);
        if (response.success) {
          await this.fetchTasks();
        }
      } catch (err) {
        this.error = 'Failed to delete task. Please try again.';
        console.error('Error deleting task:', err);
      }
    },
    cancelForm() {
      this.showCreateForm = false;
      this.editingTask = null;
      this.formData = {
        name: '',
        dueDate: '',
        status: 'pending'
      };
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.task-list {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-section {
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.back-link {
  color: #007bff;
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  text-decoration: underline;
}

.btn-primary {
  background-color: #42b983;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary:hover {
  background-color: #35a372;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-left: 8px;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-edit {
  background-color: #007bff;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-delete:hover {
  background-color: #c82333;
}

.form-container {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.form-container h3 {
  margin-bottom: 16px;
  color: #333;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #555;
}

.required {
  color: #dc3545;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  color: #dc3545;
}

.table-container {
  overflow-x: auto;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.tasks-table thead {
  background-color: #f8f9fa;
}

.tasks-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

.tasks-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

.tasks-table tbody tr:hover {
  background-color: #f8f9fa;
}

.tasks-table tbody tr.task-done {
  background-color: #d4edda;
}

.tasks-table tbody tr.task-done:hover {
  background-color: #c3e6cb;
}

.status-select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  font-weight: 500;
}

.status-select.status-pending {
  background-color: #fff3cd;
  color: #856404;
  border-color: #ffeaa7;
}

.status-select.status-done {
  background-color: #d4edda;
  color: #155724;
  border-color: #c3e6cb;
}

input, select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  font-family: inherit;
}

input:focus, select:focus {
  outline: none;
  border-color: #42b983;
}
</style>

