'use strict';

module.exports = {
  // eslint-disable-next-line arrow-body-style, no-unused-vars  
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return require('../utils/modelSyncer')( require('../config/database') );
  },

  // eslint-disable-next-line arrow-body-style, no-unused-vars  
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropAllTables();
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
