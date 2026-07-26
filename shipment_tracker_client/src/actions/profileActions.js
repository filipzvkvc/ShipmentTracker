import { validateUserForUpdate, diffUser } from '../services/profileServices';
import { remoteUpdateUser } from '../data-source/profileDataSource';
import { PROFILE_EVENTS } from '../constants/eventTypes';
import { unknownErrorThanActionHandlerFactory } from '../services/utils';
import { USER } from '../constants/appConstants'
import { showMessage } from './messageActions';
import MESSAGE_TYPES from '../constants/messagesTypes'


export function updateUser(argUiPersonName, argUiEmail, argUiOldPassword,argUiNewPassword, argStateUser){
  return async function (dispatch, getState) {
    const tempUiUser = {
      [USER.FULL_NAME] : argUiPersonName,
      [USER.EMAIL] : argUiEmail,
      [USER.OLD_PASSWORD] : argUiOldPassword || "",
      [USER.NEW_PASSWORD] : argUiNewPassword || ""
    };

    const tempUserId = getState().auth.userId

    try {
      const tempValidatioResult = validateUserForUpdate( tempUiUser);
      if( ! tempValidatioResult.success ){
        throw new Error( tempValidatioResult.msg );
      }
      if( diffUser( tempUiUser, argStateUser ) !== 0){
        delete tempUiUser[USER.EMAIL];                
        if(tempUiUser[USER.NEW_PASSWORD].length === 0){
          delete tempUiUser[USER.NEW_PASSWORD];
          delete tempUiUser[USER.OLD_PASSWORD];
        }
        await remoteUpdateUser(tempUserId, tempUiUser);                  
        getState().events.profileEmitter.emit( PROFILE_EVENTS.REFETCH_USER_ACCOUNT);                          
        dispatch( showMessage("User successfully updated", MESSAGE_TYPES.SUCCESS) )
      }
              
    }catch(error){        
      unknownErrorThanActionHandlerFactory( dispatch)(error);      
      getState().events.profileEmitter.emit( PROFILE_EVENTS.RESET_UI_INPUT_VALUES);     
    }
  }
}