const { BaseError } = require('../utils/errorTypes');
const { errorResponseHandler } = require('../responseHandlers/errorResponseHandler');

module.exports.baseErrorMiddleware = function ( error, req, res, next){
    if( error instanceof BaseError){
        errorResponseHandler( error, req, res, next);  
        return res.end();        
    }else {
        next (error);
    }
}
