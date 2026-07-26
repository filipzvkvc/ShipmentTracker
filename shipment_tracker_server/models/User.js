const { Model, DataTypes, Sequelize } = require('sequelize');
const { USER_TYPES } = require('../constants/appConstants');
const { MODELS_NAMES, USER_ATTR, WORKING_POS_ATTR, COMP_BRANCH_ATTR, COMP_LINE_ATTR, 
        FRAMEWORK_ATTR, ASSOCIATION_ALIASES : { USER_ASSOCIATIONS } } = require('../constants/modelConstants');
const db = require('../config/database');
const { provideEmailRegex } = require('../validations/emailRegexProvider')
const bcrypt = require('bcrypt');
const generator = require('generate-password');
const { sendPasswordEmail } = require('../utils/mailUtils');
const { IS_DEVELOPMENT } = require('../config/environment')

class User extends Model {
  static async passwordHash(user){  
    const hashedPassword = await bcrypt.hash( user[USER_ATTR.PASSWORD], 10 )   

    user[USER_ATTR.PASSWORD] = hashedPassword;

    return {
      [USER_ATTR.PASSWORD] : hashedPassword
    }   
  }
}

let __moduleVariables = {};

User.init( 
{
  [USER_ATTR.USER_ID] : {    
    type: DataTypes.INTEGER,
    primaryKey : true,
    autoIncrement : true
  },
  [USER_ATTR.FULL_NAME] : {
    type : DataTypes.STRING,
    allowNull : false,
  },
  [USER_ATTR.EMAIL] : { 
    type : DataTypes.STRING, 
    allowNull : false,     
    validate : {
      isEmail : true,
      // is : provideEmailRegex()
    }
  },
  [USER_ATTR.PASSWORD] : {
    type: DataTypes.STRING,
    allowNull : true
  },
  [USER_ATTR.USER_TYPE] : { 
    type: DataTypes.INTEGER,
    allowNull  : false
  },
  [USER_ATTR.CELL_PHONE] : {
    type : DataTypes.STRING,    
  },
  // [USER_ATTR.LANDING_PHONE] : {
  //   type : DataTypes.STRING,    
  // },
  [USER_ATTR.PICTURE_PATH] : {
    type : DataTypes.STRING,      
    allowNull  : true
  },  
//   [USER_ATTR.WORKING_POSITION_ID_FK] : {
//     type : DataTypes.INTEGER,
//     references : {
//       model : WorkingPosition,
//       key : WORKING_POS_ATTR.WORKING_POSITION_ID
//     }
//   },
//   [USER_ATTR.COMPANY_BRANCH_ID_FK] : {
//     type : DataTypes.INTEGER,
//     references : {
//       model : CompanyBranch,
//       key : COMP_BRANCH_ATTR.COMPANY_BRANCH_ID
//     }
//   },  
//  [USER_ATTR.COMPANY_LINE_ID_FK] : {
//    type : DataTypes.INTEGER,
//    references :  {
//      model : CompanyLine,
//      key : COMP_LINE_ATTR.COMPANY_LINE_ID
//    }

//  },
//  [USER_ATTR.ACTIVE] : {
//    type : DataTypes.BOOLEAN,
//    allowNull : false,
//    defaultValue : true,
//  }

}, {
  sequelize : db,
  modelName : MODELS_NAMES.USER,
  underscored : true,
  paranoid : true,
  defaultScope : {
    attributes : {
      exclude : [USER_ATTR.PASSWORD, FRAMEWORK_ATTR.UPDATED_AT]
    }
  },
  hooks : {
    beforeCreate : beforeCreateUserHook,    
    afterCreate : afterCreateUser    
  }    
})


async function beforeCreateUserHook(user, options){
  const generatedPassword = generator.generate({ length : 10, lowercase : true, uppercase : true, numbers : true });

  user[USER_ATTR.PASSWORD] = generatedPassword;

  const tempEmail = user[USER_ATTR.EMAIL];    
  __moduleVariables[tempEmail] = generatedPassword      
  
  await User.passwordHash(user);
}

async function afterCreateUser(user){  
  const tempEmail = user[USER_ATTR.EMAIL];
  try {
    const generatedPassword = __moduleVariables[tempEmail];

    if(IS_DEVELOPMENT) console.log(`Generated password for user:${tempEmail} is ${__moduleVariables[tempEmail]}`)      
      
    await sendPasswordEmail(user[USER_ATTR.EMAIL], generatedPassword);

  }catch(error){
    console.log("ERROR", error.response.body);
    throw error;
  }finally {
    delete __moduleVariables[tempEmail]; 
  }
}

// User.belongsTo(WorkingPosition, { foreignKey: USER_ATTR.WORKING_POSITION_ID_FK, as: USER_ASSOCIATIONS.WORKING_POSITION} );
// User.belongsTo(CompanyBranch, { foreignKey: USER_ATTR.COMPANY_BRANCH_ID_FK, as: USER_ASSOCIATIONS.COMPANY_BRANCH});
// User.belongsTo(CompanyLine, { foreignKey : USER_ATTR.COMPANY_LINE_ID_FK, as: USER_ASSOCIATIONS.COMPANY_LINE });


module.exports = User;