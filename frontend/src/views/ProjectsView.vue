<template>
  <div class="projects-view">
    <ProjectList />
  </div>
</template>

<script>
import ProjectList from '../components/ProjectList.vue';

export default {
  name: 'ProjectsView',
  components: { ProjectList }
};
</script>

<style scoped>
.projects-view {
  width: 100%;
}
</style>

