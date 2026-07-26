const { USER_TYPES } = require('../constants/appConstants');
const { allowAdminPolicyMiddleware } = require('./userTypesAccessPolicies');


module.exports.customUserItselfAndAdminAccessPolicyMiddleware = (req, res, next) => {
  const { user_type : userType, user_id : userId } = req.authData;  
  
  if( userType === USER_TYPES.EMPLOYEE && Number(req.params.id) === userId){    
    return next()        
  }else if(userType === USER_TYPES.CLIENT && Number(req.params.id) === userId  ){
    return next();
  }else {
    return allowAdminPolicyMiddleware(req, res, next);
  }  
}