import { mapKeysToCamelCase, promiseLogger, titledPromiseLogger } from '../services/utils';
import { fakeUsersList }  from './fake-data-source/fakeDataSource';
import { AUTH_SETTINGS } from '../Settings';
import { getAxiosInstance } from './axiosProvider';
import EventEmitter from 'events';
import { TOKEN_EVENTS } from '../constants/eventTypes';
import { STORAGE_KEYS } from '../constants/appConstants';
import { USER} from '../constants/appConstants'
import { S_USER } from '../constants/serverContract'

import { userFakeDataSource } from './fake-data-source/fakeDataSource'

export const tokenEventEmitter = new EventEmitter();


export async function authenticate( argEmail, argPassword){
  if( ! AUTH_SETTINGS.FAKE_DATA){
    return getAxiosInstance().post('/v1/auth/login', {
      [S_USER.EMAIL] : argEmail,
      [S_USER.PASSWORD] : argPassword
    })
      .then( result => result.data)
      .then( unwrappedData => mapKeysToCamelCase( unwrappedData) )            
	}else {    
    const fakeUserIndex = 1
		return mapKeysToCamelCase({
			token : "fake_token",			
			user_id : fakeUsersList[fakeUserIndex][S_USER.USER_ID],
      user_type : fakeUsersList[fakeUserIndex][S_USER.USER_TYPE],
      full_name : fakeUsersList[fakeUserIndex][S_USER.FULL_NAME]
		})
  }
}

export async function fetchUser( argUserId){
    if ( typeof argUserId !== 'number') return Promise.reject("User Id must be a number");
	
	if( ! AUTH_SETTINGS.FAKE_DATA){
    return getAxiosInstance().get(`/v1/users/${argUserId}`)
                  .then( result => result.data)                    
                  .then( unwrappedData => mapKeysToCamelCase( unwrappedData) )                					
                  .then(  ({ userId , userType, fullName}) => ({userId , userType, fullName }) )


	}else {
    const testError = false;
    if(testError){
        return new Promise((resolve, reject ) => setTimeout(() => { /* console.log("About to reject promise"); */ reject("Auth test error - fetch user"); }, 500));
    }else {        
        return new Promise(( resolve, reject) => setTimeout( () => {          
          try { resolve(fakeUsersList.find( el => el.user_id === argUserId) ) }
          catch(error) { reject(error) }
        }, 1000))                    
            .then( data => mapKeysToCamelCase( data) )
            .then( ({ deviceId, ...data }) => ({userId : deviceId, ...data }) )                        
            .then( titledPromiseLogger("Data fetching - User"))
    }
	}
}

export async function storeTokenAndUserId( argToken, argUserId){
  window.localStorage.setItem(STORAGE_KEYS.TOKEN, argToken);
  window.localStorage.setItem(STORAGE_KEYS.USER_ID, argUserId)
  tokenEventEmitter.emit(TOKEN_EVENTS.TOKEN_CHANGED);
}

export function getTokenAndUserId() {
  const token = window.localStorage.getItem( STORAGE_KEYS.TOKEN);

  if (token == null){
    return null
  }else {
    return {
      token,
      userId : Number( window.localStorage.getItem(STORAGE_KEYS.USER_ID) )
    }
  }
}

export function getUserId(){
  let tempUserId = window.localStorage.getItem( STORAGE_KEYS.USER_ID )
  if(tempUserId != null){
    tempUserId = Number(tempUserId);
  }
  
  return tempUserId;
}

export async function forgotPassword(email) {
  return getAxiosInstance().post('/v1/auth/forgottenpassword', { email });
}

export async function resetPassword(token, newPassword, newAgainPassword) {
  return getAxiosInstance().post(`/v1/auth/resetpassword?reset_password_token=${token}`, {
    new_password: newPassword,
    new_again_password: newAgainPassword,
  });
}

export async function clearTokenAndUserId(){
  window.localStorage.removeItem(STORAGE_KEYS.TOKEN);
  window.localStorage.removeItem(STORAGE_KEYS.USER_ID);
  tokenEventEmitter.emit(TOKEN_EVENTS.TOKEN_CHANGED);
}