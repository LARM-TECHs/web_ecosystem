const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite', // o 'postgres', 'mysql', etc.
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});

module.exports = sequelize;