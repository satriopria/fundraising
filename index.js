require('dotenv').config();
const app = require('./app'); // Import app
const { sequelize } = require('./src/models');
const path = require('path');
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));
// Jalankan server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on localhost:${PORT}`);
  })
});