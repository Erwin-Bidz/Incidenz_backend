'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Incidents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      tel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model: 'Users',
          key: 'id'
        }
      },
      type: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references : {
          model: 'TypeIncidents',
          key: 'id'
        }
      },
      media: {
        type: Sequelize.BLOB('long')
      },
      audio: {
        type: Sequelize.BLOB
      },
      gravite: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      localisation: {
        type: Sequelize.STRING
      },
      etat: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE 
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Incidents');
  }
};