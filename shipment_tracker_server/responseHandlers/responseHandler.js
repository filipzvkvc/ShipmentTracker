const { isUndefined ,isDefined }  = require('../utils/utils')

/** This function exists because there maybe will be need to log response returned to user or doing some extra stuff, like loggin user action in database */
module.exports = function( req, res, argStatusCode, argObj ) {
  res.status( ! isUndefined( argStatusCode)  && argStatusCode !== null ? argStatusCode : 200 );
  if( isDefined( argObj) && argObj !== null){
      res.json(argObj);
  }else {
      res.end();
  }

  //call to function that logs user activity (parameters can be sent via req object)
}