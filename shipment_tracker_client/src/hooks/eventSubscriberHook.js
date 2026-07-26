import { useEffect } from 'react'

export default function useEventSubscriber(argEmitter, argEventName, argEventCallbackFunk){
  useEffect( () => {
    argEmitter.removeAllListeners(argEventName);      
    argEmitter.addListener( argEventName, argEventCallbackFunk);
      return () => {
        argEmitter.removeListener(argEventName, argEventCallbackFunk);
      }
    },[argEmitter, argEventName, argEventCallbackFunk])
}