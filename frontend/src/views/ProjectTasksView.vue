<template>
  <div class="project-tasks-view">
    <TaskList :projectId="projectId" />
  </div>
</template>

<script>
import TaskList from '../components/TaskList.vue';

export default {
  name: 'ProjectTasksView',
  components: { TaskList },
  computed: {
    projectId() {
      return this.$route.params.projectId;
    }
  }
};
</script>

<style scoped>
.project-tasks-view {
  width: 100%;
}
</style>

