const taskRepository = require('../repositories/taskRepository');
const projectRepository = require('../repositories/projectRepository');

const taskService = {
  getAllTasks: async (projectId) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    // Verify project exists
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    const tasks = await taskRepository.findAll(projectId);
    return tasks;
  },

  getTaskById: async (id) => {
    if (!id) {
      throw new Error('Task ID is required');
    }
    const task = await taskRepository.findById(id);
    return task;
  },

  createTask: async (projectId, taskData) => {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    // Verify project exists
    const project = await projectRepository.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    
    if (!taskData.name) {
      throw new Error('Task name is required');
    }
    
    const processedData = {
      projectId: projectId,
      name: taskData.name,
      dueDate: taskData.dueDate || null,
      status: taskData.status || 'pending'
    };
    
    const newTask = await taskRepository.create(processedData);
    return newTask;
  },

  updateTask: async (id, taskData) => {
    if (!id) {
      throw new Error('Task ID is required');
    }
    
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      return null;
    }
    
    const processedData = {
      name: taskData.name,
      dueDate: taskData.dueDate,
      status: taskData.status
    };
    
    const updatedTask = await taskRepository.update(id, processedData);
    return updatedTask;
  },

  updateTaskStatus: async (id, status) => {
    if (!id) {
      throw new Error('Task ID is required');
    }
    
    if (!status || (status !== 'pending' && status !== 'done')) {
      throw new Error('Status must be either "pending" or "done"');
    }
    
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      return null;
    }
    
    const updatedTask = await taskRepository.updateStatus(id, status);
    return updatedTask;
  },

  deleteTask: async (id) => {
    if (!id) {
      throw new Error('Task ID is required');
    }
    
    const existingTask = await taskRepository.findById(id);
    if (!existingTask) {
      return null;
    }
    
    const deleted = await taskRepository.delete(id);
    return deleted;
  }
};

module.exports = taskService;

