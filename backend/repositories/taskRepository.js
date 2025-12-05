// Data store in memory no db connection added
// if needed we can connect the database 

let tasks = [];

const taskRepository = {
  findAll: async (projectId) => {
    if (projectId) {
      return tasks.filter(task => task.projectId === projectId);
    }
    return tasks;
  },

  findById: async (id) => {
    return tasks.find(task => task.id === id);
  },

  create: async (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      status: 'pending', //new task should always be pending
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    tasks.push(newTask);
    return newTask;
  },

  update: async (id, taskData) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return null;
    }
    tasks[index] = { 
      ...tasks[index], 
      ...taskData,
      updatedAt: new Date()
    };
    return tasks[index];
  },

  updateStatus: async (id, status) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return null;
    }
    if (status !== 'pending' && status !== 'done') {
      throw new Error('Status must be either "pending" or "done"');
    }
    tasks[index].status = status;
    tasks[index].updatedAt = new Date();
    return tasks[index];
  },

  delete: async (id) => {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) {
      return null;
    }
    tasks.splice(index, 1);
    return true;
  }
};

module.exports = taskRepository;

