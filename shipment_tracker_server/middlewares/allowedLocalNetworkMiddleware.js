const { AuthorizationError } = require('../utils/errorTypes');

module.exports = (req,res, next) => {      
  const tempAddress = req.connection.remoteAddress;
  const addressParts = tempAddress.split(':');
  const lastAddresPart = addressParts.pop();
  if(lastAddresPart ){
    const tempIpAddressParts = lastAddresPart.split('.');
    
    if( tempIpAddressParts.length === 4 &&
        tempIpAddressParts[0] === '192' &&
        tempIpAddressParts[1] === '168'){    
          return next();
    }else {
      return next( new AuthorizationError() )
    }
  }else {                            
    return next( new AuthorizationError() )
  }              
}