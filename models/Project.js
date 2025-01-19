const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid')

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
    start_subscription_date: {
        type: DataTypes.DATE,
    },
    end_subscription_date: {
        type: DataTypes.DATE,
    },
    payment_data: {
        type: DataTypes.TEXT,
    },
    is_Show: {
        type: DataTypes.BOOLEAN,
        default: true
    },
    additional_need: {
        type: DataTypes.TEXT,
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
