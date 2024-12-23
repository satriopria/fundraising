const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Finance = sequelize.define('Finance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    transaction_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    project_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('income', 'expense'),
        allowNull: false,
    },
    data: {
        type: DataTypes.JSON,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(15,2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'cancelled'),
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Finance;