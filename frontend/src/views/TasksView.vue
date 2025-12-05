<template>
  <div class="tasks-view">
    <div class="header-actions">
      <h2>All Tasks</h2>
    </div>

    <div v-if="editingTask" class="form-container">
      <h3>Edit Task</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Task Name: <span class="required">*</span></label>
          <input v-model="formData.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Due Date:</label>
          <input v-model="formData.dueDate" type="date" />
        </div>
        <div class="form-group">
          <label>Status:</label>
          <select v-model="formData.status">
            <option value="pending">Pending</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Update</button>
          <button type="button" @click="cancelForm" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="allTasks.length === 0" class="empty-state">No tasks found. Create a project and add tasks to get started!</div>
    <div v-else class="table-container">
      <table class="tasks-table">
        <thead>
          <tr>
            <th>Task Name</th>
            <th>Project</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in allTasks" :key="task.id" :class="{ 'task-done': task.status === 'done' }">
            <td>{{ task.name }}</td>
            <td>
              <router-link :to="`/projects/${task.projectId}/tasks`" class="project-link">
                {{ getProjectName(task.projectId) }}
              </router-link>
            </td>
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
              <router-link :to="`/projects/${task.projectId}/tasks`" class="btn-view">View</router-link>
              <button @click="deleteTask(task.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { projectService, taskService } from '../services/api';

export default {
  name: 'TasksView',
  data() {
    return {
      allTasks: [],
      projects: [],
      loading: false,
      error: null,
      editingTask: null,
      formData: {
        name: '',
        dueDate: '',
        status: 'pending'
      }
    };
  },
  mounted() {
    this.fetchAllTasks();
  },
  methods: {
    async fetchAllTasks() {
      this.loading = true;
      this.error = null;
      try {
        // Fetch all projects
        const projectsResponse = await projectService.getAllProjects();
        this.projects = projectsResponse.data || [];

        // Fetch tasks for all projects
        const tasksPromises = this.projects.map(async (project) => {
          try {
            const tasksResponse = await taskService.getAllTasks(project.id);
            const tasks = tasksResponse.data || [];
            return tasks.map(task => ({
              ...task,
              projectId: project.id
            }));
          } catch (err) {
            return [];
          }
        });

        const tasksArrays = await Promise.all(tasksPromises);
        this.allTasks = tasksArrays.flat();
      } catch (err) {
        this.error = 'Failed to fetch tasks. Please make sure the backend server is running.';
        console.error('Error fetching tasks:', err);
      } finally {
        this.loading = false;
      }
    },
    getProjectName(projectId) {
      const project = this.projects.find(p => p.id === projectId);
      return project ? project.name : 'Unknown Project';
    },
    async toggleStatus(taskId, status) {
      try {
        const response = await taskService.updateTaskStatus(taskId, status);
        if (response.success) {
          await this.fetchAllTasks();
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
    },
    async handleSubmit() {
      try {
        const response = await taskService.updateTask(this.editingTask.id, this.formData);
        if (response.success) {
          await this.fetchAllTasks();
          this.cancelForm();
        }
      } catch (err) {
        this.error = 'Failed to update task. Please try again.';
        console.error('Error updating task:', err);
      }
    },
    cancelForm() {
      this.editingTask = null;
      this.formData = {
        name: '',
        dueDate: '',
        status: 'pending'
      };
    },
    async deleteTask(id) {
      if (!confirm('Are you sure you want to delete this task?')) {
        return;
      }
      try {
        const response = await taskService.deleteTask(id);
        if (response.success) {
          await this.fetchAllTasks();
        }
      } catch (err) {
        this.error = 'Failed to delete task. Please try again.';
        console.error('Error deleting task:', err);
      }
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString();
    }
  }
};
</script>

<style scoped>
.tasks-view {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-actions {
  margin-bottom: 24px;
}

.header-actions h2 {
  margin: 0;
  color: #333;
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

.project-link {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.project-link:hover {
  text-decoration: underline;
}

.btn-view {
  background-color: #17a2b8;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
  text-decoration: none;
  display: inline-block;
}

.btn-view:hover {
  background-color: #138496;
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

