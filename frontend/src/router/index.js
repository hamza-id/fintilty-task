import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import ProjectsView from '../views/ProjectsView.vue';
import ProjectTasksView from '../views/ProjectTasksView.vue';
import { authService } from '../services/auth';
const routes = [
  {
    path: '/',
    redirect: () => {
      return authService.isAuthenticated() ? '/dashboard' : '/login';
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'Projects',
    component: ProjectsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:projectId/tasks',
    name: 'ProjectTasks',
    component: () => ProjectTasksView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const isAuth = authService.isAuthenticated();

  if (to.meta.requiresAuth && !isAuth) {
    return next({ name: 'Login' });
  }

  if (to.meta.requiresGuest && isAuth) {
    return next({ name: 'Dashboard' });
  }

  return next();
});

export default router;
