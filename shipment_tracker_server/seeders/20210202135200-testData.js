'use strict';
const pluralize = require('pluralize');
const { MODELS_NAMES } = require('../constants/modelConstants')
const { fakeUsersList } = require('../test-data/fakeData');
// const workingPositionsData = require('../test-data/workingPositions.data');
// const companyBranchesData = require('../test-data/compnyBranches.data');
// const companyLinesData = require('../test-data/companyLines.data');
const usersData = require('../test-data/users.data');
const shipmentStatusData = require('../test-data/shipmentStatus.data');
const subShipmentStatusData = require('../test-data//subShipmentStatus.data');
// const clientsData = require('../test-data/clients.data');
//  const physicalPeopleData = require('../test-data/physicalPeople.data');
// const legalPeopleData = require('../test-data/legalPeople.data');
// const vehicleTypesData = require('../test-data/vehicleTypes.data');
// const paymentTypesData = require('../test-data/paymentTypes.data');
// const insuranceCompaniesData = require('../test-data/insuranceCompanies.data');
// const registrationData = require('../test-data/registrations.data');
// const employeesData = require('../test-data/employees.data');

const bcrypt = require('bcrypt');
// const compnyBranchesData = require('../test-data/compnyBranches.data');


function addCreatedAtUpdatedAt(argList, argTimeStamp) {
  return argList.map(el => ({
    ...el,
    created_at: argTimeStamp,
    updated_at: argTimeStamp
  }));
}

module.exports = {

  // eslint-disable-next-line arrow-body-style, no-unused-vars   
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

    const timeStamp = new Date();

    try {
      // await queryInterface.bulkInsert(
      //   pluralize(MODELS_NAMES.WORKING_POSITION),
      //   addCreatedAtUpdatedAt(workingPositionsData, timeStamp)
      // )

      await queryInterface.bulkInsert(
        pluralize('subShipmentStatuses'),
        subShipmentStatusData)

      await queryInterface.bulkInsert(
        pluralize(MODELS_NAMES.SHIPMENT_STATUS),
        shipmentStatusData
      )

      return await queryInterface.bulkInsert(
        pluralize(MODELS_NAMES.USER),
        usersData.map(el => ({
          ...el,
          password: bcrypt.hashSync(el.password, 10),
          created_at: timeStamp,
          updated_at: timeStamp
        }))
      )

      // await queryInterface.bulkInsert(
      //   pluralize(MODELS_NAMES.CLIENT),
      //   addCreatedAtUpdatedAt(clientsData, timeStamp) )


      // await queryInterface.bulkInsert(
      //   pluralize(MODELS_NAMES.LEGAL_PERSON),
      //   addCreatedAtUpdatedAt(legalPeopleData, timeStamp ))

      // await queryInterface.bulkInsert(
      //   pluralize(MODELS_NAMES.VEHICLE_TYPE),
      //   addCreatedAtUpdatedAt(vehicleTypesData,  timeStamp))    

      // await queryInterface.bulkInsert(
      //   pluralize(MODELS_NAMES.PAYMENT_TYPE),
      //   addCreatedAtUpdatedAt(paymentTypesData, timeStamp))

      // await queryInterface.bulkInsert(
      //   pluralize(MODELS_NAMES.INSURANCE_COMPANY),
      //   addCreatedAtUpdatedAt(insuranceCompaniesData, timeStamp))    

      // await queryInterface.bulkInsert(
      //   pluralize(MODELS_NAMES.EMPLOYEE),
      //   addCreatedAtUpdatedAt(employeesData, timeStamp))

      // return await queryInterface.bulkInsert(
      //   pluralize(MODELS_NAMES.REGISTRATION),
      //   addCreatedAtUpdatedAt(registrationData, timeStamp))

    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  // eslint-disable-next-line arrow-body-style, no-unused-vars
  down: async (queryInterface, Sequelize) => {
    try {
      // await queryInterface.bulkDelete(pluralize(MODELS_NAMES.REGISTRATION), null, {});
      // await queryInterface.bulkDelete(pluralize(MODELS_NAMES.EMPLOYEE), null, {});
      // await queryInterface.bulkDelete(pluralize(MODELS_NAMES.INSURANCE_COMPANY), null, {});
      // await queryInterface.bulkDelete(pluralize(MODELS_NAMES.PAYMENT_TYPE), null, {});
      // await queryInterface.bulkDelete(pluralize(MODELS_NAMES.VEHICLE_TYPE), null, {});
      // await queryInterface.bulkDelete(pluralize(MODELS_NAMES.LEGAL_PERSON), null, {});
      await queryInterface.bulkDelete(pluralize('subShipmentStatuses'), null, {});
      await queryInterface.bulkDelete(pluralize(MODELS_NAMES.SHIPMENT_STATUS), null, {});
      return await queryInterface.bulkDelete(pluralize(MODELS_NAMES.USER), null, {});
      // await queryInterface.bulkDelete(pluralize(MODELS_NAMES.COMPANY_LINE), null, {});
      // await queryInterface.bulkDelete(pluralize(MODELS_NAMES.COMPANY_BRANCH), null, {});
      // return await queryInterface.bulkDelete(pluralize(MODELS_NAMES.WORKING_POSITION), null, {});
    } catch (error) {
      console.log(error);
      throw error;
    }



    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
