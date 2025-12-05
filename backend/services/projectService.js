const projectRepository = require('../repositories/projectRepository');

const projectService = {
  getAllProjects: async () => {
    const projects = await projectRepository.findAll();
    return projects;
  },

  getProjectById: async (id) => {
    if (!id) {
      throw new Error('Project ID is required');
    }
    const project = await projectRepository.findById(id);
    return project;
  },

  createProject: async (projectData) => {
    if (!projectData.name) {
      throw new Error('Project name is required');
    }
    
    const processedData = {
      name: projectData.name,
      description: projectData.description || ''
    };
    
    const newProject = await projectRepository.create(processedData);
    return newProject;
  },

  updateProject: async (id, projectData) => {
    if (!id) {
      throw new Error('Project ID is required');
    }
    
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) {
      return null;
    }
    
    const processedData = {
      name: projectData.name,
      description: projectData.description
    };
    
    const updatedProject = await projectRepository.update(id, processedData);
    return updatedProject;
  },

  deleteProject: async (id) => {
    if (!id) {
      throw new Error('Project ID is required');
    }
    
    const existingProject = await projectRepository.findById(id);
    if (!existingProject) {
      return null;
    }
    
    const deleted = await projectRepository.delete(id);
    return deleted;
  }
};

module.exports = projectService;

