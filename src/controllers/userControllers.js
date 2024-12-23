const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// GET all users
const getUsers = async (req, res) => {
  console.log('getUsers');
  try {
    const users = await User.findAll({attributes: ['username', 'email', 'phone', 'role'], limit:10});
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET user by email and password
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) return res.status(404).json({ message: 'Invalid email or password' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Invalid email or password' });

    //generate token jwt
    const token = jwt.sign(
      {id:user.id, email:user.email},
      process.env.SECRET_KEY,
      {expiresIn: process.env.JWT_EXPIRATION_TIME}
    );

    res.status(200).json({message: 'login success', token});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new user
const createUser = async (req, res) => {
  const { username, email, password, role} = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username, email, password: hashedPassword, role
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE user by ID
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUsers, login, createUser, updateUser, deleteUser };
