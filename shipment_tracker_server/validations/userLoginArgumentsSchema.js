const { USER_ATTR, PASSWORD_RESET_AD_ATTR, MIDDLEWARES_ATTRIBUTES : { AUTH : AUTH_MIDDLEWARE_ATTR } } = require('../constants/modelConstants')
const Joi = require('joi');
const { ARGUMENTS_TYPES } = require('../middlewares/argumentsValidationMiddlewareFactory')

const userLoginSchema = Joi.object( {
  email : Joi.string().required(),
  password : Joi.string().required()
}).required()

const forgottenPasswordSchema = Joi.object(
  {
    [USER_ATTR.EMAIL] : Joi.string().required()
  }
).required();

const resetPasswordBodySchama = Joi.object(
  {
    [PASSWORD_RESET_AD_ATTR.NEW_PASSWORD] : Joi.string().required(),
    [PASSWORD_RESET_AD_ATTR.NEW_AGAIN_PASSWORD] : Joi.string().required()
  }
).required();


/*
const resetPasswordQuerySchema = Joi.object({
  [AUTH_MIDDLEWARE_ATTR.ACCESS_TOKEN] : Joi.string().required()
}).required();
*/
module.exports = {
  userLoginSchemaArray : [ARGUMENTS_TYPES.BODY, userLoginSchema],
  forgottenPasswordSchemaArray : [ARGUMENTS_TYPES.BODY, forgottenPasswordSchema],
  resetPasswordSchemaArray : [ARGUMENTS_TYPES.BODY, resetPasswordBodySchama]
}
