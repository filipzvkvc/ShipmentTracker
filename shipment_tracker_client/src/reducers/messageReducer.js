import ACTIONS from '../constants/actionTypes';
const initialState = {    
    messageType : null,
    message : ''
};

export default function messageReducer(state = initialState, action){
    switch( action.type){
        case ACTIONS.MESSAGE.SHOW : return {
            ...state,
            hasMessage : true,            
            messageType : action.payload.messageType,
            message : action.payload.message
        }

        case ACTIONS.MESSAGE.HIDE_AND_REMOVE :
        case ACTIONS.AUTH.LOG_OUT : return {
            ...state,
            hasMessage : false,
            messageType : null,
            message : null
        }

        default : return state;
        
    }
}