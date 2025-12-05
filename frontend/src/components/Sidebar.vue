<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h2>Fintilty</h2>
    </div>
    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item" active-class="active">
        <span class="nav-icon">✓</span>
        <span>Dashboard</span>
      </router-link>
      <router-link to="/projects" class="nav-item" active-class="active">
        <span class="nav-icon">📁</span>
        <span>Projects</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <div class="user-info">
        <span class="user-icon">👤</span>
        <span class="user-name">{{ currentUser?.name || 'User' }}</span>
      </div>
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
  </aside>
</template>

<script>
import { authService } from '../services/auth';

export default {
  name: 'Sidebar',
  data() {
    return {
      currentUser: authService.currentUser()
    };
  },
  methods: {
    logout() {
      authService.logout();
      this.$router.push({ name: 'Login' });
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-header h2 {
  margin: 0;
  color: #42b983;
  font-size: 24px;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
  width: 100%;
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background-color: rgba(66, 185, 131, 0.2);
  color: #42b983;
  border-left-color: #42b983;
}

.nav-icon {
  margin-right: 12px;
  font-size: 18px;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-icon {
  margin-right: 8px;
  font-size: 18px;
}

.user-name {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
}

.logout-btn {
  width: 100%;
  padding: 10px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}
</style>
