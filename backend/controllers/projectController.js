const projectService = require('../services/projectService');

const projectController = {
  getAllProjects: async (req, res) => {
    try {
      const projects = await projectService.getAllProjects();
      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;
      const project = await projectService.getProjectById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createProject: async (req, res) => {
    try {
      const projectData = req.body;
      const newProject = await projectService.createProject(projectData);
      res.status(201).json({ success: true, data: newProject });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateProject: async (req, res) => {
    try {
      const { id } = req.params;
      const projectData = req.body;
      const updatedProject = await projectService.updateProject(id, projectData);
      if (!updatedProject) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, data: updatedProject });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteProject: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await projectService.deleteProject(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      res.json({ success: true, message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = projectController;

