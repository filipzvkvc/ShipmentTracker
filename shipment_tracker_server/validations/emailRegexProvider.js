const { DEVELOPMENT : { DISABLE_EMAIL_REGEX } } = require('../Settings');
const { IS_DEVELOPMENT } = require('../config/environment');

let emailRegex;

if( IS_DEVELOPMENT && DISABLE_EMAIL_REGEX){
  emailRegex = /.*/i;
}else {
  emailRegex = /@shipmenttracker.rs$/i;
}

function provideEmailRegex(){
  return emailRegex;
}

module.exports = {
  provideEmailRegex
}