const taskService = require('../services/taskService');

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const { projectId } = req.params;
      const tasks = await taskService.getAllTasks(projectId);
      res.json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const { id } = req.params;
      const task = await taskService.getTaskById(id);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  createTask: async (req, res) => {
    try {
      const { projectId } = req.params;
      const taskData = req.body;
      const newTask = await taskService.createTask(projectId, taskData);
      res.status(201).json({ success: true, data: newTask });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const taskData = req.body;
      const updatedTask = await taskService.updateTask(id, taskData);
      if (!updatedTask) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, data: updatedTask });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  updateTaskStatus: async (req, res) => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;
      const updatedTask = await taskService.updateTaskStatus(taskId, status);
      if (!updatedTask) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, data: updatedTask });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await taskService.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }
      res.json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = taskController;

