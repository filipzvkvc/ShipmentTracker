const { isUndefined, isUndefinedOrNull } = require("./utils");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
  
module.exports = AppError;

class BaseError extends Error {
  constructor(argStatusCode, argMessage, argNestedException, argPrintStackTrace){
    super(argMessage);
    this.statusCode = argStatusCode
    this.nestedException = ! isUndefinedOrNull( argNestedException) ? argNestedException : null;
    this.printStackTrace =  isUndefined(argPrintStackTrace) || typeof argPrintStackTrace !== 'boolean' ? true : argPrintStackTrace;

    if(this.printStackTrace){
        Error.captureStackTrace(this, this.constructor);
    }
  }

  getStackTrace(){
    return this.stack;
  }
}
module.exports.BaseError = BaseError;

class ArgumentsValidationError extends BaseError {
  constructor(argValidationMessages, argNestedException, argPrintStackTrace){
    super(400, argValidationMessages, argNestedException, argPrintStackTrace );            
  }
}

module.exports.ArgumentsValidationError = ArgumentsValidationError;

class ServerError extends BaseError {
    constructor( argMessage, argNestedException, argPrintStackTrace){
        super( 500, ! isUndefined(argMessage )  && argMessage !== null ? argMessage : "Server error", argNestedException, argPrintStackTrace);                
    }

}
module.exports.ServerError = ServerError;

class NoResultsError extends BaseError {
    constructor( argStatusCode, argMessage, argNestedException, argPrintStackTrace){
        super( argStatusCode, argMessage, argNestedException, argPrintStackTrace);
    }

}

module.exports.NoResultsError = NoResultsError;


class AuthenticationError extends BaseError {
    constructor( argMessage, argNestedException, argPrintStackTrace ){
        super( 401, argMessage == null ? "Authentication Error" : argMessage, argNestedException, argPrintStackTrace)
    }
}

module.exports.AuthenticationError = AuthenticationError;

class AuthorizationError extends BaseError {
    constructor( argMessage, argNestedException, argPrintStackTrace ){
        super( 403, argMessage == null ? "Authorization Error" : argMessage, argNestedException, argPrintStackTrace)
    }

}

module.exports.AuthorizationError = AuthorizationError;