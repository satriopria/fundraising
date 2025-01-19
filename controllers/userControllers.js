const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['username', 'email', 'phone', 'role'] });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// GET all users
const getUserById = async (req, res) => {
  try {
    const users = await User.findOne({ attributes: ['id', 'username', 'email', 'phone', 'role', 'address'], where: { id: req.params.id } });
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
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION_TIME }
    );

    res.cookie('token', token, { httpOnly: true, secure: true });

    res.status(200).json({ message: 'login success', user: { id: user.id, username: user.username, role: user.role }, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    // Hapus token dari cookie
    res.clearCookie('jwt');

    // Redirect ke halaman login
    res.redirect('/login');
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// CREATE new user
const createUser = async (req, res) => {
  const { username, phone, email, password, role, address } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username, phone, email, password: hashedPassword, role, address
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
    
    // console.log(req.body)

    if (req.body.currentPassword) {
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Password Saat Ini tidak sesuai' });
      const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
      req.body.password = hashedNewPassword;
    }


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

module.exports = { getUserById, getUsers, login, logout, createUser, updateUser, deleteUser };
