const Project = require('../models/Project');
const Finance = require('../models/Finance');
const { Op, sequelize } = require('sequelize');

// Create a new project
const createProject = async (req, res) => {
  const { name, description, type, budget, start_date, end_date, start_subscription_date, end_subscription_date, additionalNeed, visibility} = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      type,
      budget,
      start_date,
      end_date,
      start_subscription_date,
      end_subscription_date,
      user_id: req.user.id,
      additional_need: additionalNeed,
      visibility,
    });

    res.status(201).json({
      message: 'Project created successfully',
      project,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create project', details: err.message });
  }
};

// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
};

// Get all projects
const getActiveProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({where: {status: 'active', visibility: true}});
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
};

// Get all user projects
const getAllUserProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({ where: { user_id: req.user.id }, order: [['id', 'DESC']] });
    if (!projects) return res.status(404).json({ message: 'Project not found', api: req.user.id });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
};

// Get all user projects
const isExistUserProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({limit: 1, where: { user_id: req.user.id }, attributes: ['id'] });
    
    res.status(200).json({ exist: projects.length ? true : false });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
};

// Get a single project by ID
const searchProject = async (req, res) => {
  try {
    const { name } = req.body;
    let projects;
    if (name=='') {
      projects = await Project.findAll({where:{status: 'active'}});
    } else {
      projects = await Project.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`
          },
          status: 'active'
        }
      });
    }
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching projects'
    });
  }
};

// Get a single project by ID
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project', details: err.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, type, budget, start_date, end_date, status, user_id, additionalNeed, visibility } = req.body;

  try {
    const project = await Project.findByPk(id, { where: { user_id: req.user.id } });
    if (!project) return res.status(404).json({ error: 'Project not found' })

    await project.update({
      name, description, type, budget, start_date, end_date, status, 
      user_id: req.user.id, additional_need: additionalNeed, visibility
    });

    res.status(200).json({
      message: 'Project updated successfully',
      updatedProject: project,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update project', details: err.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id, { where: { user_id: req.user.id } });
    if (!project) res.status(404).json({ error: 'Project not found' });

    await project.destroy();

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
};

const confirmProject = async (req, res) => {
  
}

const superadminConfirmProject = async (req, res) => {
  
}

module.exports = { isExistUserProjects, getActiveProjects, superadminConfirmProject, confirmProject, createProject, getAllProjects, getAllUserProjects, getProjectById, updateProject, deleteProject, searchProject };
