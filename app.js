const express = require('express');
const app = express();
require('dotenv').config();
const { sequelize } = require('./models');
const path = require('path');
const PORT = process.env.PORT || 3000;
const userRoutes = require('./routes/userRoutes');
const financeRoutes = require('./routes/financeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const viewRoutes = require('./routes/viewRoutes');
const expressEjsLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser')

app.use(express.json()); // Untuk membaca 
app.use(cookieParser());

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressEjsLayouts)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

//be
app.use('/api/users', userRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/project', projectRoutes);
app.use('/api', (req, res) => {
  res.send('Hello World');
});

//fe
app.use('/', viewRoutes);

// Jalankan server
sequelize.sync({alter:true}).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
  })
});