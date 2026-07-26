const Joi = require('joi');
const { REG_STATS_QUERY_KEYS } = require('../constants/appConstants')
const { SCHEMA_PARAMETERS : { CLIENT_TYPE_MIN_MAX } } = require("./statisticsArgumentsSchemas")
const { STATS_PRICE_TYPES } = require('../constants/appConstants')
const { ARGUMENTS_TYPES } = require('../middlewares/argumentsValidationMiddlewareFactory')
const  { generateAlternativeRegexStringFromObjValues } = require('../utils/utils')

const priceTypesRegex = new RegExp( generateAlternativeRegexStringFromObjValues( STATS_PRICE_TYPES ));


const queryStatsSchema = Joi.object(
  {
    [REG_STATS_QUERY_KEYS.START] : Joi.number().required(),
    [REG_STATS_QUERY_KEYS.END] : Joi.number().required(),      
    [REG_STATS_QUERY_KEYS.BRANCHES] : Joi.array().items( Joi.number().required() ).optional(),
    [REG_STATS_QUERY_KEYS.LINES] : Joi.array().items( Joi.number().required() ).optional(),
    [REG_STATS_QUERY_KEYS.INSURANCE_COMPANIES] : Joi.array().items( Joi.number().required() ).optional(),
    [REG_STATS_QUERY_KEYS.VEHICLE_TYPES] : Joi.array( ).items( Joi.number(). required() ).optional(),
    [REG_STATS_QUERY_KEYS.CLIENT_TYPES] : Joi.array().items( Joi.number().min(CLIENT_TYPE_MIN_MAX.min).max(CLIENT_TYPE_MIN_MAX.max).required() ).optional(),    
    [REG_STATS_QUERY_KEYS.REGISTRATION_EXP_BEFORE] : Joi.number().optional(),
  }
).required();

module.exports = {
  queryStatsSchemaArray : [
    ARGUMENTS_TYPES.BODY, queryStatsSchema    
  ]
}

