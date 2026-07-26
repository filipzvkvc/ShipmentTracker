const { IS_STAGING, IS_DEVELOPMENT, IS_PRODUCTION, IS_TEST } = require('./environment');
const { STAGING : STAGING_SETTINGS, FAKE_ENV, DEVELOPMENT : DEVELOPMENT_SETTINGS, PRODUCTION : PRODUCTION_SETTINGS } = require('../Settings')
const {Sequelize} = require('sequelize');


let options = {
  host: process.env.HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
  dialect: 'mysql',
  operatorsAliases: 0,

  pool: {
    max: 5,
    min: 1,
    acquire: 30000,
    idle: 1000,
  },

}

if (process.env.DB_SSL === 'true') {
  options.dialectOptions = {
    ssl: {
      rejectUnauthorized: true
    }
  };
}
//console.log("IS_DEVELOPMENT, IS_STAGING, IS_PRODUCTION", IS_DEVELOPMENT, IS_STAGING, IS_PRODUCTION);
if( ( ! STAGING_SETTINGS.SEQUELIZE_LOGGER_ENABLED && IS_STAGING) || 
    ( ! PRODUCTION_SETTINGS.SEQUELIZE_LOGGER_ENABLED && IS_PRODUCTION) ||
    ( ! DEVELOPMENT_SETTINGS.SEQUELIZE_LOGGER_ENABLED && IS_DEVELOPMENT) ) {
      options.logging = false;
}


module.exports = new Sequelize( ! IS_TEST ? process.env.DB : process.env.DB_TEST, process.env.USER, process.env.PASSWORD, options);
