import drawerItems, { userDrawerItemsIds, adminDrawerItemsIds, clientDrawerItemsIds } from '../constants/drawerItemsConstants';
import { USER_TYPES } from '../constants/userTypes';

const _userDrawerItems = drawerItems.filter( drawerItem => userDrawerItemsIds.includes(drawerItem.itemId) )
const _adminDrawerItems = drawerItems.filter( drawerItem => adminDrawerItemsIds.includes(drawerItem.itemId) )
const _clientDrawerItems = drawerItems.filter( drawerItem => clientDrawerItemsIds.includes(drawerItem.itemId) )

export function getDrawerItemsByUserType(argUserType){
    if( argUserType === USER_TYPES.EMPLOYEE){
      return _userDrawerItems;
    }else if(argUserType === USER_TYPES.ADMIN){
      return _adminDrawerItems;
    }else if(argUserType === USER_TYPES.CLIENT){
      return _clientDrawerItems;
    }else {
      throw new Error("User type not valid - drawer items");
    }
}