const express = require('express');
const router = express.Router();
const { adminConfirmFinance, confirmFinance, getAllFinanceOfUser, createFinance, getAllFinanceOfProject, getFinanceById, updateFinance, deleteFinance, getCollectedDonations } = require('../controllers/financeController');
const authenticateToken = require('../middlewares/authMiddleware')

router.post('/create', createFinance);
router.post('/:project_id', authenticateToken, getAllFinanceOfProject);
router.get('/user', authenticateToken, getAllFinanceOfUser);
router.get('/:id', getFinanceById);
router.post('/:id/confirm', confirmFinance)
router.post('/:id/admin_confirm', adminConfirmFinance)
router.put('/:id', authenticateToken, updateFinance);
router.delete('/:id', authenticateToken, deleteFinance);

router.post('/collect/:project_id', getCollectedDonations);

module.exports = router;