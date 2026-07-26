const { isDefined, isDefinedAndNotNull } = require('../utils/utils');
const SETTINGS = require('../Settings');
const { ArgumentsValidationError } = require('../utils/errorTypes');
                    
/** This function exists because there maybe will be need to log errors, so it is done from one place */
function errorResponseHandler( error, req, res, next){  
  let tempStatusCode = isDefined(error.statusCode) && error.statusCode !== null ? error.statusCode : 500;    
  let tempResponse = { response : "No response"};

  res.status(tempStatusCode)

  if(error instanceof ArgumentsValidationError){
    tempResponse = error.message;
    res.json(tempResponse);
  }else if( isDefinedAndNotNull( error.nestedException) ){
    tempResponse = `${error.toString()}  ( ${ error.nestedException.toString() } )`;
    res.send( tempResponse );        
  }else if(typeof error === 'string'){        
    tempResponse = error;
    res.send( tempResponse );    
  }else {
    tempResponse = error.toString();    
    res.send( tempResponse )    
    
  }      
   
  //call to function that logs error 
  if(SETTINGS.LOG_ERRORS_TO_CONSOLE){
    console.error( error )
  }
}


module.exports = {
  errorResponseHandler
}