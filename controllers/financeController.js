const { Project, Finance, PaymentMethod } = require('../models');
const { Op } = require('sequelize')
const upload = require('../config/multer')



// Get total collected donations for a project (money only)
const getCollectedDonation = async (req, res) => {
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

const getCollectedDonations = async (req, res) => {
  const { project_id } = req.params;
  try {
    const totalDonations = await Finance.findAll({
      where: {
        project_id: project_id,
        type: 'income',
        status: 'active'
      }
    });

    let totalMoney = 0;
    const itemCounts = {}

    totalDonations.forEach(donation => {
      //calc money
      totalMoney += donation.amount ? parseFloat(donation.amount) : 0;

      //calc thing
      const items = JSON.parse(donation.data).additional_need
      if (items) items.forEach(item => itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity)
    })

    res.status(200).json({
      totalMoney,
      itemCounts
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
  const { transaction_name, project_id, name, email, phone, amount, payment_method_id, status, additional_need } = req.body;
  try {
    const finance = await Finance.create({
      transaction_name, project_id, type: "income", data: JSON.stringify({ additional_need, payment_method_id }), amount, status: status || 'pending', name, email, phone
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

  if (!req.file) {
    return res.status(400).json({ message: 'Bukti transfer diperlukan.' });
  }
  
  try {
    const finance = await Finance.findByPk(id);
    const proofPath = `uploads/${req.file.filename}`;

    if (!finance) return res.status(404).json({ message: 'Record not found' });


    finData = await JSON.parse(finance.data)
    await finance.update({
      status: finance.status !== 'active' ? 'confirmed' : finance.status,
    //   data: finData
      data: JSON.stringify({
        ...finData,
        proofPath
      })
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