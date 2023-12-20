'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Incident extends Model {
    static associate(models) {
      // define association here
    }
  }
  Incident.init({
    tel: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    type: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TypeIncidents',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    title: DataTypes.STRING,
    media: DataTypes.BLOB,
    audio: DataTypes.BLOB,
    gravite: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    localisation: DataTypes.STRING,
    etat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Incident',
    
    classMethods: {
      associate: function(models) {
        
        models.Incident.hasOne(models.User, {
          foreignKey: 'tel',
          onDelete: 'CASCADE'
        }),
        models.Incident.hasOne(models.TypeIncident, {
          foreignKey: 'type',
          onDelete: 'CASCADE'
        })
      }
    }
  });
  return Incident;
};