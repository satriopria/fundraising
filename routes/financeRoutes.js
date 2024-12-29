const express = require('express');
const router = express.Router();
const { createFinance, getAllFinanceOfProject, getFinanceById, updateFinance, deleteFinance, getCollectedDonations } = require('../controllers/financeController');
const authenticateToken = require('../middlewares/authMiddleware')

router.post('/create', authenticateToken, createFinance);
router.post('/:project_id', authenticateToken, getAllFinanceOfProject);
router.get('/:id', authenticateToken, getFinanceById);
router.put('/:id', authenticateToken, updateFinance);
router.delete('/:id', authenticateToken, deleteFinance);

router.post('/collect/:project_id', getCollectedDonations);

module.exports = router;