const { ArgumentsValidationError, BaseError } = require('../utils/errorTypes');
const { ValidationError } = require('joi')
const { extractErrorMsg } =  require('../utils/utils');
const Joi = require('joi');

const { DATA_TYPES, argumentsValidationMiddlewareFactory, argFactorySchema } = require('./argumentsValidationMiddlewareFactory');
const { USER_TYPES } = require('../constants/appConstants')

const userTypesRegex = new RegExp( Object.values( USER_TYPES )
                              .map( userTypeValue => `^${userTypeValue}$`)
                              .join('|') )



const singleUserTypeArgSchema = Joi.array().ordered(    
    Joi.number().allow( ...Object.values( USER_TYPES) ).required(),
    argFactorySchema
  ).required();

const multiUserTypesArgSchema = Joi.alternatives().match('one')
                            .try(singleUserTypeArgSchema,
                                  Joi.array().items( singleUserTypeArgSchema ).required() ).required() ;


const mutlipleUserTypesArgValidationMiddlewareFactory = ( multiUserArgTypeSchemaArray ) => {   
  let validationResult = multiUserTypesArgSchema.validate( multiUserArgTypeSchemaArray);  
  if( typeof validationResult.value === 'undefined' ) { throw validationResult.error }          

  let tempUserTypeSchemasArray = multiUserArgTypeSchemaArray;  
  if( Array.isArray( multiUserArgTypeSchemaArray) && multiUserArgTypeSchemaArray.length === 2 && Number.isInteger( multiUserArgTypeSchemaArray[0] ) ){    
      tempUserTypeSchemasArray = [ multiUserArgTypeSchemaArray ];
  }  
  

  const userTypesSchemas = tempUserTypeSchemasArray
    .reduce( (acc, current) => { 
      const [tempUserType, tempSchema] = current;
      acc[tempUserType] = argumentsValidationMiddlewareFactory(tempSchema);      
      return acc;
    }, {});

  return async (req, res, next) => {
    const { user_type : userType } = req.authData;

    if(userType in userTypesSchemas){
      return userTypesSchemas[userType](req, res, next);
    }else {
      next(new Error("User type not exsists - multiple user type arg validation middleware factory"))
    }
  }// end async
}  

module.exports = { 
  mutlipleUserTypesArgValidationMiddlewareFactory
}