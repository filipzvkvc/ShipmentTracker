const camelCase = require('camelcase');
const upperCamelCase = require('uppercamelcase');
/**
 * 
 * @param { import('sequelize') } db  
 */

module.exports = async function ( db ) {        
  const modelNames = Object.values( require('../constants/modelConstants').MODELS_NAMES );  
  let models = modelNames.map( tempModelName => { console.log(tempModelName);  return modelProvider(db, tempModelName) });

  return db.sync()
      .then( () => console.log("Models synced") )
      .catch( ( error ) => console.error('Error syncing models:', error ) );
}

/***
 * @typedef { import('sequelize/types').Sequelize } Sequelize
 * @typedef { import('sequelize/types').Model } Model
 * @param { Sequelize} db
 * @param {String} modelName
 * @return { Model } 
 */
function modelProvider( db, modelName ){
    
  if( db.isDefined( modelName ) ){
    return db.model( modelName ); 
  }else {        
    return require(
        "../models/".concat( upperCamelCase( modelName) )  
        );
  }    
}
