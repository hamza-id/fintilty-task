// Data store in memory no db connection added
// if needed we can connect the database 

let projects = [];

const projectRepository = {
  findAll: async () => {
    return projects;
  },

  findById: async (id) => {
    return projects.find(project => project.id === id);
  },

  create: async (projectData) => {
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    projects.push(newProject);
    return newProject;
  },

  update: async (id, projectData) => {
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) {
      return null;
    }
    projects[index] = { 
      ...projects[index], 
      ...projectData,
      updatedAt: new Date()
    };
    return projects[index];
  },

  delete: async (id) => {
    const index = projects.findIndex(project => project.id === id);
    if (index === -1) {
      return null;
    }
    projects.splice(index, 1);
    return true;
  }
};

module.exports = projectRepository;

