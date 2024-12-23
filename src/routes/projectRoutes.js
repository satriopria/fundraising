const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/create', authenticateToken, projectController.createProject); // Create project
router.get('/', authenticateToken, projectController.getAllProjects);
router.post('/user', authenticateToken, projectController.getAllUserProjects);
router.get('/:id', authenticateToken, projectController.getProjectById);
router.put('/:id', authenticateToken, projectController.updateProject);
router.delete('/:id', authenticateToken, projectController.deleteProject);

module.exports = router;
