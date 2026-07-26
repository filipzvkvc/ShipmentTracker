const { isDefined } = require('../utils/utils')

const { errorResponseHandler } = require('../responseHandlers/errorResponseHandler');


module.exports.catchAllErrorMiddleware = function ( error, req, res, next){
   errorResponseHandler( error, req, res, next);                   
   return res.end();
}