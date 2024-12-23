const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        defaultValue: 'pending',
    },
    budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    end_date: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: true
});

module.exports = Project;
