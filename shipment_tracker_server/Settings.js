const { ENV_TYPES } = require('./constants/appConstants');

module.exports = {
  SEED_FILES : ['20210202135200-testData'],
  
  FAKE_ENV : false,
  FAKE_ENV_TYPE : ENV_TYPES.STAGING,
  UNHANDLED_REJECTION_PROMISE_DOESNT_EXIT : false,  

  SEND_PASSWORD_EMAILS : true,
  SEND_PASSWORD_RECOVERY_EMAIL : true,

  LOG_ERRORS_TO_CONSOLE : true,
  LOG_REQUESTS_TO_CONSOLE : false,
  
  DEVELOPMENT : {
    SEQUELIZE_LOGGER_ENABLED : true,
    DISABLE_EMAIL_REGEX : true
  },
  STAGING : {
    SEQUELIZE_LOGGER_ENABLED : false
  },
  PRODUCTION : {
    SEQUELIZE_LOGGER_ENABLED : false
  }  

}
