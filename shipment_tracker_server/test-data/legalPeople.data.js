const C_C = require('./clients.data');
const { LEGAL_PERSON_ATTR, CLIENT_ATTR } = require('../constants/modelConstants')

module.exports = [
  {
    [LEGAL_PERSON_ATTR.LEGAL_PERSON_ID] : 1,
    [LEGAL_PERSON_ATTR.CLIENT_ID_FK] : C_C[1][CLIENT_ATTR.CLIENT_ID],
    [LEGAL_PERSON_ATTR.LEGAL_NAME] : "Yugo travel",
    [LEGAL_PERSON_ATTR.TOWN] : "Novi Sad",
    [LEGAL_PERSON_ATTR.ADDRESS] : "Arse Teodorovica 29",
    [LEGAL_PERSON_ATTR.CONTACT_PERSON] : "Zeljko Zeljkovic",
    [LEGAL_PERSON_ATTR.PIB] : "3846296229",
    [LEGAL_PERSON_ATTR.MB] : "1234567"
  }
];