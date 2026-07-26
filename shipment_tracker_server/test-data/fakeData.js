const { USER_TYPES } = require('../constants/appConstants')
let fakeUsersList = [
  {
    user_id : 1,
    full_name  : "Employee",
    email : "employee@employee.com",
    password : "employee",
    user_type : USER_TYPES.EMPLOYEE
  },
  {
    user_id : 2,
    full_name : "Admin",
    email : "admin@admin.com",
    password : "admin",
    user_type : USER_TYPES.ADMIN
  },
  {
    user_id : 3,
    full_name : "Client",
    email : "client@client.com",
    password : "client",
    user_type : USER_TYPES.CLIENT
  }
];


module.exports = {
  fakeUsersList  
}