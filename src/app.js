const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const financeRoutes = require('./routes/financeRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Middleware
app.use(express.json()); // Untuk membaca JSON
// Enable CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.use('/api/users', userRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/project', projectRoutes);
app.use('/', (req, res) => {
  res.send('Hello World');
});

module.exports = app;