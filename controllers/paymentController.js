const PaymentMethod = require('../models/PaymentMethod');

// Create new payment method
const createPaymentMethod = async (req, res) => {
    try {
        const { name, account_number, account_name, provider, type } = req.body;
        const user_id = req.user.id;

        const paymentMethod = await PaymentMethod.create({
            user_id,
            name,
            account_number,
            account_name,
            provider,
            type,
            is_active: true
        });

        res.status(200).json(paymentMethod);
    } catch (error) {
        console.error('Error creating payment method:', error);
        res.status(500).json({ message: 'Failed to create payment method' });
    }
};

const getUserPaymentMethods = async (req, res) => {
    try {
        const user_id = req.user.id; // Ensure user_id is defined

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const paymentMethods = await PaymentMethod.findAll({
            where: { user_id, is_active:true }
        });

        res.status(200).json(paymentMethods);
    } catch (error) {
        console.error('Error getting payment methods:', error);
        res.status(500).json({ message: 'Failed to get payment methods' });
    }
};

const getUserListPayment = async (req, res) => {
    try {
        const { user_id } = req.params

        const list = await PaymentMethod.findAll({
            where: { user_id, is_active:true }
        });

        res.status(200).json(list);
    } catch (error) {
        console.error('Error getting payment methods:', error);
        res.status(500).json({ message: 'Failed to get payment methods' });
    }
};

// Get payment method by ID
const getPaymentMethodById = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const paymentMethod = await PaymentMethod.findOne({
            where: {
                id,
                user_id,
                is_active: true,
            }
        });

        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }

        res.status(200).json(paymentMethod);
    } catch (error) {
        console.error('Error getting payment method:', error);
        res.status(500).json({ message: 'Failed to get payment method' });
    }
};

// Update payment method
const updatePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;
        const { name, account_number, account_name, provider, type } = req.body;

        const paymentMethod = await PaymentMethod.findOne({
            where: {
                id,
                user_id,
                is_active: true
            }
        });

        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }

        await paymentMethod.update({
            name,
            account_number,
            account_name,
            provider,
            type
        });

        res.status(200).json(paymentMethod);
    } catch (error) {
        console.error('Error updating payment method:', error);
        res.status(500).json({ message: 'Failed to update payment method' });
    }
};

// Delete payment method (soft delete by setting is_active to false)
const deletePaymentMethod = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        const paymentMethod = await PaymentMethod.findOne({
            where: {
                id,
                user_id,
                is_active: true
            }
        });

        if (!paymentMethod) {
            return res.status(404).json({ message: 'Payment method not found' });
        }

        await paymentMethod.update({ is_active: false });

        res.status(200).json({ message: 'Payment method deleted successfully' });
    } catch (error) {
        console.error('Error deleting payment method:', error);
        res.status(500).json({ message: 'Failed to delete payment method' });
    }
};

module.exports = { getUserListPayment, createPaymentMethod, deletePaymentMethod, getPaymentMethodById, getUserPaymentMethods, updatePaymentMethod }