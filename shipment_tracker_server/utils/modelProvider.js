/***
 * @typedef { import('sequelize/types').Sequelize } Sequelize
 * @typedef { import('sequelize/types').Model } Model
 * @param { Sequelize} db
 * @param {String} modelName
 * @return { Model } 
 */
const camelCase = require('camelcase');

module.exports = function ( db, modelName ){
    
    if( db.isDefined( modelName ) ){
       return db.model( modelName ); 
    }else {        
        return require(
            "../models/".concat( camelCase( modelName) )  
            );
    }
    
}
