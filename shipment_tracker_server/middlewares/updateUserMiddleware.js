const { USER_AD_ATR, USER_ATTR } = require('../constants/modelConstants')
const User = require('../models/User');
const { AuthenticationError, ServerError } = require('../utils/errorTypes')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt');

module.exports = async (req, res, next) => {
  try {
    

    if( USER_AD_ATR.NEW_PASSWORD in req.body){
      let tempUser = null;

      tempUser = await User.unscoped().findByPk(req.params.id);
      
      if( ! tempUser || ! await bcrypt.compare(req.body[USER_AD_ATR.OLD_PASSWORD] , tempUser[USER_ATTR.PASSWORD] )) return next( new AuthenticationError("Old user password not valid") )    

      let tempResponseBody = {...req.body, [USER_ATTR.PASSWORD] : req.body[USER_AD_ATR.NEW_PASSWORD]  }
      delete tempResponseBody[USER_AD_ATR.OLD_PASSWORD];
      delete tempResponseBody[USER_AD_ATR.NEW_PASSWORD];
  
      req.body = tempResponseBody;  

      await User.passwordHash(req.body);            
    }//end if             
    
    console.log("Patch req body", req.body)
    next();    
  }catch( error ){
    next( new ServerError(null, error))
  }
}