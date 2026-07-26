const _ = require('lodash');
const responseHandler = require('../responseHandlers/responseHandler')
const { NoResultsError } = require('../utils/errorTypes')
const upperCamelCase = require('uppercamelcase');
const { Op } = require('sequelize');


const f = {
  'limit' : Number,
  'offset' : Number
}

const queryParamsMiddlewareFactory = (Model, includeOptions, indexMap, splitCharacter ) => async (req, res, next) => {    
  const queryKeysLength = Object.keys(req.query).length;   
  if(queryKeysLength === 0 && ! (queryKeysLength === 1 &&  '0' in req.query) ){
    return next()
  }
  
  const tempSplitChar = splitCharacter == null ? '-' : splitCharacter
  try {
    let tempInclOptions = _.cloneDeep(includeOptions);

    Object.entries(req.query)
      .map( ([key, value]) => {         
        if(key.includes('.') ){                    
          let tempSplit = key.split('.');          
          if(indexMap[tempSplit[0]] === null){
            return ([ [ { [tempSplit[1]] : value} ] , null]);
          }else {
            return ([ [ { [`$${tempSplit[0]}.${tempSplit[1]}$`] : value} ] , null]);s
          }
        }else {
          return ([key.split( tempSplitChar ), value]) 
        }
      })
      .forEach(([keyArray, value]) => {          
        if(keyArray.length === 1){          
          if(typeof keyArray[0] === 'object' ){            
            tempInclOptions["where"][Op.and].push( keyArray[0] );            
          }else {            
            tempInclOptions[keyArray[0]] = keyArray[0] in f ? f[keyArray](value) : value
          }
        }else if( keyArray.length === 2){
          let tempIndexMapValue = indexMap[keyArray[0]];
          if( tempIndexMapValue != null){
             tempInclOptions.include[ tempIndexMapValue ]['where'][Op.and].push( { [keyArray[1]] : value})            
          }else {
            tempInclOptions['where'][Op.and].push( { [keyArray[1]] : value } );
          }
        }
      });      
      let result = await Model.findAll(tempInclOptions);

      if (!result) return next(new NoResultsError(404,'No results found.'));            
      responseHandler(req, res, 200, result);

    }catch(error){
      next(error);
    }        
}

function cloneFindOptions( findOptions ){
  const dynamicQueryOptions = _.cloneDeep( findOptions)  
  if(dynamicQueryOptions.include){    
    dynamicQueryOptions.include = dynamicQueryOptions.include.map( el => ({...el, where : {
      ...el.where,      
      [Op.and] : ('where' in el && Op.and in el.where) 
                    ? [...el.where[Op.and].map( opAndEl => ({...opAndEl}) )]
                    : [] }
     }))
  }  

  
  dynamicQueryOptions.where = {...dynamicQueryOptions.where}  
  dynamicQueryOptions.where[Op.and] = Op.and in dynamicQueryOptions.where 
                                          ? [...dynamicQueryOptions.where[Op.and].map( opAndElement => ({...opAndElement}) )] 
                                          : [];  
  
  return dynamicQueryOptions;
}

function generateIndexMap( findOptions, startModelKey ){
  if(startModelKey == null) throw new Error("start model key is mandatory - generateIndexMap function");

  let indexMap = {
    [startModelKey] : null,
  }

  findOptions.include.forEach((el, index) => {          
    if('as' in el || 'AS' in el){
      indexMap[el.as] = index;
    }else {
      indexMap[ upperCamelCase(el.model.options.name.singular) ] = index;
    }
  })  
  return indexMap;
}

module.exports = { 
  queryParamsMiddlewareFactory,
  cloneFindOptions,
  generateIndexMap
}