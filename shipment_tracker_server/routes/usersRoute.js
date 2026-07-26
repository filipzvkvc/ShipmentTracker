const express = require('express');
const usersController = require('../controllers/usersController');
const router = express.Router();

const { argumentsValidationMiddlewareFactory, ARGUMENTS_TYPES } = require("../middlewares/argumentsValidationMiddlewareFactory")
const { createUserTypeSchemaArray, updateUserTypeSchemaArray, updateAdminTypeSchemaArray, checkEmailTypeSchemaArray } = require('../validations/userCrudArgumentsSchemas');

const { customUserItselfAndAdminAccessPolicyMiddleware } = require('../middlewares/customUserAccessPoliciesMiddlewares')
const { allowAdminPolicyMiddleware } = require('../middlewares/userTypesAccessPolicies');
const { mutlipleUserTypesArgValidationMiddlewareFactory } = require('../middlewares/multipleUserTypesArgValidationMiddlewareFactory');

const passwordHashMiddleware = require('../middlewares/passwordHashMiddleware');
const updateUserMiddleware = require('../middlewares/updateUserMiddleware')

const { USER_TYPES } = require('../constants/appConstants');
const { tokenValidationMiddleware } = require('../middlewares/tokenValidationMiddleware');



router.route('/upload')
        .post(usersController.upload.single('attachment'), usersController.uploadFile);
router.route('/checkIfEmailExists')
        .get(usersController.checkEmailExists);






router
        .route('/')
        .get(allowAdminPolicyMiddleware,
                usersController.getAll)
        .post(allowAdminPolicyMiddleware,
                argumentsValidationMiddlewareFactory(createUserTypeSchemaArray),
                //passwordHashMiddleware, 
                usersController.createOneExcludeAttributes);




router
        .route('/:id')
        .get(customUserItselfAndAdminAccessPolicyMiddleware,
                usersController.getOne)
        .delete(allowAdminPolicyMiddleware,
                usersController.deleteOne)
        .patch(customUserItselfAndAdminAccessPolicyMiddleware,
                mutlipleUserTypesArgValidationMiddlewareFactory([
                        [USER_TYPES.EMPLOYEE, updateUserTypeSchemaArray],
                        [USER_TYPES.CLIENT, updateUserTypeSchemaArray],
                        [USER_TYPES.ADMIN, updateAdminTypeSchemaArray]
                ]),
                updateUserMiddleware,
                usersController.updateOne);

module.exports = router;
