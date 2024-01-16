'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeIncident extends Model {
    static associate(models) {
      // define association here
    }
  }
  TypeIncident.init({
    nom: DataTypes.STRING,
    entreprise: {
      type: DataTypes.INTEGER,
      references : {
        model: 'Entreprises',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    image: DataTypes.BLOB,
    description: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'TypeIncident',
    
    classMethods: {
      associate: function(models) {
        
        models.TypeIncident.hasOne(models.Entreprise, {
          foreignKey: 'entreprise',
          onDelete: 'CASCADE'
        })
      }
    }
  });
  return TypeIncident;
};