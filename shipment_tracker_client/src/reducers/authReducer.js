import { AUTH_ACTIONS } from '../constants/actionTypes';

const initialState = {
    fetchingUser : true,
    isLogged : false,
    userId : null,
    userType : null,
    fullName : null,
    email : null
}

export default function authReduer(state = initialState, action) {
    switch( action.type ){
        case AUTH_ACTIONS.LOG_IN : 
            return {
                ...state,
                ...action.payload,
                isLogged : true
            }
            
        case AUTH_ACTIONS.LOG_OUT :             
            return {
                isLogged : false
            }

        case AUTH_ACTIONS.SET_FETCHING_USER :            
            return {
                ...state,
                fetchingUser : action.payload
            }            
        case AUTH_ACTIONS.CLEAR_USER : 
            return {
                ...state,
                ...initialState,
                fetchingUser : false                
            }

        default : 
            return state                
    }
}