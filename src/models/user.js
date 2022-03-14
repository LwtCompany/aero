'use strict';
const Sequelize = require('sequelize')
const db = require('../config/db.config');

const User = db.define('users', {
   
    login: {
        type: Sequelize.STRING(20),
        allowNull: false,
      
    },
    password: {
        type: Sequelize.STRING(30),
        allowNull: false
    }
},
     {
          freezeTableName: true,
          timestamps: false
     }
);
module.exports = User;
