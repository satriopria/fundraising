const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foundation_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foundation_license: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foundation_address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    }, 
    is_verified_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_verified_phone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_approved_terms: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: true
});

// User.associate = function (models) {
//     User.hasMany(models.Project, {as: 'projects'})
// }

module.exports = User;