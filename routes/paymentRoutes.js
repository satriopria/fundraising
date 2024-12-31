const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware')
const {midtransTransaction, getUserListPayment, createPaymentMethod, deletePaymentMethod, getPaymentMethodById, getUserPaymentMethods, updatePaymentMethod} = require('../controllers/paymentController');

router.post('/create', authenticateToken, createPaymentMethod); // Create payment method
router.post('/user', authenticateToken, getUserPaymentMethods);
router.get('/list/:user_id', getUserListPayment);
router.get('/:id', authenticateToken, getPaymentMethodById);
router.put('/:id', authenticateToken, updatePaymentMethod);
router.delete('/:id', authenticateToken, deletePaymentMethod);

router.post('/midtrans', midtransTransaction)
module.exports = router;
