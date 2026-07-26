require('dotenv').config({ path : './config/config.env' });
const { FAKE_ENV, FAKE_ENV_TYPE } = require('../Settings');
const { ENV_TYPES } = require('../constants/appConstants')

const IS_DEVELOPMENT =  ! FAKE_ENV
            ? (process.env.NODE_ENV === ENV_TYPES.DEVELOPMENT)
            : (FAKE_ENV_TYPE === ENV_TYPES.DEVELOPMENT)

const IS_STAGING =  ! FAKE_ENV 
            ? ( process.env.NODE_ENV === ENV_TYPES.STAGING ) 
            : (FAKE_ENV_TYPE === ENV_TYPES.STAGING)
const IS_PRODUCTION = ! FAKE_ENV
            ? ( process.env.NODE_ENV === ENV_TYPES.PRODUCTION )
            : (FAKE_ENV_TYPE === ENV_TYPES.PRODUCTION)
const IS_TEST = process.env.NODE_ENV === ENV_TYPES.TEST
            
              
console.log( `Environment type: ${process.env.NODE_ENV}`);
if(FAKE_ENV) console.log(`Fake enviroment on: ${FAKE_ENV}`);


module.exports = {
  IS_DEVELOPMENT,
  IS_STAGING,
  IS_PRODUCTION, 
  IS_TEST,
  IS_FAKE_ENV : FAKE_ENV     
}