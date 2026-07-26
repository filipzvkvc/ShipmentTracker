import USER_TYPES from '../../constants/userTypes';
import buildFakeDataSource from './fakeDataSourceBuilder';




export let testUsersList = [
  {
    user_id : 1,
    full_name  : "Petar Petrovic",
    email : "petar",
    password : "petar",
    user_type : USER_TYPES.USER
  },
  {
    user_id : 2,
    full_name : "Zika Zikic",
    email : "zika",
    password : "zika",
    user_type : USER_TYPES.ADMIN
  }
];

export const userFakeDataSource = buildFakeDataSource(testUsersList, 'user_id');
export const fakeUsersList = testUsersList;