const { Project, Finance, PaymentMethod } = require('../models');

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
  const { transaction_name, project_id, name, email, phone, amount, payment_method_id } = req.body;
  try {
    const finance = await Finance.create({
      transaction_name, project_id, type: "income", data: { payment_method_id }, amount, status: "pending", name, email, phone
    });
    res.status(200).json(finance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//get all data of project
const getAllFinanceOfProject = async (req, res) => {
  const { project_id } = req.params;
  try {
    const finance = await Finance.findAll({ where: { project_id: project_id } });
    if (!finance) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(finance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//get all data of user
const getAllFinanceOfUser = async (req, res) => {
  const { project_id } = req.params;
  try {
    const finance = await Finance.findAll({
      include: [{
        model: Project,
        where: { 
          user_id: 2
        }
      }]
    });

    if (!finance) return res.status(404).json({ message: 'Record not found' });
    res.status(200).json(finance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//get specific data
const getFinanceById = async (req, res) => {
  const { id, data } = req.params;
  try {
    let finance = await Finance.findByPk(id);
    if (!finance) return res.status(404).json({ message: 'Record not found' });

    res.status(200).json(finance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//update data
const updateFinance = async (req, res) => {
  const { id } = req.params;
  const { transaction_name, project_id, type, data, amount, status } = req.body;

  try {
    const finance = await Finance.findByPk(id);
    if (!finance) return res.status(404).json({ message: 'Record not found' });

    await finance.update({
      transaction_name, project_id, type, data, amount, status
    });
    res.status(200).json({ message: 'Record updated successfully', finance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

//delete data
const deleteFinance = async (req, res) => {
  const { id } = req.params;
  try {
    const finance = await Finance.findByPk(id);;
    await finance.destroy();
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllFinanceOfUser, createFinance, getAllFinanceOfProject, getFinanceById, updateFinance, deleteFinance, getCollectedDonations };