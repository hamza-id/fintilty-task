const express = require('express');
const router = express.Router();

// Import routes from other files
const projectRoutes = require('./projectRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/projects', projectRoutes);
router.use('/', taskRoutes); 

module.exports = router;

