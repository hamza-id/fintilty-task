<template>
  <div class="project-list">
    <div class="header-actions">
      <h2>Projects</h2>
      <button @click="showCreateForm = true" class="btn-primary">+ Create New Project</button>
    </div>

    <div v-if="showCreateForm || editingProject" class="form-container">
      <h3>{{ editingProject ? 'Edit Project' : 'Create New Project' }}</h3>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Project Name: <span class="required">*</span></label>
          <input v-model="formData.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Description:</label>
          <textarea v-model="formData.description" rows="3"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">{{ editingProject ? 'Update' : 'Create' }}</button>
          <button type="button" @click="cancelForm" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="projects.length === 0" class="empty-state">No projects found. Create one to get started!</div>
    <div v-else class="table-container">
      <table class="projects-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Description</th>
            <th>Number of Tasks</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id">
            <td class="project-name">{{ project.name }}</td>
            <td class="project-description">{{ project.description || 'No description' }}</td>
            <td class="task-count">{{ getTaskCount(project.id) }}</td>
            <td>{{ formatDate(project.createdAt) }}</td>
            <td>
              <button @click="viewTasks(project)" class="btn-view">View Tasks</button>
              <button @click="editProject(project)" class="btn-edit">Edit</button>
              <button @click="deleteProject(project.id)" class="btn-delete">Delete</button>
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
  name: 'ProjectList',
  data() {
    return {
      projects: [],
      projectTaskCounts: {},
      loading: false,
      error: null,
      showCreateForm: false,
      editingProject: null,
      formData: {
        name: '',
        description: ''
      }
    };
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      try {
        const response = await projectService.getAllProjects();
        this.projects = response.data || [];

        await this.fetchTaskCounts();
      } catch (err) {
        this.error = 'Failed to fetch projects. Please make sure the backend server is running.';
        console.error('Error fetching projects:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchTaskCounts() {
      this.projectTaskCounts = {};
      
      for (const project of this.projects) {
        try {
          const tasksResponse = await taskService.getAllTasks(project.id);
          const tasks = tasksResponse.data || [];
          this.projectTaskCounts[project.id] = tasks.length;
        } catch (err) {
          this.projectTaskCounts[project.id] = 0;
        }
      }
    },
    getTaskCount(projectId) {
      return this.projectTaskCounts[projectId] || 0;
    },
    async handleSubmit() {
      try {
        if (this.editingProject) {
          const response = await projectService.updateProject(this.editingProject.id, this.formData);
          if (response.success) {
            await this.fetchProjects();
            this.cancelForm();
          }
        } else {
          const response = await projectService.createProject(this.formData);
          if (response.success) {
            await this.fetchProjects();
            this.cancelForm();
          }
        }
      } catch (err) {
        this.error = 'Failed to save project. Please try again.';
        console.error('Error saving project:', err);
      }
    },
    editProject(project) {
      this.editingProject = project;
      this.formData = {
        name: project.name,
        description: project.description || ''
      };
      this.showCreateForm = false;
    },
    async deleteProject(id) {
      if (!confirm('Are you sure you want to delete this project? All tasks will also be deleted.')) {
        return;
      }
      try {
        const response = await projectService.deleteProject(id);
        if (response.success) {
          await this.fetchProjects();
          await this.fetchTaskCounts();
        }
      } catch (err) {
        this.error = 'Failed to delete project. Please try again.';
        console.error('Error deleting project:', err);
      }
    },
    viewTasks(project) {
      this.$router.push({ name: 'ProjectTasks', params: { projectId: project.id } });
    },
    cancelForm() {
      this.showCreateForm = false;
      this.editingProject = null;
      this.formData = {
        name: '',
        description: ''
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
.project-list {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions h2 {
  margin: 0;
  color: #333;
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

.btn-view {
  background-color: #17a2b8;
  color: white;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
}

.btn-view:hover {
  background-color: #138496;
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

.projects-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.projects-table thead {
  background-color: #f8f9fa;
}

.projects-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #dee2e6;
}

.projects-table td {
  padding: 12px;
  border-bottom: 1px solid #dee2e6;
}

.projects-table tbody tr:hover {
  background-color: #f8f9fa;
}

.project-name {
  font-weight: 500;
  color: #333;
}

.project-description {
  color: #666;
  max-width: 400px;
}

.task-count {
  text-align: center;
  font-weight: 500;
  color: #007bff;
}

input, textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  font-family: inherit;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
}
</style>

