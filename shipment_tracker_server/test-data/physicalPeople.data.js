const C_C = require('./clients.data');
const { PHYSICAL_PERSON_ATTR, CLIENT_ATTR } = require('../constants/modelConstants')

module.exports = [
  {
    [PHYSICAL_PERSON_ATTR.PHYSICAL_PERSON_ID] : 1,
    [PHYSICAL_PERSON_ATTR.CLIENT_ID_FK] : C_C[0][CLIENT_ATTR.CLIENT_ID],
    [PHYSICAL_PERSON_ATTR.FULL_NAME] : "Jovan Jovanovic"
  }

];