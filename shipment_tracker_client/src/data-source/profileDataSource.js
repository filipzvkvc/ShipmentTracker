import { getAxiosInstance } from '../data-source/axiosProvider';
import { PROFILE } from '../Settings';
import { mapKeysToCamelCase, mapKeysToSnakeCase } from '../services/utils';
import { userFakeDataSource } from './fake-data-source/fakeDataSource'

import { promiseLogger } from '../services/utils';


export async function remoteFetchUser( argUserId ){

  if( ! PROFILE.FAKE_DATA){
    return getAxiosInstance().get(`/v1/users/${argUserId}`)
      .then( result => result.data)                    
      //.then( promiseLogger)
      .then( unwrappedData => mapKeysToCamelCase( unwrappedData) )                					        
      //.then( promiseLogger)

  }else {
    return userFakeDataSource
            .getOne(argUserId)
            .then( mapKeysToCamelCase );                                
  }    
}

export async function remoteUpdateUser( argUserId, argUserObj){  
  
  if( ! PROFILE.FAKE_DATA){    
    return getAxiosInstance().patch(`/v1/users/${argUserId}`, mapKeysToSnakeCase( argUserObj) );        
  }else {
    return userFakeDataSource.patchOne(argUserId, argUserObj );
  }
}