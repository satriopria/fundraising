const Finance = require('../models/Finance');
// Get total collected donations for a project
const getCollectedDonations = async (req, res) => {
    const { project_id } = req.params;
    try {
        const totalDonations = await Finance.sum('amount', {
            where: {
                project_id: project_id,
                type: 'donation',
                status: 'completed'
            }
        });

        res.status(200).json({
            project_id: project_id,
            total_donations: totalDonations || 0
        });
    } catch (err) {
        res.status(500).json({ 
            error: 'Failed to get total donations',
            details: err.message 
        });
    }
}


//create finance
const createFinance = async (req, res) => {
    const { transaction_name, project_id, name, email, phone, type, data, amount, status } = req.body;
    try {
        const finance = await Finance.create({ 
            transaction_name, project_id, type, data, amount, status: "pending", name, email, phone
        });
        res.status(201).json(finance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//get all data
const getAllFinanceOfProject = async (req, res) => {
    const { project_id } = req.params;
    try {
        const finance = await Finance.findAll({where: {project_id: project_id}});
        if(!finance) return res.status(404).json({message: 'Record not found'});
        res.status(200).json(finance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//get specific data
const getFinanceById = async (req, res) => {
    const { id } = req.params;
    try {
        let finance = await Finance.findByPk(id);
        if(!finance) return res.status(404).json({message: 'Record not found'});
        
        // const amount = `Rp${Intl.NumberFormat('en-DE').format(finance[0].dataValues.amount)}`;
        // finance[0].dataValues.amount = amount;
        res.status(200).json(finance);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

//update data
const updateFinance = async (req, res) => {
    const { id } = req.params;
    const { transaction_name, project_id,type, data, amount, status } = req.body;

    try{
        const finance = await Finance.findByPk(id);
        if(!finance) return res.status(404).json({message: 'Record not found'});

        await finance.update({
            transaction_name, project_id, type, data, amount, status
        });
        res.status(200).json({message: 'Record updated successfully', finance});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

//delete data
const deleteFinance = async (req, res) => {
    const { id } = req.params;
    try {
        const finance = await Finance.findByPk(id);;
        await finance.destroy();
        res.status(200).json({message: 'Record deleted successfully'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = { createFinance, getAllFinanceOfProject, getFinanceById, updateFinance, deleteFinance, getCollectedDonations };