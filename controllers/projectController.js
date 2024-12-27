const Project = require('../models/Project');

// Create a new project
const createProject = async (req, res) => {
  const { name, description, type, budget, status, start_date, end_date } = req.body;

  try {
    const project = await Project.create({
      name,
      description,
      type,
      budget,
      status,
      start_date,
      end_date,
      user_id: req.user.id
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

// Get all user projects
const getAllUserProjects = async (req, res) => {
    try {
      const projects = await Project.findAll({where: {user_id: req.user.id}});
      if(!projects) return res.status(404).json({message: 'Project not found', api: req.user.id});
      res.status(200).json(projects);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
    }
  };

// Get a single project by ID
const getProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByPk(id, {where: {user_id: req.user.id}});
    if (!project) return res.status(404).json({ error: 'Project not found' });

    res.status(200).json(project);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project', details: err.message });
  }
};

// Update a project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, type, budget, start_date, end_date, status, user_id } = req.body;

  try {
    const project = await Project.findByPk(id, {where: {user_id: req.user.id}});
    if (!project) return res.status(404).json({ error: 'Project not found' })

    await project.update({ 
        name, description, type, budget, start_date, end_date, status, user_id: req.user.id 
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
    const project = await Project.findByPk(id, {where: {user_id: req.user.id}});
    if (!project) res.status(404).json({ error: 'Project not found' });

    await project.destroy();

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project', details: err.message });
  }
};

module.exports = { createProject, getAllProjects, getAllUserProjects, getProjectById, updateProject, deleteProject };
