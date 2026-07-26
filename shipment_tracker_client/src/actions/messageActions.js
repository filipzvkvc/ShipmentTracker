import { MESSAGE_ACTIONS } from '../constants/actionTypes';
import MESSAGES_TYPES from '../constants/messagesTypes';

export const showMessage = ( argMsg, argMsgType ) => ({        
        type : MESSAGE_ACTIONS.SHOW,
        payload : { message : argMsg, messageType : argMsgType }        
    }); 

export const hideAndRemoveMessage = () => ({
        type:  MESSAGE_ACTIONS.HIDE_AND_REMOVE,
});

export const showErrorMessage = ( argMsg ) => showMessage(argMsg, MESSAGES_TYPES.ERROR);