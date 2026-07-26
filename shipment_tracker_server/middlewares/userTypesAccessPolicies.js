const { accessPolicyMiddlewareFactory } = require('./accessPolicyMiddlewareFactory');
const { USER_TYPES } = require('../constants/appConstants');

module.exports.allowUserPolicyMiddleware = accessPolicyMiddlewareFactory([USER_TYPES.EMPLOYEE]);
module.exports.allowAdminPolicyMiddleware = accessPolicyMiddlewareFactory([USER_TYPES.ADMIN]);
module.exports.allowUserAndAdminPolicyMiddleware = accessPolicyMiddlewareFactory([USER_TYPES.EMPLOYEE,USER_TYPES.ADMIN])