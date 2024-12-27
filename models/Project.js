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
        type: DataTypes.STRING,
        defaultValue: 'pending',
    },
    budget: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
    },
    end_date: {
        type: DataTypes.DATE,
    },
    // image: {
    //     type: DataTypes.STRING,
    //     validate: {
    //         isUrl: true,
    //         is: /\.(jpg|jpeg|png)$/i
    //     }
    // }
}, {
    timestamps: true
});

module.exports = Project;
