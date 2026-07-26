const router = require('express').Router();
const { login, forgottenPassword, resetPassword } = require('../controllers/authController');
const { argumentsValidationMiddlewareFactory, ARGUMENTS_TYPES } = require('../middlewares/argumentsValidationMiddlewareFactory');
const { userLoginSchemaArray, forgottenPasswordSchemaArray, resetPasswordSchemaArray } = require('../validations/userLoginArgumentsSchema');
const { catchErrors } = require('../utils/utils')


router
  .post('/login',
    argumentsValidationMiddlewareFactory(userLoginSchemaArray), 
    login)
  .post('/forgottenpassword', 
    argumentsValidationMiddlewareFactory(forgottenPasswordSchemaArray),    
    catchErrors(forgottenPassword) )
  .post('/resetpassword',
    argumentsValidationMiddlewareFactory(resetPasswordSchemaArray),
    catchErrors(resetPassword) )

module.exports = router;