<template>
  <div id="app">
    <Sidebar v-if="isAuthenticated" />
    <div class="main-content" :class="{ 'with-sidebar': isAuthenticated }">
      <header v-if="!isAuthenticated" class="app-header">
        <h1>Fintilty Task Management</h1>
        <nav>
          <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
          <router-link v-if="!isAuthenticated" to="/register">Register</router-link>
        </nav>
      </header>
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRoute } from "vue-router";
import { authService } from "./services/auth";
import Sidebar from "./components/Sidebar.vue";

export default {
  name: "App",
  components: { Sidebar },
  setup() {
    const route = useRoute();
    const isAuthenticated = ref(authService.isAuthenticated());

    const checkAuth = () => {
      isAuthenticated.value = authService.isAuthenticated();
    };

    watch(
      () => route.path,
      () => {
        checkAuth();
      }
    );

    // Check auth status on mount and when storage changes
    onMounted(() => {
      checkAuth();
      window.addEventListener("storage", checkAuth);
      window.addEventListener("auth-changed", checkAuth);
    });

    onUnmounted(() => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-changed", checkAuth);
    });

    return {
      isAuthenticated,
    };
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.main-content {
  min-height: 100vh;
}

.main-content.with-sidebar {
  margin-left: 250px;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  color: #42b983;
  margin: 0;
}

nav {
  display: flex;
  gap: 12px;
}

nav a {
  color: #007bff;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #f0f0f0;
}

nav a.router-link-active {
  font-weight: 600;
  background-color: #e7f3ff;
}

main {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
