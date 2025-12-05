const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/projects/:projectId/tasks', taskController.getAllTasks);
router.post('/projects/:projectId/tasks', taskController.createTask);

router.patch('/tasks/:taskId/status', taskController.updateTaskStatus);
router.get('/tasks/:id', taskController.getTaskById);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;

