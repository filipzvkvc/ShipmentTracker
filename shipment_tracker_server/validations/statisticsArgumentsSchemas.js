const Joi = require('joi');
const { ARGUMENTS_TYPES } = require('../middlewares/argumentsValidationMiddlewareFactory');
const {STATS_QUERY_KEYS, STATS_RESOLUTION_TYPES, STATS_MODEL_TYPES, 
        STATS_MODEL_TYPES_NUMBERS, STATS_REVENU_TYPES,CLIENT_TYPES } = require('../constants/appConstants');
const { generateAlternativeRegexStringFromObjValues, extractMinAndMaxFromObjValues } = require('../utils/utils');

const resolutionsRegex = new RegExp( generateAlternativeRegexStringFromObjValues( STATS_RESOLUTION_TYPES));

const modelsRegex = new RegExp( generateAlternativeRegexStringFromObjValues( STATS_MODEL_TYPES));

const revenueTypeRegex = new RegExp( generateAlternativeRegexStringFromObjValues(STATS_REVENU_TYPES ) );

const modelsMinMaxNums = extractMinAndMaxFromObjValues( STATS_MODEL_TYPES_NUMBERS);
const clientTypeMinMax = extractMinAndMaxFromObjValues( CLIENT_TYPES );

const queryStatsSchema = Joi.object(
  {
    [STATS_QUERY_KEYS.START] : Joi.number().required(),
    [STATS_QUERY_KEYS.END] : Joi.number().required(),
    [STATS_QUERY_KEYS.RESOLUTION] : Joi.string().pattern( new RegExp( resolutionsRegex )).optional(),
    //[STATS_QUERY_KEYS.MODEL] : Joi.alternatives().try( Joi.number().min(modelsMinMaxNums.min).max(modelsMinMaxNums.max).required(), Joi.string().pattern(modelsRegex).required() ).optional(),
    [STATS_QUERY_KEYS.BRANCHES] : Joi.array().items( Joi.number().required() ).optional(),
    [STATS_QUERY_KEYS.LINES] : Joi.array().items( Joi.number().required() ).optional(),
    [STATS_QUERY_KEYS.INSURANCE_COMPANIES] : Joi.array().items( Joi.number().required() ).optional(),
    [STATS_QUERY_KEYS.CLIENT_TYPES] : Joi.array().items( Joi.number().min(clientTypeMinMax.min).max(clientTypeMinMax.max).required() ).optional(),
    [STATS_QUERY_KEYS.REVENUE_TYPE] : Joi.string().pattern( revenueTypeRegex ).optional()
  }
).required();

module.exports = {
  SCHEMA_PARAMETERS : {
    CLIENT_TYPE_MIN_MAX : clientTypeMinMax
  },
  queryStatsTypeSchemaArray : [
    ARGUMENTS_TYPES.BODY, queryStatsSchema
  ]
}