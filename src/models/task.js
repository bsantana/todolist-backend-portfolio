const { Sequelize, Model, DataTypes } = require('sequelize');
const database = require('./../utils/db');

const Task = database.define('task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(500)
  },
  status: {
    type: DataTypes.ENUM,
    values: ['OPENED', 'CLOSED'],
    defaultValue: 'OPENED',
    allowNull: false
  },
  order: DataTypes.INTEGER,
},
{
  paranoid: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
  deletedAt: 'deleted_at'
});

(async () => {
  await database.sync({ force: false });
  // Code here
})();

module.exports = Task;