<template>
  <div class="dashboard">
    <DashboardStats />
  </div>
</template>

<script>
import DashboardStats from '../components/DashboardStats.vue';

export default {
  name: 'DashboardView',
  components: { DashboardStats }
};
</script>

<style scoped>
.dashboard {
  width: 100%;
}
</style>
