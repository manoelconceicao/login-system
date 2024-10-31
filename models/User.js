const sequelize = require('../config/database');
const {DataTypes} = require('sequelize');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    }
});

User.sync({force: true}); // force: true will drop the table if it already exists

module.exports = User;