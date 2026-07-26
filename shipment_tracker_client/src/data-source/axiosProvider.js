import axios from 'axios';
import { BASE_URL} from '../constants/appConstants';
import { tokenEventEmitter, getTokenAndUserId } from './authDataSource';
import { TOKEN_EVENTS } from '../constants/eventTypes'

//const axios = axiosFromLibrary.defaults 

let _axiosCreateOptions = {
  baseURL : BASE_URL
};

let _instance;

let _instanceNoBaseUrl;

export function recreateAxios(){
  const axiosOptTemplate = {
    baseURL : BASE_URL
  }

  _axiosCreateOptions = {
    ...axiosOptTemplate
  };

  const tempTokenAndUserId = getTokenAndUserId()  
  
  let tempNoBaseUrl = {};

  if( tempTokenAndUserId ){
    const { token : tempLocalStorageToken } = getTokenAndUserId()
    _axiosCreateOptions.headers = {
      'Authorization' : `Bearer ${tempLocalStorageToken}`
    }
    tempNoBaseUrl.headers = { ..._axiosCreateOptions.headers };
  }

  
  _instance = axios.create(_axiosCreateOptions);
  _instanceNoBaseUrl = axios.create( tempNoBaseUrl );
}

recreateAxios();


tokenEventEmitter.on( TOKEN_EVENTS.TOKEN_CHANGED, recreateAxios)

function getInstance(){
  return _instance;
}

 function getAxiosNoBaseUrl(){
  return _instanceNoBaseUrl;
}

export { getInstance as getAxiosInstance};
export { recreateAxios as recreateAxiosInstance };
export { getAxiosNoBaseUrl };
