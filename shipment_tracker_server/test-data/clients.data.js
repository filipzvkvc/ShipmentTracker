const { CLIENT_ATTR } = require('../constants/modelConstants')
const { CLIENT_TYPES } = require('../constants/appConstants');

module.exports = [
  {
    [CLIENT_ATTR.CLIENT_ID] : 1,
    [CLIENT_ATTR.CLIENT_TYPE] : CLIENT_TYPES.PHYSICAL_PERSON,
    [CLIENT_ATTR.EMAIL]  : "jovan@brasnoexport.rs",
    [CLIENT_ATTR.PHONE_NUMBER] : "0648453234"
  },
  {
    [CLIENT_ATTR.CLIENT_ID] : 2,
    [CLIENT_ATTR.CLIENT_TYPE] : CLIENT_TYPES.LEGAL_PERSON,
    [CLIENT_ATTR.EMAIL]  : "zeljko@jugotravel.rs",
    [CLIENT_ATTR.PHONE_NUMBER] : "0656324764"
  }
];