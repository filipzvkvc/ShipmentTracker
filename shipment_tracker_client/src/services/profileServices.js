import USER_TYPES from '../constants/userTypes';
import { ValidationStatus } from './utils';
import { USER } from '../constants/appConstants';


const userAllowedFileds = [USER.FULL_NAME, USER.OLD_PASSWORD, USER.NEW_PASSWORD];

export function diffUser(argUiUser, argStoreUser){
    if(argStoreUser[USER.FULL_NAME] !== argUiUser[USER.FULL_NAME]) {
        return 1;
    }else if(argUiUser[USER.NEW_PASSWORD].length > 0) {
        return 1;
    }else {
        return 0;
    }        
}

export function validateUserForUpdate( argUiUser){    
    if( !( USER.FULL_NAME in argUiUser && argUiUser[USER.FULL_NAME].length > 0 ) ) return new ValidationStatus(false, "Person name is mandatory field")    
    const { [USER.OLD_PASSWORD] : oldPassword, [USER.NEW_PASSWORD] : newPassowrd } = argUiUser;
    
    const oldPasswordLength = oldPassword.length;
    const newPasswordLength = newPassowrd.length;
    if( oldPasswordLength === 0 && newPasswordLength === 0) return new ValidationStatus(true, null);
    
    if( newPasswordLength !== 0 && oldPasswordLength === 0) return new ValidationStatus(false, "Please specify old password")            
    return new ValidationStatus(true, null);
}