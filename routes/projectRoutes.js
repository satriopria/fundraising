const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/create', authenticateToken, projectController.createProject); // Create project
router.get('/', projectController.getActiveProjects);
router.get('/all', projectController.getAllProjects);
router.post('/user', authenticateToken, projectController.getAllUserProjects);
router.post('/:id/confirm', projectController.confirmProject)
router.post('/:id/admin_confirm', projectController.superadminConfirmProject)
router.get('/:id', projectController.getProjectById);
router.put('/:id', authenticateToken, projectController.updateProject);
router.delete('/:id', authenticateToken, projectController.deleteProject);

router.post('/search', projectController.searchProject);
router.post('/amount', authenticateToken, projectController.isExistUserProjects)

// router.put('')

module.exports = router;
