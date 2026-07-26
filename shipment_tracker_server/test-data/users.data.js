const { USER_ATTR } = require('../constants/modelConstants');
const { USER_TYPES } = require('../constants/appConstants');

module.exports = [
  {
    [USER_ATTR.USER_ID]: 1,
    [USER_ATTR.FULL_NAME]: "Employee",
    [USER_ATTR.EMAIL]: "employee@employee.com",
    [USER_ATTR.PASSWORD]: "employee",
    [USER_ATTR.USER_TYPE]: USER_TYPES.EMPLOYEE,
    [USER_ATTR.CELL_PHONE]: "123",
  },
  {
    [USER_ATTR.USER_ID]: 2,
    [USER_ATTR.FULL_NAME]: "Admin",
    [USER_ATTR.EMAIL]: "admin@admin.com",
    [USER_ATTR.PASSWORD]: "admin",
    [USER_ATTR.USER_TYPE]: USER_TYPES.ADMIN,
    [USER_ATTR.CELL_PHONE]: "123",
  },
  {
    [USER_ATTR.USER_ID]: 3,
    [USER_ATTR.FULL_NAME]: "Client",
    [USER_ATTR.EMAIL]: "client@client.com",
    [USER_ATTR.PASSWORD]: "client",
    [USER_ATTR.USER_TYPE]: USER_TYPES.CLIENT,
    [USER_ATTR.CELL_PHONE]: "123",
  },
]