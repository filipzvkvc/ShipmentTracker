import { AUTH_ACTIONS } from '../constants/actionTypes';
import { authenticate, storeTokenAndUserId, fetchUser, clearTokenAndUserId, getTokenAndUserId } from '../data-source/authDataSource';
import { unknownErrorHandlerFactory } from '../services/utils';
import { validateEmailPassword } from '../services/authServices';


export function logInLocallyRemotely(argEmail, argPassword) {
    return async function (dispatch, getState) {
        try {
            const isFetchingUser = getState().auth.fetchingUser;
            const { validationError } = validateEmailPassword( argEmail, argPassword);
            if( !!validationError ) return unknownErrorHandlerFactory(dispatch)(validationError);

            if(! isFetchingUser ) dispatch( setFetchingUser(true) );
            let authResult = await authenticate( argEmail, argPassword);                                            
            
            const { token , userId } = authResult
            
            await storeTokenAndUserId( token, userId);                                                    
            dispatch( fetchAndStoreUser( Number(userId) ))
        }catch( error) {
            const isFetchingUser = getState().auth.fetchingUser;
            if( isFetchingUser ) dispatch( setFetchingUser(false) );
            unknownErrorHandlerFactory(dispatch)(error);
        }     
    }
}

export function fetchAndStoreUser( argUserId){
    return async function(dispatch, getState){
        const isFetchingUser = getState().auth.fetchingUser;
        try {
            if(! isFetchingUser ) dispatch( setFetchingUser(true) );
            
            let tempUser = await fetchUser(argUserId);             
            dispatch( logInToState( tempUser ) );            
            
            dispatch(  setFetchingUser(false) );
        }catch(error){
            if( isFetchingUser ) dispatch( setFetchingUser(false) );

            dispatch( clearUser() );
            unknownErrorHandlerFactory(dispatch)(error);            
        }
    }
}

export function logInToState(argUser){
    return {
        type : AUTH_ACTIONS.LOG_IN,
        payload : argUser       
    }
}

function logOutToState(){
    return {
        type : AUTH_ACTIONS.LOG_OUT,        
    }
}

export function logOutLocally(){
    return async function ( dispatch, getState){
        return clearTokenAndUserId()                
                .then( result => dispatch( logOutToState() ))
    }
}

export function setFetchingUser(argIsFetching){
    return {
        type : AUTH_ACTIONS.SET_FETCHING_USER,
        payload : argIsFetching
    }
}

export function clearUser(){
    return {
        type: AUTH_ACTIONS.CLEAR_USER
    }
}
