const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const util = require('util');

const User = require('../models/User');
const { USER_ATTR, FRAMEWORK_ATTR, MIDDLEWARES_ATTRIBUTES : { AUTH : AUTH_MIDDLWARE_ATTR}, 
  MIDDLEWARES_ATTRIBUTES, USER_AD_ATR, PASSWORD_RESET_AD_ATTR, PASSWORD_RESET_REQ_ATTR } = require('../constants/modelConstants');

const responseHandler = require('../responseHandlers/responseHandler')

const { AuthenticationError, ServerError, ArgumentsValidationError} = require('../utils/errorTypes');
const { sendPasswordRecoveryEmail } = require('../utils/mailUtils');

const PasswordResetRequest = require('../models/PasswordResetRequest');


const SERCRET_KEY = process.env.JWT_SECRET;
const RECOVERY_SECRET_KEY = process.env.JWT_RECOVERY_SECRET;

module.exports.login = async (req, res, next) => {
  try {        
    let tempUser = await User.unscoped().findOne({
      attributes : {
        exclude : [FRAMEWORK_ATTR.CREATED_AT, FRAMEWORK_ATTR.UPDATED_AT]
      },
      where : {
        [USER_ATTR.EMAIL] : req.body[USER_ATTR.EMAIL],        
      }
    })      
      
    if( ! tempUser) {
      return next( new AuthenticationError("Invalid email or password") )
    }else {
      if( ! await bcrypt.compare(req.body[USER_ATTR.PASSWORD], tempUser[USER_ATTR.PASSWORD]) ){
        return next( new AuthenticationError("Invalid email or password") )
      }

      const tokenUser = {
        [USER_ATTR.USER_ID] : tempUser[USER_ATTR.USER_ID],
        [USER_ATTR.USER_TYPE] : tempUser[USER_ATTR.USER_TYPE],
        [USER_ATTR.FULL_NAME] : tempUser[USER_ATTR.FULL_NAME]
      };

      let resultToken = await new Promise( (resolve, reject) => {
        jwt.sign(tokenUser, SERCRET_KEY, function (error, token){ 

          if(error) { reject(error) } else  { resolve(token) }          
        } )
      });

      return responseHandler(req, res, 200, {        
        token : resultToken,
        ...tokenUser
      })

    }    
  }catch(error){
    return next(new ServerError(null, error) )
  }  
}

module.exports.SERCRET_KEY = SERCRET_KEY;

module.exports.forgottenPassword = async (req, res, next) => {
  const { email } = req.body;
  let t = await User.sequelize.transaction();
  try {
    let tempUser = await User.findOne({ where : { email }});
    if(! tempUser) return next(new AuthenticationError("Email address not found"));

    const mailTokenData = {
      [USER_ATTR.USER_ID] : tempUser[USER_ATTR.USER_ID],
      [USER_ATTR.EMAIL] : tempUser[USER_ATTR.EMAIL]
    }
    let tempToken = await util.promisify( jwt.sign )( mailTokenData, RECOVERY_SECRET_KEY );    
    await PasswordResetRequest.createResetRequest(tempToken, t);
    await sendPasswordRecoveryEmail( tempUser[USER_ATTR.EMAIL], encodeURIComponent( tempToken ) );
    
    await t.commit()
    t = null;

    return responseHandler(req, res, 204 );
  }catch(error){
    if(t) await t.rollback()
    return next(error);
  }
}

module.exports.resetPassword = async (req, res, next) => {
  let t = await User.sequelize.transaction();
  try {    
    if( ! req.query[AUTH_MIDDLWARE_ATTR.RESET_PASSWORD_TOKEN]) throw new ArgumentsValidationError("Missing query argument");    
    if( ! req.body[PASSWORD_RESET_AD_ATTR.NEW_PASSWORD]  || ! req.body[PASSWORD_RESET_AD_ATTR.NEW_AGAIN_PASSWORD]) throw new ArgumentsValidationError("New password and confirm password fields are required")
    
    const newPassowrd = req.body[PASSWORD_RESET_AD_ATTR.NEW_PASSWORD];
    const newAgainPassowrd = req.body[PASSWORD_RESET_AD_ATTR.NEW_AGAIN_PASSWORD];

    if(newPassowrd !== newAgainPassowrd) throw new ArgumentsValidationError("Both passwords must match");

    const tempToken = decodeURIComponent( req.query[AUTH_MIDDLWARE_ATTR.RESET_PASSWORD_TOKEN] );
    const tempTokenData = await util.promisify( jwt.verify )(tempToken, RECOVERY_SECRET_KEY);    

    let resetRequest = await PasswordResetRequest.getResetRequest(tempToken, t);
    if(! resetRequest) throw new ServerError("Password reset request not found")    

    let tempUser = { [USER_ATTR.PASSWORD] : newAgainPassowrd};
    let temp2 = await User.passwordHash(tempUser);
    
    const updateResult = await User.update( 
      tempUser, 
      { 
        fields : [USER_ATTR.PASSWORD],
        where : { 
          [USER_ATTR.EMAIL] : tempTokenData[USER_ATTR.EMAIL]
        },      
        transaction : t
      });    

    await resetRequest.deleteResetRequest(t);
    
    await t.commit()
    t = null;

    return responseHandler(req, res, 204);
    
  }catch(error){
    if(t) await t.rollback()
    return next(error);
  }
}