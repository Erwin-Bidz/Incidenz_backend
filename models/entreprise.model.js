'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Entreprise extends Model {
    static associate(models) {
      // define association here
    }
  }
  Entreprise.init({
    nom: DataTypes.STRING,
    password: DataTypes.STRING,
    contact: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Entreprise',
  });
  return Entreprise;
};