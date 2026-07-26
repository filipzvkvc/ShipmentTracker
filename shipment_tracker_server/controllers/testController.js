
const { BaseError, ArgumentsValidationError, ServerError, NoResultsError, ErrorToResponse } = require('../utils/errorTypes');


module.exports.test1 = async function (req, res,next){
   next( new BaseError(400, "Test error - No nested exception"))
}

module.exports.test2 = async function( req, res, next) {
    next( new BaseError(400, "Test error - With nested exception", new Error("Hello") ) );
}

module.exports.test3 = async function( req, res, next) {
    throw new BaseError(500, "Test error - Error without next");
}

module.exports.test4 = async function (req, res,next){
    next( new ArgumentsValidationError("Test error argument validation error - Print stack trace"))
}

module.exports.test5 = async function (req, res,next){
    next( new ArgumentsValidationError("Test error argument validation error - Do not print stack trace", null, false))
    
}

module.exports.test6 = async function (req, res,next){
    next( new ArgumentsValidationError("Test error argument validation error  with nested exception - Print stack trace", new Error("Nested exception error") ));
}

module.exports.test7 = async function (req, res,next){
    next( new ServerError("Test server error - Do not print stack trace"));
}

module.exports.test8 = async function (req, res,next){
    next( new NoResultsError(500, null, "Test no result error - Do not print stack trace"));
}

module.exports.test9 = async function (req, res,next){
    next( new ErrorToResponse(500, null,new Error("Error to response error (nested exception)" ) ));
} 


module.exports.getIpAddress = (req, res, next) => {
    res.status(200);
    return res.send(`<div>Client IP Address: ${req.ip}</div><div>Client ip addresses (proxy headers): ${req.ips}</div>`);    
    
}

module.exports.allowedLocalNetwork = (req,res, next) => {    
    res.status(200).send("Allowed")
}

module.exports.tokenValidated = ( req, res, next) => res.status(200).send("Token successfully validated");

module.exports.testRoute = (req, res, next) => res.status(200).send("Test route");