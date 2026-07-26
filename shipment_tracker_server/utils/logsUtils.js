const _ = require('lodash');
//const { Model, Sequelize } = require('sequelize');
const db = require('../config/database')

const modelProvider = require('../utils/modelProvider')
const { MODELS_NAMES } = require('../constants/modelConstants')

//const ATTR_TO_OMIT = ["field", "_modelAttribute", "fieldName", "Model"]
const LOG_MODEL_SUFFIX = "log"

const LOG_MODEL_OPTIONS_MAP = {  
  //[MODELS_NAMES.USER] : {}
}

const LOG_MODEL_REFERENCES_MAP = {
  //[MODELS_NAMES.USER] : {}
}

const LOG_MODEL_ADDITIONAL_ATTRIBUTES_MAP = {
  //[MODELS_NAMES.USER] : {}
}

const LOG_MODEL_COMMON_ATTRIBUTTES = {
  //attributes definition (from sequelize model)
}

function replaceReferences(key, referenesObject){
  const tempReferencesObj = LOG_MODEL_REFERENCES_MAP[key];
  if(! tempReferencesObj) throw new Error("No log model references object for specified key")  

  return tempReferencesObj;
}

async function initLogModels(){  
  const tempModelNames = Object.values(MODELS_NAMES);
  const logModelNamesMap = tempModelNames.map( modelName => ({ [modelName] : modelName + "_" + LOG_MODEL_SUFFIX }) )
  const logModels = tempModelNames
                      .map( lmdModelName => ( [lmdModelName, modelProvider(db, lmdModelName)] ) )
                      .map( ([lmdModelName, lmdModel]) => createModel(
                          extractModelAttributes(lmdModel),
                          logModelNamesMap[lmdModel],
                          lmdModelName  ) )                      
              
    return await db.sync();
}
/**
 * @param argModel { import('sequelize').Model }
 * @returns { object }  */
function extractModelAttributes(argModel){
  return Object.fromEntries(
            Object.entries( argModel.rawAttributes )
                    .map( ([key, value]) => ([key, "references" in value ? replaceReferences(key, value) : value] ))
                    .map( ([key, value]) => ([key, _.pick(value, ["type", "primaryKey", "references"]) ]) ) 
        )
}

/**
 * 
 * @param { object } argExtractedModelAttr 
 * @return { import('sequelize').Model }
 */
function createModel( argExtractedModelAttr, argNewModelName, argBaseModelName){
  return db.define(
    argNewModelName, 
    { 
      ...argExtractedModelAttr,
      ...LOG_MODEL_COMMON_ATTRIBUTTES,
      ...LOG_MODEL_ADDITIONAL_ATTRIBUTES_MAP[argBaseModelName]
    }, 
    LOG_MODEL_OPTIONS_MAP[argBaseModelName] );
}