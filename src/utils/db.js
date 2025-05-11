const Sequelize = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: process.env.DB_CONNECTION,
    host: process.env.DB_HOST
  }
)

module.exports = sequelize;