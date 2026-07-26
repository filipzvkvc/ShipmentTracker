'use strict';
const SETTINGS = require('../Settings');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   let tempLastPromise = Promise.resolve();

   SETTINGS.SEED_FILES.forEach( seedFile => tempLastPromise.then( () => require( `./${seedFile}`).up(queryInterface, Sequelize) ))
   return tempLastPromise;
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    let tempLastPromise = Promise.resolve();

    SETTINGS.SEED_FILES.reverse().forEach( seedFile => tempLastPromise.then( () => require( `./${seedFile}`).down( queryInterface, Sequelize) ))
    return tempLastPromise;
  }
};
