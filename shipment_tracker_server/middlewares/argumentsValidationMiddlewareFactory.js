const { ArgumentsValidationError, BaseError } = require('../utils/errorTypes');
const { ValidationError } = require('joi')
const { extractErrorMsg } =  require('../utils/utils');
const Joi = require('joi');

const ARGUMENTS_TYPES = {
    PARAMS : 'params',
    QUERY : 'query',
    BODY : 'body'
} 

/** Data transfer object validation middleware factory for different joi schemas*/
/**
 * Create validation middleware based on argquemnt type key in request (ex. params, query, body) and Joi validation schema 
 * @param { [string, Joi.ObjectSchema]| [[string, Joi.ObjectSchema]]} argTypeSchemaArray -
 */
 
const argFactorySchemaSingleItem = Joi.array().ordered( Joi.string().regex(/^params$|^body$|^query$/).required(), 
                                                      Joi.object().unknown(true).required()
                                                      ).required();
const argFactorySchema = Joi.alternatives().match('one')
                            .try(argFactorySchemaSingleItem,
                                Joi.array().items( argFactorySchemaSingleItem ).required() ).required() ;



const argumentsValidationMiddlewareFactory = ( argTypeSchemaArray ) => {   
  let validationResult = argFactorySchema.validate( argTypeSchemaArray);  
  if( typeof validationResult.value === 'undefined' ) { throw validationResult.error }          

  let typeSchemaArray = argTypeSchemaArray;  
  if( Array.isArray( argTypeSchemaArray) && argTypeSchemaArray.length === 2 && ! Array.isArray( argTypeSchemaArray[0] ) ){    
      typeSchemaArray = [ argTypeSchemaArray ];
  }      

  return async (req, res, next) => {        
      try {
        await Promise.all(
          typeSchemaArray.map( ([key, schema]) => schema.validateAsync( req[key] ) ) );
            
        next();        
      }catch( error ){
        if( error instanceof ValidationError) {                    
            return next( new ArgumentsValidationError(extractErrorMsg( error, null) ) );
        }
        else { 
            return next( new BaseError(300, "Error during validation", error));
        }        
      }   
    }//and async func   
}

module.exports = {
    ARGUMENTS_TYPES,
    argumentsValidationMiddlewareFactory,
    argFactorySchemaSingleItem,
    argFactorySchema
}