const { Project, Finance, PaymentMethod } = require('../models');
const { Op } = require('sequelize')

// Get total collected donations for a project
const getCollectedDonations = async (req, res) => {
  const { project_id } = req.params;
  try {
    const totalDonations = await Finance.sum('amount', {
      where: {
        project_id: project_id,
        type: 'income',
        status: 'active'
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
  const { transaction_name, project_id, name, email, phone, amount, payment_method_id, status} = req.body;
  try {
    const finance = await Finance.create({
      transaction_name, project_id, type: "income", data: { payment_method_id }, amount, status: status || 'pending', name, email, phone
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
  try {

    let project = await Project.findAll({ where: { user_id: req.user.id } })
    let projectId = project.map(function (obj) {
      return obj.id
    })
    let projectName = project.map(function (obj) {
      return { id: obj.id, name: obj.name }
    })


    let finance = await Finance.findAll({ where: { project_id: { [Op.and]: [projectId] } }, order: [['status', 'ASC'], ['createdAt', 'DESC'],] });
    finance.forEach(financeItem => {
      financeItem.project_id = projectName.find(projectItem => projectItem.id === financeItem.project_id)?.name || 'Unknown Project';
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

const confirmFinance = async (req, res) => {
  const { id } = req.params;
  try {
    const finance = await Finance.findByPk(id);
    if (!finance) return res.status(404).json({ message: 'Record not found' });

    await finance.update({
      status: 'confirmed'
    });
    res.status(200).json({ message: 'Record updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const adminConfirmFinance = async (req, res) => {
  const { id } = req.params;
  try {
    const finance = await Finance.findByPk(id);
    if (!finance) return res.status(404).json({ message: 'Record not found' });

    await finance.update({
      status: 'active'
    });
    res.status(200).json({ message: 'Record updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = { adminConfirmFinance, confirmFinance, getAllFinanceOfUser, createFinance, getAllFinanceOfProject, getFinanceById, updateFinance, deleteFinance, getCollectedDonations };