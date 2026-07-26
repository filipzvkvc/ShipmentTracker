const { Model, DataTypes } = require('sequelize');
const { MODELS_NAMES, PASSWORD_RESET_REQ_ATTR } = require('../constants/modelConstants')
const db = require('../config/database');

class PasswordResetRequest extends Model {
  static async createResetRequest(token, transaction ){
    return await PasswordResetRequest.create( { token }, { transaction });
  }

  static async getResetRequest( token, transaction ){
    return await PasswordResetRequest.findOne({
      where : {
        [PASSWORD_RESET_REQ_ATTR.TOKEN] : token
      }
    }, { transaction })
  }
  
  async deleteResetRequest(transaction){
    return await this.destroy({transaction});
  }
}


PasswordResetRequest.init({
  [PASSWORD_RESET_REQ_ATTR.PASSWORD_RESET_REQUEST_ID] : {    
    type : DataTypes.INTEGER,
    autoIncrement : true,
    primaryKey : true
  },
  [PASSWORD_RESET_REQ_ATTR.TOKEN] : {
    type : DataTypes.TEXT('medium'),
    allowNull : false,    
  }
}, {
  sequelize : db,
  modelName : MODELS_NAMES.PASSWORD_RESET_REQUEST,
  underscored : true,  
});




module.exports = PasswordResetRequest;