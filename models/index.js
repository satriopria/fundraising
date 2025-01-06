const sequelize = require('../config/database');
const User = require('./User');
const Finance = require('./Finance');
const Project = require('./Project');
const PaymentMethod = require('./PaymentMethod')

sequelize.sync({force:false}).then(() => {
    console.log('Database & tables created!');
}).catch(err => {
    console.log('Error: ' + err);
});

module.exports = { sequelize, User, Finance, Project , PaymentMethod};