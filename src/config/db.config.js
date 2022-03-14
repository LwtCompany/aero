const Sequelize = require('sequelize');
const { login, password, host, database } = require('./env.config');


module.exports = new Sequelize(database, login, password, {
     host: host,
     dialect: 'mysql',
     logging: false,
     pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
     }
});
