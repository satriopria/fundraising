const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware')
const { getUsers, login, logout, createUser, updateUser, deleteUser } = require('../controllers/userControllers');

// API Routes
router.get('/', getUsers);         // GET all users
router.post('/login', login);   // GET user by ID
router.post('/logout', logout)
router.post('/register', createUser);      // CREATE new user
router.put('/:id', authenticateToken, updateUser);    // UPDATE user by ID
router.delete('/:id', authenticateToken, deleteUser); // DELETE user by ID

module.exports = router;
