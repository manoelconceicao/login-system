const {Sequelize} = require('sequelize');

//aqui pode ser colocado outras integrações com o banco de dados, como por ex: mysql, postgres etc
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite'
});

module.exports = sequelize;