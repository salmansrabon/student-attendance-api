require('dotenv').config();

const { Sequelize, DataTypes } = require('sequelize');
const db_name = process.env.DB_NAME;
const db_user_name = process.env.DB_USER_NAME;
const db_password = process.env.DB_PASSWORD;
const sequelize = new Sequelize(db_name, db_user_name, db_password, {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.sync();

exports.Student = sequelize.define('Student', {
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  datetime: {
    type: DataTypes.STRING,
    allowNull: false
  }
});