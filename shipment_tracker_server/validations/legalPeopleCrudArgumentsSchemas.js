const Joi = require('joi');
const { ARGUMENTS_TYPES } = require('../middlewares/argumentsValidationMiddlewareFactory')
const { LEGAL_PERSON_ATTR, USER_AD_ATR, FRAMEWORK_ATTR } = require('../constants/modelConstants');
const { USER_TYPES } = require('../constants/appConstants');



const checkPibExistsSchema = Joi.object({
  [LEGAL_PERSON_ATTR.PIB] : Joi.string().trim().required()
}).required();

module.exports = {  
  checkPibExistsTypeSchemaArray : [
    ARGUMENTS_TYPES.BODY, checkPibExistsSchema
  ]
}