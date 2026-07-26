const Joi = require('joi');
const { ARGUMENTS_TYPES } = require('../middlewares/argumentsValidationMiddlewareFactory')
const { USER_ATTR, USER_AD_ATR, FRAMEWORK_ATTR } = require('../constants/modelConstants');
const { USER_TYPES } = require('../constants/appConstants');
const { provideEmailRegex } = require('./emailRegexProvider');

const createUserSchema = Joi.object(
  {
    [USER_ATTR.FULL_NAME] : Joi.string().required(),
    [USER_ATTR.EMAIL] : Joi.string().required(),
    [USER_ATTR.PASSWORD] : Joi.string()/*.min(8).pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[\w!@#\$%\^&\*]{8,}$/)*/.optional(),
    [USER_ATTR.USER_TYPE] : Joi.number().required(),
    [USER_ATTR.CELL_PHONE] : Joi.string().optional(),
    [USER_ATTR.LANDING_PHONE] : Joi.string().optional(),
    [USER_ATTR.PICTURE_PATH] : Joi.string().optional(),
    [USER_ATTR.WORKING_POSITION_ID_FK]  : Joi.number().optional(),
    [USER_ATTR.COMPANY_BRANCH_ID_FK] : Joi.number().optional(),
    [USER_ATTR.ACTIVE] : Joi.number().optional(),
    [USER_ATTR.COMPANY_LINE_ID_FK] : Joi.number().optional(),
  }
).required();

const paramIdUserSchema = Joi.object(
  {
    [FRAMEWORK_ATTR.ID] : Joi.number().required()
  }
).required();

const updateUserSchema = Joi.object(
  {
    [USER_ATTR.FULL_NAME] : Joi.string().trim().optional(),
    [USER_ATTR.EMAIL] : Joi.string().trim().optional(),
    [USER_AD_ATR.OLD_PASSWORD] : Joi.string().optional().trim(),
    [USER_AD_ATR.NEW_PASSWORD] : Joi.string().optional().trim(),
    //[USER_ATTR.USER_TYPE] : Joi.number().optional()    //not supported currently 
    [USER_ATTR.CELL_PHONE] : Joi.string().optional(),
    [USER_ATTR.LANDING_PHONE] : Joi.string().optional(),
    [USER_ATTR.PICTURE_PATH] : Joi.string().optional(),
    [USER_ATTR.WORKING_POSITION_ID_FK]  : Joi.number().optional(),
    [USER_ATTR.COMPANY_BRANCH_ID_FK] : Joi.number().optional(),
    [USER_ATTR.ACTIVE] : Joi.number().optional(),
    [USER_ATTR.COMPANY_LINE_ID_FK] : Joi.number().optional(),

  }
).and(USER_AD_ATR.NEW_PASSWORD, USER_AD_ATR.OLD_PASSWORD ).min(1).required();

const adminUpdateExtension = {
  [USER_ATTR.USER_TYPE] : Joi.number().optional()    
};

const checkEmailExistsSchema = Joi.object({
  [USER_ATTR.EMAIL] : Joi.string().trim().email().pattern( provideEmailRegex() ).required()
}).required();


module.exports = {
  createUserTypeSchemaArray : [
    ARGUMENTS_TYPES.BODY, createUserSchema   
  ],
  deleteUserTypeSchemaArray : [
    ARGUMENTS_TYPES.PARAMS, paramIdUserSchema
  ],
  updateUserTypeSchemaArray : [
    [ARGUMENTS_TYPES.PARAMS, paramIdUserSchema], [ARGUMENTS_TYPES.BODY, updateUserSchema]
  ],
  updateClientTypeSchemaArray : [
    [ARGUMENTS_TYPES.PARAMS, paramIdUserSchema], [ARGUMENTS_TYPES.BODY, updateUserSchema]
  ],
  updateAdminTypeSchemaArray : [
    [ARGUMENTS_TYPES.PARAMS, paramIdUserSchema], [ARGUMENTS_TYPES.BODY, updateUserSchema.append( adminUpdateExtension )]
  ],
  checkEmailTypeSchemaArray : [
    ARGUMENTS_TYPES.BODY, checkEmailExistsSchema
  ]
}