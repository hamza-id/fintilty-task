<template>
  <div class="dashboard-stats">
    <h2>Dashboard Overview</h2>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background-color: #42b983">📁</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalProjects }}</div>
          <div class="stat-label">Total Projects</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background-color: #007bff">✓</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalTasks }}</div>
          <div class="stat-label">Total Tasks</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background-color: #ffc107">⏳</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingTasks }}</div>
          <div class="stat-label">Pending Tasks</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background-color: #28a745">✅</div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedTasks }}</div>
          <div class="stat-label">Completed Tasks</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { projectService, taskService } from "../services/api";

export default {
  name: "DashboardStats",
  data() {
    return {
      stats: {
        totalProjects: 0,
        totalTasks: 0,
        pendingTasks: 0,
        completedTasks: 0,
      },
      loading: false,
    };
  },
  mounted() {
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      this.loading = true;
      try {
        // Fetch all projects
        const projectsResponse = await projectService.getAllProjects();
        const projects = projectsResponse.data || [];
        this.stats.totalProjects = projects.length;

        // Fetch tasks for all projects
        let allTasks = [];
        for (const project of projects) {
          try {
            const tasksResponse = await taskService.getAllTasks(project.id);
            const tasks = tasksResponse.data || [];
            allTasks = allTasks.concat(tasks);
          } catch (err) {
            // Project might not have tasks yet
            console.log(`No tasks found for project ${project.id}`);
          }
        }

        this.stats.totalTasks = allTasks.length;
        this.stats.pendingTasks = allTasks.filter(
          (task) => task.status === "pending"
        ).length;
        this.stats.completedTasks = allTasks.filter(
          (task) => task.status === "done"
        ).length;
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.dashboard-stats {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.dashboard-stats h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 16px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
