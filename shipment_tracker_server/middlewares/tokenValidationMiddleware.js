const jwt = require('jsonwebtoken');
const {  AuthorizationError, ServerError} = require('../utils/errorTypes');
const { SERCRET_KEY } = require('../controllers/authController');

module.exports.tokenValidationMiddleware = async (req, res, next) => {  
  try {
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
      const bearer = bearerHeader.split(' ');
      const bearerToken = bearer[1];      

      let verificationResult = await new Promise( (resolve, reject) => {
        jwt.verify(bearerToken, SERCRET_KEY, function(error, token){          
          if( !error ){ resolve(token) } else { reject(error) }        
        })
      })

      req.token = bearerToken;
      req.authData =  verificationResult;      

      next();
    }else {
      return next(new AuthorizationError() );
    }

  }catch(error){
    return next(new ServerError(null, error) )
  }
}