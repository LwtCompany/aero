'use strict';
const Sequelize = require('sequelize')
const db = require('../config/db.config');

const File = db.define('files', {
   
    fileName: {
          type: Sequelize.STRING(255),
          allowNull: false,
    },
    type: {
        type: Sequelize.STRING(255),
        allowNull: false
    },
    mimeType: {
      type: Sequelize.STRING,
      allowNull: false
    },
    size: {
      type: Sequelize.STRING,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW

    }
},
     {
          freezeTableName: true,
          timestamps: false
     }
);
module.exports = File;
