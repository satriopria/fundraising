require('dotenv').config();
const app = require('./src/app'); // Import app
const { sequelize } = require('./src/models');
const PORT = process.env.PORT || 3000;

// Jalankan server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
  })
});