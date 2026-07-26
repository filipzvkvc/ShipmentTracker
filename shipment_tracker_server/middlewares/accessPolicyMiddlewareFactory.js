const { AuthorizationError } = require('../utils/errorTypes')

module.exports.accessPolicyMiddlewareFactory = ( allowedUserTypes , deniedUserTypes) => {
  if(allowedUserTypes == null) allowedUserTypes = [];
  if(deniedUserTypes == null) deniedUserTypes = [];

  if( allowedUserTypes.every( lmdAllowedUserType => ! deniedUserTypes.includes( lmdAllowedUserType ) )){
    return (req, res, next) => {
      let { user_type : userType } = req.authData;
      if( allowedUserTypes.includes( userType) && ! deniedUserTypes.includes(userType) ){
        next();
      }else {
        next(new AuthorizationError("You do not have right permissions to access to specified resource"));
      }      
    }
  }else {
    throw new Error("Allowed usert type can not be in denied user types array at the same time");
  }
}