const bcrypt = require('bcrypt');
const { USER_ATTR } = require('../constants/modelConstants')

module.exports = async (req, res, next) => {
  try {    
    req.body.password = await bcrypt.hash(req.body[USER_ATTR.PASSWORD], 10 )  
    next();
  }catch(error){    
    next(error);
  }
}