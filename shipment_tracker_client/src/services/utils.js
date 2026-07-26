import { showMessage } from '../actions/messageActions';
import MESSAGES_TYPES from '../constants/messagesTypes';
import camelCase  from 'camelcase';
import { snakeCase } from 'snake-case';


function extractErrorString( error){
  let tempErrorMsg = (Array.isArray(error.response.data) ? error.response.data[0] : error.response.data).toString().trim();
  tempErrorMsg = tempErrorMsg.replace(/^\s*Error\s*:*\s*/i, "");
  return tempErrorMsg
}

export const errorHandlerFactory = (dispatch) => (error) => {
  if(error?.response?.data != null){
    dispatch( showMessage( extractErrorString(error), MESSAGES_TYPES.ERROR ) );
  }else {
    dispatch( showMessage( error.request ? "Server not response" : error.message , MESSAGES_TYPES.ERROR) );
  }    
}

export const unknownErrorThanActionHandlerFactory = (dispatch) => (error, actionFunctionOrObj) => {
    let dispatchResult;

    if( error instanceof Error){
        if( error?.response?.data != null){
          dispatchResult = dispatch( showMessage( extractErrorString(error), MESSAGES_TYPES.ERROR ) )
        }else {
          dispatchResult = dispatch( showMessage(error.message, MESSAGES_TYPES.ERROR) );
        }
    }else if( typeof error === 'string'){
        dispatchResult = dispatch( showMessage( error, MESSAGES_TYPES.ERROR ) );
    }else {
        dispatchResult = dispatch( showMessage( error, MESSAGES_TYPES.ERROR ) );
    }

    if( actionFunctionOrObj == null){
        return dispatchResult;
    }else if( typeof actionFunctionOrObj === 'function'){
        return dispatch( actionFunctionOrObj() );
    }else {
        return dispatch( actionFunctionOrObj );
    }
    
}

export const unknownErrorHandlerFactory = (dispatch) => (error) => {
    if( error instanceof Error){
        if(error.response && error.response.data){              
          
          let tempErrorMsg = (Array.isArray(error.response.data) ? error.response.data[0] : error.response.data).toString().trim();
          tempErrorMsg = tempErrorMsg.replace(/^\s*Error\s*:*\s*/i, "");
          
          dispatch( showMessage(tempErrorMsg, MESSAGES_TYPES.ERROR) );            
        }else{
          dispatch( showMessage(error.message, MESSAGES_TYPES.ERROR) );
        }
    }else if( typeof error === 'string'){
        dispatch( showMessage( error, MESSAGES_TYPES.ERROR ) );
    }
}

export function mapKeysToCamelCase( argObject , argExcludeAry ){
    if( typeof argExcludeAry === 'undefined' || argExcludeAry === null){
        argExcludeAry = [];
    }

    if(!( argExcludeAry instanceof Array) ){
        throw new Error("Exclude array is not of array type")
    } 

    let resultObj = {};
        
    let tempResult2 = Object.keys( argObject )         
        .map( key => ({ original : key ,  cameled : camelCase(key), value : argObject[key] }) )
        .filter( originalAndCameled => ! (argExcludeAry.includes(originalAndCameled.original) || argExcludeAry.includes(originalAndCameled.cameled) ) )
        .forEach( originalAndCameled => { resultObj[originalAndCameled.cameled] = originalAndCameled.value} )
    
        return resultObj;        
}

export function mapKeysToSnakeCase( argObj ){
    const objEntries = Object.entries( argObj)
            .map(([key,value]) => [snakeCase(key), value] )
    return Object.fromEntries( objEntries );
}

export function isDefined( arg){
    return typeof arg !== 'undefined';
}

export function isDefinedAndNotNull( arg ){
    return typeof arg !== 'undefined' && arg !== null;
}

export function isUndefined( arg){
    return typeof arg === 'undefined';
}

export const EMPTY_STRING = "";

export class ValidationStatus {
    constructor( success, msg){
        this.success = success;
        this.msg = msg;
    }
}

export function promiseLogger( value ){
    // console.log(value)
    return value;
}

export function titledPromiseLogger( argMessage ){
    return function( value ) {
        // console.log( argMessage );
        return promiseLogger( value );
    }
}